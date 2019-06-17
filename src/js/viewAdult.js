const firestore = firebase.firestore();
let theAdult = [];
let updateAdult = {};

$(document).ready(function () {
  $("#payment-track-btn").click(function () {
    document.location.href = "viewMemberFinancial.html";
  });

  $("#personal-track-btn").click(function () {
    document.location.href = "viewMemberComments.html";
  })

  let selectedPersonKey = sessionStorage.getItem('selectedPersonKey');
  console.log("we passed this data to the next screen:" + selectedPersonKey);
  theAdult = JSON.parse(sessionStorage.getItem('adltList')).find(x => x.Key === selectedPersonKey);
  updateAdult = JSON.parse(sessionStorage.getItem('adltList')).find(x => x.Key === selectedPersonKey);
  console.log("this is who we need:" + theAdult.Key);
  getGroupsData();
  setFields(); //set the page of the adult
});

function setFields() { //set the fields with info of wanted adult
  $("#nameTitle").append(theAdult.First + " " + theAdult.Last);
  $("#first-name").val(theAdult.First);
  $("#last-name").val(theAdult.Last);
  $("#date").val(theAdult.Date.split('-').reverse().join('/')); // will show in the right way dd/mm/yyyy
  $("#adlt-proffesion").val(theAdult.AdultProffesion);
  $("#group").val(theAdult.Group);
  $("#comments").val(theAdult.Comments);
  $("#school").val(theAdult.School);
  if (theAdult.Grade != null && theAdult.Grade != "")
    $("#grade").val(theAdult.Grade + "'");
  $("#phone-num").val([theAdult.PhoneNum.slice(0, 3), "-", theAdult.PhoneNum.slice(3)].join('')); //add '-' after 3 digit
  if (theAdult.ParentPhoneNum != "")
    $("#parent-phone-num").val([theAdult.ParentPhoneNum.slice(0, 3), "-", theAdult.ParentPhoneNum.slice(3)].join('')); //add '-' after 3 digit
  $("#youth-movement").val(theAdult.YouthMovement);
  $("#another-education").val(theAdult.AnotherEducation);
  if (theAdult.IsInstructor == "false")
    $("#is-instructor").val("לא");
  else
    $("#is-instructor").val("כן");
}

