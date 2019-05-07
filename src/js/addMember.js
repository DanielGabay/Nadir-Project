const firestore = firebase.firestore();

/*when document is ready*/
$(document).ready(function () {
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

        /*the data of this user will be stored at this location*/
        const Path = "Members/" + firstName + "-" + lastName;
        const docRef = firestore.doc(Path); // pointer to the place we add the data

        let personalTracking = [];
        let financialMonitoring = [];

        /* make the object to add ===> key : value */
        docRef.set({
            First: firstName,
            Last: lastName,
            Date: date,
            Group: group,
            School: school,
            PhoneNum: phoneNum,
            Grade: grade,
            ParentPhoneNum: parentPhoneNum,
            YouthMovement: youthMovement,
            AnotherEducation: anotherEducation,
            IsInstructor: isInstructor,
            Comments: comments,
            PersonalTracking: personalTracking,
            FinancialMonitoring: financialMonitoring
        }).then(function () {
            console.log("Member added!");
        }).catch(function (error) {
            console.log("got error!!!", error)
        });
     });
    
});


/*dynamicly set groups name at the drop-down select tag of groups (fetch data from the data base)*/
function setGroups() {
    const Path = "groups/groups";
    const docRef = firestore.doc(Path); // pointer to the place we add the data
    let str = '<option disabled value="" selected value>בחר קבוצה</option>';

    docRef.get().then(function (doc) { //  onsnapshot will do it faster
        if (doc && doc.exists) {
            const groups = doc.data();
            let groupsNames = groups.names;
            for (let i = 0; i < groupsNames.length; i++)
                str += '<option value="' + groupsNames[i] + '">' + groupsNames[i] + '</option>'
            $("#group").append(str);
        }
    });

}

function loading(id){
    
}


function deleteMemeber(firstName, lastName) {
    const Path = "Users/" + firstName + " " + lastName;
    const docRef = firestore.doc(Path); // pointer to the place we add the data

    docRef.delete().then(function () {
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });
}


