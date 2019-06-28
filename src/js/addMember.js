const firestore = firebase.firestore();

/*when document is ready*/
$(document).ready(function () {


    $('input, textarea').focus(function () {
        $(this).parents('.form-group').addClass('focused');
    });

    $('input, textarea').blur(function () {
        var inputValue = $(this).val();
        if (inputValue == "") {
            $(this).removeClass('filled');
            $(this).parents('.form-group').removeClass('focused');
        } else {
            $(this).addClass('filled');
        }
    })

    $('#confirmBtn').click(() => {
        document.location.href = "addMember.html";

    })

    getGroupsData().then(groupsData => {
        $('#loader').removeClass('active'); // remove the loader .
        updateProffesionDiv(); // Initialize the line of "is Adult"

        $("#isAdult").change(updateProffesionDiv); // listener to changes at "is Adult"
        setGroups(groupsData);
        $("#form-Add").submit(function (event) {
            event.preventDefault();
            /* attach html elements*/
            addNewMember();
        });
    })



    $('select').change(function () {
        $(this).css("cssText", "box-shadow: 0 2px 0 0 rgb(165, 221, 165) !important;");
    })

});


/*dynamicly set groups name at the drop-down select tag of groups (fetch data from the data base)*/
function setGroups(groupsData) {
    let str = '<option disabled value="" selected value>בחר קבוצה</option>';
    if (groupsData) {
        for (let i = 0; i < groupsData.length; i++)
            str += '<option value="' + groupsData[i].groupName + '">' + groupsData[i].groupName + '</option>'
        $("#group").append(str);
    } else {
        console.log("there is no groups yet. so appent nothing")
        $("#group").append(str);
    }

}

function updateMemberSession(TheNewMember) {
    console.log("memberlist session")
    if (sessionStorage.getItem("memberList") === null) // there is nothing in the session so no need to update
        return;

    let memberList = JSON.parse(sessionStorage.getItem('memberList'));
    memberList.push({
        AnotherEducation: TheNewMember.AnotherEducation,
        Comments: TheNewMember.Comments,
        Date: TheNewMember.Date,
        FinancialMonitoring: TheNewMember.FinancialMonitoring,
        First: TheNewMember.First,
        Grade: TheNewMember.Grade,
        Group: TheNewMember.Group,
        Key: TheNewMember.Key,
        IsInstructor: TheNewMember.IsInstructor,
        Last: TheNewMember.Last,
        ParentPhoneNum: TheNewMember.ParentPhoneNum,
        PersonalTracking: TheNewMember.PersonalTracking,
        PhoneNum: TheNewMember.PhoneNum,
        School: TheNewMember.School,
        YouthMovement: TheNewMember.YouthMovement,
        IsAdult: TheNewMember.IsAdult,
        AdultProffesion: TheNewMember.AdultProffesion
    });
    sessionStorage.setItem('memberList', JSON.stringify(memberList));
}

function updateAdultSession(TheNewMember) {
    console.log("adult session")
    if (sessionStorage.getItem("adltList") === null) // there is nothing in the session so no need to update
        return;

    let adltList = JSON.parse(sessionStorage.getItem('adltList'));
    adltList.push({
        AnotherEducation: TheNewMember.AnotherEducation,
        Comments: TheNewMember.Comments,
        Date: TheNewMember.Date,
        FinancialMonitoring: TheNewMember.FinancialMonitoring,
        First: TheNewMember.First,
        Grade: TheNewMember.Grade,
        Group: TheNewMember.Group,
        Key: TheNewMember.Key,
        IsInstructor: TheNewMember.IsInstructor,
        Last: TheNewMember.Last,
        ParentPhoneNum: TheNewMember.ParentPhoneNum,
        PersonalTracking: TheNewMember.PersonalTracking,
        PhoneNum: TheNewMember.PhoneNum,
        School: TheNewMember.School,
        YouthMovement: TheNewMember.YouthMovement,
        IsAdult: TheNewMember.IsAdult,
        AdultProffesion: TheNewMember.AdultProffesion
    });
    sessionStorage.setItem('adltList', JSON.stringify(adltList));
}
/** update the memeberList that located in the sessionStorage - add the new memeber  */
function updateSession(TheNewMember) {
    console.log(TheNewMember);
    console.log(TheNewMember.IsAdult);
    if (TheNewMember.IsAdult === "true")
        updateAdultSession(TheNewMember);
    else
        updateMemberSession(TheNewMember);

}
/** add the Id to the member that we just added to firebase  */
function addId(docRef, TheNewMember) {
    firestore.collection("Members").doc(docRef.id).set({
            Key: docRef.id // add the key of firebase to the data.
        }, {
            merge: true
        })
        .then(function () {
            TheNewMember.Key = docRef.id // update TheNewMember object
            updateSession(TheNewMember);
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });

}
/*when charge value of "isAdult" to "yes" proffesionDiv is hiden*/
function updateProffesionDiv() {
    let elm = $("#isAdult");
    if (elm.val() !== "true") {
        $("#proffesionDiv").hide();
        $("#nullDiv").show();
    } else {
        $("#proffesionDiv").show();
        $("#nullDiv").hide();

    }
}

function getGroupsData() {
    return new Promise((resolve) => { // resolve <--->is need with promise.
        let groupsData = []; // save all the member data.

        if (sessionStorage.getItem("groupsData") === null || JSON.parse(sessionStorage.getItem('groupsData')).length === 0) { // if its the first time 
            console.log("groupsData is from FireBase")
            firestore.collection("Groups").get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        const group = doc.data(); // pointer for document
                        groupsData.push(group); // add for array of all names
                    })

                    sessionStorage.setItem('groupsData', JSON.stringify(groupsData)); // save it temporeriy
                    resolve(groupsData);
                })

        } else {
            groupsData = JSON.parse(sessionStorage.getItem('groupsData'));
            console.log("groupsData is from session")
            resolve(groupsData);
        }

    })

}

function addNewMember() {
    const firstName = $("#first-name").val();
    const lastName = $("#last-name").val();
    const date = $("#date").val();
    let group = $("#group").val();
    if (group == null)
        group = "לא משויך לקבוצה";
    const comments = $("#comments").val();
    const school = $("#school").val();
    const phoneNum = $("#phone-num").val();
    let grade = $("#grade").val();
    if (grade == null)
        grade = "";
    const parentPhoneNum = $("#parent-phone-num").val();
    const youthMovement = $("#youth-movement").val();
    const anotherEducation = $("#another-education").val();
    let isInstructor = $("#is-instructor").val();
    if (isInstructor == null)
        isInstructor = "false";
    const isAdult = $("#isAdult").val();
    let adultProffesion;
    if (isAdult === "true") {
        adultProffesion = $("#adultProffesion").val();
        console.log(adultProffesion);
    } else
        adultProffesion = "";
    let personalTracking = [];
    let financialMonitoring = [];

    let TheNewMember = {
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
        addId(docRef, TheNewMember);

        $('#successfully-add').modal('setting', 'closable', false)
            .modal('show');
        $(".add-btn").modal({
            closable: false
        });

        $('#form-Add')[0].reset();

    }).catch(function (error) {
        console.log("got error!!!", error)
    });


}