function updateMemDetails() {
  if (theAdult) {
    if ($("#edit-btn").text() == "עריכה") { // edit btn was clicked, remove read only for all input
      $("#mmbr-btn").hide(); //hide the move to adult button after edit
      $("#edit-btn").text("שמור").append("<i class='save icon'></i>");
      $("#first-name").removeAttr("readonly");
      $("#last-name").removeAttr("readonly");
      $("#date").removeAttr("readonly");
      $("#date").attr("type", "date");
      $("#date").val(updateAdult.Date);
      $("#group").removeAttr("readonly");
      $("#adlt-proffesion").removeAttr("readonly");
      $("#adlt-proffesion").val(theAdult.AdultProffesion);
      $("#group").replaceWith("<select class='ui fluid dropdown' id='group'></select>");
      $("#group").append(displayGroups());
      $("#group").val(theAdult.Group);
      $("#comments").removeAttr("readonly");
      $("#school").removeAttr("readonly");
      $("#phone-num").removeAttr("readonly");
      $("#phone-num").attr("type", "number");
      $("#phone-num").val(theAdult.PhoneNum);
      $("#grade").removeAttr("readonly");
      $("#grade").replaceWith("<select class='ui fluid dropdown' id='grade'><option value='ז'>ז'</option><option value='ח'>ח'</option><option value='ט'>ט'</option><option value='י'>י'</option><option value='יא'>י''א</option><option value='יב'>י''ב</option></select>");
      $("#grade").val(theAdult.Grade);
      $("#parent-phone-num").removeAttr("readonly");
      $("#parent-phone-num").attr("type", "number");
      $("#parent-phone-num").val(theAdult.ParentPhoneNum);
      $("#youth-movement").removeAttr("readonly");
      $("#another-education").removeAttr("readonly");
      $("#is-instructor").replaceWith("<select class='ui fluid dropdown' id='is-instructor' ><option value='false'>לא</option><option value='true'>כן</option></select>");
      $("#is-instructor").val(theAdult.IsInstructor);
    } else if ($("#edit-btn").text() == "שמור") { //save btn was clicked 
      updateAdult.First = $("#first-name").val();
      updateAdult.Last = $("#last-name").val();
      updateAdult.PhoneNum = $("#phone-num").val();
      if (updateAdult.First == "" || updateAdult.Last == "" || updateAdult.PhoneNum == "") {
        $('#required-section').modal('show');
        return;
      }
      $("#edit-btn").text("עריכה").append("<i class='edit icon'></i>");
      $("#mmbr-btn").show(); //show the move to adult button after save
      //create new obj for update adu,t
      updateAdult.Date = $("#date").val();
      updateAdult.AdultProffesion = $("#adlt-proffesion").val();
      updateAdult.Group = $("#group").val();
      updateAdult.Comments = $("#comments").val();
      updateAdult.School = $("#school").val();
      updateAdult.Grade = $("#grade").val();
      updateAdult.ParentPhoneNum = $("#parent-phone-num").val();
      updateAdult.YouthMovement = $("#youth-movement").val();
      updateAdult.AnotherEducation = $("#another-education").val();
      updateAdult.IsInstructor = $("#is-instructor").val();

      // if change where make save data in database and session
      if (JSON.stringify(updateAdult) !== JSON.stringify(theAdult))
        updateFunc();

      //return to edit - display after update if need
      $("#first-name").attr("readonly", "");
      $("#last-name").attr("readonly", "");
      $("#date").attr("readonly", "");
      $("#date").attr("type", "text");
      $("#date").val(updateAdult.Date);
      $("#adlt-proffesion").attr("readonly", "");
      $("#adlt-proffesion").val(updateAdult.AdultProffesion);
      $("#group").replaceWith("<input type='text' readonly='' id='group'>"); //disable select 
      $("#group").val(updateAdult.Group);
      $("#comments").attr("readonly", "");
      $("#school").attr("readonly", "");
      $("#phone-num").attr("readonly", "");
      $("#phone-num").attr("type", "text");
      $("#phone-num").val([theAdult.PhoneNum.slice(0, 3), "-", theAdult.PhoneNum.slice(3)].join('')); //add '-' after 3 digit
      $("#grade").replaceWith("<input readonly='' id='grade'>"); //disable select
      if (updateAdult.Grade != null && updateAdult.Grade != "")
        $("#grade").val(updateAdult.Grade + "'");
      $("#parent-phone-num").attr("readonly", "");
      $("#parent-phone-num").attr("type", "text");
      if (theAdult.ParentPhoneNum != "")
        $("#parent-phone-num").val([theAdult.ParentPhoneNum.slice(0, 3), "-", theAdult.ParentPhoneNum.slice(3)].join('')); //add '-' after 3 digit
      $("#youth-movement").attr("readonly", "");
      $("#another-education").attr("readonly", "");
      $("#is-instructor").replaceWith("<input readonly='' id='is-instructor'>"); //disable select
      if (updateAdult.IsInstructor == "false")
        $("#is-instructor").val("לא");
      else
        $("#is-instructor").val("כן");
    }
  }
}

function moveToMember() {
  let selectedPersonKey = sessionStorage.getItem('selectedPersonKey');
  let memberList = JSON.parse(sessionStorage.getItem('memberList'));
  let adltList = JSON.parse(sessionStorage.getItem('adltList'));
  let foundIndex = adltList.findIndex(x => x.Key == selectedPersonKey); //index of wanted adult

  $('.mmbr-btn')
    .modal({
      allowMultiple: false
    });
  // attach events to buttons
  $('#acpt-mmbr-section')
    .modal('attach events', '#mmbr-section #move-mmbr')
    .click(function () { //move from session memberList to adultList and update the databse
      if (foundIndex > -1) {
        updateAdult.IsAdult = "false";
        updateAdult.AdultProffesion = "";
        if (memberList != null) { //check if the adult list is improved
            memberList.push(updateAdult);
          sessionStorage.setItem('memberList', JSON.stringify(memberList)); // save it in session
        }
        adltList.splice(foundIndex, 1);
        sessionStorage.setItem('adltList', JSON.stringify(adltList)); //save to session after delete
  
        ///update database
        let updateRef = firestore.collection("Members").doc(selectedPersonKey);
  
        updateRef.update({
            First: updateAdult.First,
            Last: updateAdult.Last,
            Group: updateAdult.Group,
            Date: updateAdult.Date,
            Comments: updateAdult.Comments,
            School: updateAdult.School,
            PhoneNum: updateAdult.PhoneNum,
            Grade: updateAdult.Grade,
            ParentPhoneNum: updateAdult.ParentPhoneNum,
            YouthMovement: updateAdult.YouthMovement,
            AnotherEducation: updateAdult.AnotherEducation,
            IsInstructor: updateAdult.IsInstructor,
            IsAdult: updateAdult.IsAdult,
            AdultProffesion: updateAdult.AdultProffesion
          })
          .then(function () {
            document.location.href = "homePage.html";
          })
          .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
          });
      }
    });
  // show first now
  $('#mmbr-section')
    .modal('show');

  $('#mmbr-section').modal('show');
  $(".mmbr-btn").modal({
    closable: true
  });

}

