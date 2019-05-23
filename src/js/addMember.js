const firestore = firebase.firestore();

/*when document is ready*/
$(document).ready(function () {
    updateProffesionDiv(); // Initialize the line of "is Adult"
    $("#isAdult").change(updateProffesionDiv); // listener to changes at "is Adult"

    setGroups();
    $("#form-Add").submit(function (event) {
        event.preventDefault();
        /* attach html elements*/
        const firstName = $("#first-name").val();
        const lastName = $("#last-name").val();
        const date = $("#date").val();
        const group = $("#group").val();
        const comments = $("#comments").val();
        const school = $("#school").val();
        const phoneNum = $("#phone-num").val();
        const grade = $("#grade").val();
        const parentPhoneNum = $("#parent-phone-num").val();
        const youthMovement = $("#youth-movement").val();
        const anotherEducation = $("#another-education").val();
        const isInstructor = $("#is-instructor").val();
        const isAdult = $("#isAdult").val();
        const adultProffesion = $("#adultProffesion").val();


        let personalTracking = [];
        let financialMonitoring = [];

        let TheNewMemeber = {
            AnotherEducation: anotherEducation,
            Comments: comments,
            Date: date,
            FinancialMonitoring: financialMonitoring,
            First: firstName,
            Grade: grade,
            Group: group,
            IsInstructor: isInstructor,
            Last: lastName,
            ParentPhoneNum: parentPhoneNum,
            PersonalTracking: personalTracking,
            PhoneNum: phoneNum,
            School: school,
            YouthMovement: youthMovement,
            IsAdult: isAdult,
            AdultProffesion: adultProffesion
        }

        /* make the object to add ===> key : value */
        firestore.collection("Members").add({ // add the member with Auto id 
            AnotherEducation: anotherEducation,
            Comments: comments,
            Date: date,
            FinancialMonitoring: financialMonitoring,
            First: firstName,
            Grade: grade,
            Group: group,
            IsInstructor: isInstructor,
            Last: lastName,
            ParentPhoneNum: parentPhoneNum,
            PersonalTracking: personalTracking,
            PhoneNum: phoneNum,
            School: school,
            YouthMovement: youthMovement,
            IsAdult: isAdult,
            AdultProffesion: adultProffesion

        }).then(function (docRef) {
            addId(docRef, TheNewMemeber);


            $('#successfully-add').modal('show');
            $(".add-btn").modal({
                closable: true
            });

            $('#form-Add')[0].reset();

        }).catch(function (error) {
            console.log("got error!!!", error)
        });

    });
});


/*dynamicly set groups name at the drop-down select tag of groups (fetch data from the data base)*/
function setGroups() {
    const Path = "Groups/groups";
    const docRef = firestore.doc(Path); // pointer to the place we add the data
    let str = '<option disabled value="" selected value>בחר קבוצה</option>';

    docRef.get().then(function (doc) { //  onsnapshot will do it faster
        if (doc && doc.exists) {
            const groups = doc.data().groupsData;
            sessionStorage.setItem('groupsData', JSON.stringify(groups)); // save the groups in our session storage
            for (let i = 0; i < groups.length; i++)
                str += '<option value="' + groups[i].groupName + '">' + groups[i].groupName + '</option>'
            $("#group").append(str);
        }
    });

}

/** update the memeberList that located in the sessionStorage - add the new memeber  */
function updateSession(TheNewMemeber) {

    console.log("we gonna add this 1 to the sesstion: " + TheNewMemeber);
    if (sessionStorage.getItem("memberList") === null) // there is nothing in the session so no need to update
        return;

    let memeberList = JSON.parse(sessionStorage.getItem('memberList'));
    memeberList.push({
        AnotherEducation: TheNewMemeber.AnotherEducation,
        Comments: TheNewMemeber.Comments,
        Date: TheNewMemeber.Date,
        FinancialMonitoring: TheNewMemeber.FinancialMonitoring,
        First: TheNewMemeber.First,
        Grade: TheNewMemeber.Grade,
        Group: TheNewMemeber.Group,
        Key: TheNewMemeber.Key,
        IsInstructor: TheNewMemeber.IsInstructor,
        Last: TheNewMemeber.Last,
        ParentPhoneNum: TheNewMemeber.ParentPhoneNum,
        PersonalTracking: TheNewMemeber.PersonalTracking,
        PhoneNum: TheNewMemeber.PhoneNum,
        School: TheNewMemeber.School,
        YouthMovement: TheNewMemeber.YouthMovement,
        IsAdult: TheNewMemeber.IsAdult,
        AdultProffesion: TheNewMemeber.AdultProffesion
    });
    sessionStorage.setItem('memberList', JSON.stringify(memeberList));
    console.log("session updated with the new member!");
}
/** add the Id to the member that we just added to firebase  */
function addId(docRef, TheNewMemeber) {
    firestore.collection("Members").doc(docRef.id).set({
            Key: docRef.id // add the key of firebase to the data.
        }, {
            merge: true
        })
        .then(function () {
            TheNewMemeber.Key = docRef.id // update TheNewMemeber object
            updateSession(TheNewMemeber);
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });

}
/*when charge value of "isAdult" to "yes" proffesionDiv is hiden*/
function updateProffesionDiv() {
    let elm = $("#isAdult");
    console.log(elm.val());
    if (elm.val() !== "true") {
        $("#proffesionDiv").hide();
        $("#nullDiv").show();
    } else {
        $("#proffesionDiv").show();
        $("#nullDiv").hide();

    }
}