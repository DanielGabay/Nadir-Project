const firestore = firebase.firestore();

$(document).ready(function(){
    setGroups();
    
    const addForm = document.querySelector("#form-Add");
    addForm.addEventListener("submit", function () {
        /* attach the html elements*/
    
        const firstName = document.querySelector("#first-name").value;
        const lastName = document.querySelector("#last-name").value;
        const date = document.querySelector("#date").value;
        const group = document.querySelector("#group").value;
        const comments = document.querySelector("#comments").value; 
        const school = document.querySelector("#school").value;
        const phoneNum = document.querySelector("#phone-num").value;
        const grade = document.querySelector("#grade").value; //
        const parentPhoneNum = document.querySelector("#parent-phone-num").value;
        const youthMovement = document.querySelector("#youth-movement").value;
        const anotherEducation = document.querySelector("#another-education").value; //
        const isInstructor = document.querySelector("#is-instructor").value;
    
        /*the data of this user will store in this location*/
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
            PersonalTracking :personalTracking,
            FinancialMonitoring: financialMonitoring
    
        }).then(function () {
            console.log("status  saved");
        }).catch(function (error) {
            console.log("got error!!!", error)
        });
    });
});

function setGroups() {
    const Path = "groups/groups";
    const docRef = firestore.doc(Path); // pointer to the place we add the data
    let str = '<option disabled value="" selected value>בחר קבוצה</option>';
  
    docRef.get().then(function (doc) { //  onsnapshot will do it faster
        if (doc && doc.exists) {
            const theData = doc.data();
            var names = theData.names;
            for (let i = 0; i < names.length; i++)
                str += '<option value="' + names[i] + '">' + names[i] + '</option>'
            $("#group").append(str);
        }
    });
    
}


function deleteMemeber(firstName,lastName)
{
    const Path = "Users/" + firstName + "-" + lastName;
    const docRef = firestore.doc(Path); // pointer to the place we add the data

    docRef.delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });


}