function updateFunc() { //update in session and database
  let selectedPersonKey = sessionStorage.getItem('selectedPersonKey');
  let adltList = JSON.parse(sessionStorage.getItem('adltList'));
  let foundIndex = adltList.findIndex(x => x.Key == selectedPersonKey); //index of wanted adult

  //update the adult in the list
  adltList[foundIndex].First = updateAdult.First;
  adltList[foundIndex].Last = updateAdult.Last;
  adltList[foundIndex].Date = updateAdult.Date;
  adltList[foundIndex].Group = updateAdult.Group;
  adltList[foundIndex].Comments = updateAdult.Comments;
  adltList[foundIndex].School = updateAdult.School;
  adltList[foundIndex].PhoneNum = updateAdult.PhoneNum;
  adltList[foundIndex].Grade = updateAdult.Grade;
  adltList[foundIndex].ParentPhoneNum = updateAdult.ParentPhoneNum;
  adltList[foundIndex].YouthMovement = updateAdult.YouthMovement;
  adltList[foundIndex].AnotherEducation = updateAdult.AnotherEducation;
  adltList[foundIndex].IsInstructor = updateAdult.IsInstructor;
  adltList[foundIndex].AdultProffesion = updateAdult.AdultProffesion;

  sessionStorage.setItem('adltList', JSON.stringify(adltList)); //push to session 
  //if name was change need to update title
  $("#nameTitle").replaceWith("<h1 id='nameTitle'>" + adltList[foundIndex].First + " " + adltList[foundIndex].Last + "</h1>");

  //after edit 'theAdult' = updateAdult : help us to check if other edit was made
  theAdult = JSON.parse(sessionStorage.getItem('adltList')).find(x => x.Key === selectedPersonKey);
  updateAdult = JSON.parse(sessionStorage.getItem('adltList')).find(x => x.Key === selectedPersonKey);

  ///update database
  let updateRef = firestore.collection("Members").doc(selectedPersonKey);

  updateRef.update({
      First: updateAdult.First,
      Last: updateAdult.Last,
      Group: updateAdult.Group,
      Date: updateAdult.Date,
      Comments: updateAdult.Comments,
      School: updateAdult.School,
      PhoneNum: updateAdult.PhoneNum,
      Grade: updateAdult.Grade,
      ParentPhoneNum: updateAdult.ParentPhoneNum,
      YouthMovement: updateAdult.YouthMovement,
      AnotherEducation: updateAdult.AnotherEducation,
      IsInstructor: updateAdult.IsInstructor,
      AdultProffesion: updateAdult.AdultProffesion
    })
    .then(function () {
      console.log("Document successfully updated!BB!");
    })
    .catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
}

function deleteFunc() {
  let selectedPersonKey = sessionStorage.getItem('selectedPersonKey');
  let adltList = JSON.parse(sessionStorage.getItem('adltList'));
  let foundIndex = adltList.findIndex(x => x.Key == selectedPersonKey); //inddex of wanted adult

    $('#dlt-section').modal('show');
    $(".dlt-btn").modal({
      closable: true
    });

    $("#dlt").click(function () {
      if (foundIndex > -1) {
        adltList.splice(foundIndex, 1);
        sessionStorage.setItem('adltList', JSON.stringify(adltList)); //save to session after delete 
        firestore.collection("Members").doc(selectedPersonKey).delete().
        then(function () {
          document.location.href = "homePage.html";
        });
      }
    });
  }


function displayGroups() {
  let str = "";
  let groups = JSON.parse(sessionStorage.getItem('groupsData')); 
  for (let i = 0; i < groups.length; i++)
    str += '<option value="' + groups[i].groupName + '">' + groups[i].groupName + '</option>'; 
  return str;
}

function sumAllPayments(financialArray) {
  let sum = 0;
  financialArray.forEach(obj => {
    sum += obj.Amount;
  })
  return sum;
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
