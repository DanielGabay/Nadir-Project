const firestore = firebase.firestore();
let theMember = [];
let updateMember = {};

$(document).ready(function () {
  $("#payment-track-btn").click(function () {
    document.location.href = "viewMemberFinancial.html";
  });

  $("#personal-track-btn").click(function () {
    document.location.href = "viewMemberComments.html";
  })

  let selectedPersonKey = sessionStorage.getItem('selectedPersonKey');
  console.log("we passed this data to the next screen:" + selectedPersonKey);
  theMember = JSON.parse(sessionStorage.getItem('adltList')).find(x => x.Key === selectedPersonKey);
  updateMember = JSON.parse(sessionStorage.getItem('adltList')).find(x => x.Key === selectedPersonKey);
  console.log("this is who we need:" + theMember.Key);
  getGroupsData();
  setFields(); //set the page of the member
});

function setFields() { //set the fields with info of wanted member
  $("#nameTitle").append(theMember.First + " " + theMember.Last);
  $("#first-name").val(theMember.First);
  $("#last-name").val(theMember.Last);
  $("#date").val(theMember.Date.split('-').reverse().join('/')); // will show in the right way dd/mm/yyyy
  $("#adlt-proffesion").val(theMember.AdultProffesion);
  $("#group").val(theMember.Group);
  $("#comments").val(theMember.Comments);
  $("#school").val(theMember.School);
  if (theMember.Grade != null && theMember.Grade != "")
    $("#grade").val(theMember.Grade + "'");
  $("#phone-num").val([theMember.PhoneNum.slice(0, 3), "-", theMember.PhoneNum.slice(3)].join('')); //add '-' after 3 digit
  if (theMember.ParentPhoneNum != "")
    $("#parent-phone-num").val([theMember.ParentPhoneNum.slice(0, 3), "-", theMember.ParentPhoneNum.slice(3)].join('')); //add '-' after 3 digit
  $("#youth-movement").val(theMember.YouthMovement);
  $("#another-education").val(theMember.AnotherEducation);
  if (theMember.IsInstructor == "false")
    $("#is-instructor").val("לא");
  else
    $("#is-instructor").val("כן");
}

function updateMemDetails() {
  if (theMember) {
    if ($("#edit-btn").text() == "עריכה") { // edit btn was clicked, remove read only for all input
      $("#mmbr-btn").hide(); //hide the move to adult button after edit
      $("#edit-btn").text("שמור").append("<i class='save icon'></i>");
      $("#first-name").removeAttr("readonly");
      $("#last-name").removeAttr("readonly");
      $("#date").removeAttr("readonly");
      $("#date").attr("type", "date");
      $("#date").val(updateMember.Date);
      $("#group").removeAttr("readonly");
      $("#adlt-proffesion").removeAttr("readonly");
      $("#adlt-proffesion").val(theMember.AdultProffesion);
      $("#group").replaceWith("<select class='ui fluid dropdown' id='group'></select>");
      $("#group").append(displayGroups());
      $("#group").val(theMember.Group);
      $("#comments").removeAttr("readonly");
      $("#school").removeAttr("readonly");
      $("#phone-num").removeAttr("readonly");
      $("#phone-num").attr("type", "number");
      $("#phone-num").val(theMember.PhoneNum);
      $("#grade").removeAttr("readonly");
      $("#grade").replaceWith("<select class='ui fluid dropdown' id='grade'><option value='ז'>ז'</option><option value='ח'>ח'</option><option value='ט'>ט'</option><option value='י'>י'</option><option value='יא'>י''א</option><option value='יב'>י''ב</option></select>");
      $("#grade").val(theMember.Grade);
      $("#parent-phone-num").removeAttr("readonly");
      $("#parent-phone-num").attr("type", "number");
      $("#parent-phone-num").val(theMember.ParentPhoneNum);
      $("#youth-movement").removeAttr("readonly");
      $("#another-education").removeAttr("readonly");
      $("#is-instructor").replaceWith("<select class='ui fluid dropdown' id='is-instructor' ><option value='false'>לא</option><option value='true'>כן</option></select>");
      $("#is-instructor").val(theMember.IsInstructor);
    } else if ($("#edit-btn").text() == "שמור") { //save btn was clicked 
      $("#edit-btn").text("עריכה").append("<i class='edit icon'></i>");
      $("#mmbr-btn").show(); //show the move to adult button after save
      //create new obj for update member
      updateMember.First = $("#first-name").val();
      updateMember.Last = $("#last-name").val();
      updateMember.Date = $("#date").val();
      updateMember.AdultProffesion = $("#adlt-proffesion").val();
      updateMember.Group = $("#group").val();
      updateMember.Comments = $("#comments").val();
      updateMember.School = $("#school").val();
      updateMember.PhoneNum = $("#phone-num").val();
      updateMember.Grade = $("#grade").val();
      updateMember.ParentPhoneNum = $("#parent-phone-num").val();
      updateMember.YouthMovement = $("#youth-movement").val();
      updateMember.AnotherEducation = $("#another-education").val();
      updateMember.IsInstructor = $("#is-instructor").val();

      // if change where make save data in database and session
      if (JSON.stringify(updateMember) !== JSON.stringify(theMember))
        updateFunc();

      //return to edit - display
      $("#first-name").attr("readonly", "");
      $("#last-name").attr("readonly", "");
      $("#date").attr("readonly", "");
      $("#date").attr("type", "text");
      $("#date").val(updateMember.Date);
      $("#adlt-proffesion").attr("readonly", "");
      $("#adlt-proffesion").val(updateMember.AdultProffesion);
      $("#group").replaceWith("<input type='text' readonly='' id='group'>"); //disable select 
      $("#group").val(updateMember.Group);
      $("#comments").attr("readonly", "");
      $("#school").attr("readonly", "");
      $("#phone-num").attr("readonly", "");
      $("#phone-num").attr("type", "text");
      $("#phone-num").val([theMember.PhoneNum.slice(0, 3), "-", theMember.PhoneNum.slice(3)].join('')); //add '-' after 3 digit
      $("#grade").replaceWith("<input readonly='' id='grade'>"); //disable select
      if (updateMember.Grade != null)
        $("#grade").val(updateMember.Grade + "'");
      $("#parent-phone-num").attr("readonly", "");
      $("#parent-phone-num").attr("type", "text");
      if (theMember.ParentPhoneNum != "")
        $("#parent-phone-num").val([theMember.ParentPhoneNum.slice(0, 3), "-", theMember.ParentPhoneNum.slice(3)].join('')); //add '-' after 3 digit
      $("#youth-movement").attr("readonly", "");
      $("#another-education").attr("readonly", "");
      $("#is-instructor").replaceWith("<input readonly='' id='is-instructor'>"); //disable select
      if (updateMember.IsInstructor == "false")
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
  let foundIndex = adltList.findIndex(x => x.Key == selectedPersonKey); //index of wanted member

  $('.mmbr-btn')
    .modal({
      allowMultiple: false
    });
  // attach events to buttons
  $('#acpt-mmbr-section')
    .modal('attach events', '#mmbr-section #move-mmbr')
    .click(function () { //move from session memberList to adultList and update the databse
      if (foundIndex > -1) {
        updateMember.IsAdult = "false";
        updateMember.AdultProffesion = "";
        if (memberList != null) { //check if the adult list is improved
            memberList.push(updateMember);
          sessionStorage.setItem('memberList', JSON.stringify(memberList)); // save it in session
        }
        adltList.splice(foundIndex, 1);
        sessionStorage.setItem('adltList', JSON.stringify(adltList)); //save to session after delete
  
        ///update database
        let updateRef = firestore.collection("Members").doc(selectedPersonKey);
  
        updateRef.update({
            First: updateMember.First,
            Last: updateMember.Last,
            Group: updateMember.Group,
            Date: updateMember.Date,
            Comments: updateMember.Comments,
            School: updateMember.School,
            PhoneNum: updateMember.PhoneNum,
            Grade: updateMember.Grade,
            ParentPhoneNum: updateMember.ParentPhoneNum,
            YouthMovement: updateMember.YouthMovement,
            AnotherEducation: updateMember.AnotherEducation,
            IsInstructor: updateMember.IsInstructor,
            IsAdult: updateMember.IsAdult,
            AdultProffesion: updateMember.AdultProffesion
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
  let foundIndex = adltList.findIndex(x => x.Key == selectedPersonKey); //index of wanted member

  //update the member in the list
  adltList[foundIndex].First = updateMember.First;
  adltList[foundIndex].Last = updateMember.Last;
  adltList[foundIndex].Date = updateMember.Date;
  adltList[foundIndex].Group = updateMember.Group;
  adltList[foundIndex].Comments = updateMember.Comments;
  adltList[foundIndex].School = updateMember.School;
  adltList[foundIndex].PhoneNum = updateMember.PhoneNum;
  adltList[foundIndex].Grade = updateMember.Grade;
  adltList[foundIndex].ParentPhoneNum = updateMember.ParentPhoneNum;
  adltList[foundIndex].YouthMovement = updateMember.YouthMovement;
  adltList[foundIndex].AnotherEducation = updateMember.AnotherEducation;
  adltList[foundIndex].IsInstructor = updateMember.IsInstructor;
  adltList[foundIndex].AdultProffesion = updateMember.AdultProffesion;

  sessionStorage.setItem('adltList', JSON.stringify(adltList)); //push to session 
  //if name was change need to update title
  $("#nameTitle").replaceWith("<h1 id='nameTitle'>" + adltList[foundIndex].First + " " + adltList[foundIndex].Last + "</h1>");

  //after edit 'theMember' = updateMember : help us to check if other edit was made
  theMember = JSON.parse(sessionStorage.getItem('adltList')).find(x => x.Key === selectedPersonKey);
  updateMember = JSON.parse(sessionStorage.getItem('adltList')).find(x => x.Key === selectedPersonKey);

  ///update database
  let updateRef = firestore.collection("Members").doc(selectedPersonKey);

  updateRef.update({
      First: updateMember.First,
      Last: updateMember.Last,
      Group: updateMember.Group,
      Date: updateMember.Date,
      Comments: updateMember.Comments,
      School: updateMember.School,
      PhoneNum: updateMember.PhoneNum,
      Grade: updateMember.Grade,
      ParentPhoneNum: updateMember.ParentPhoneNum,
      YouthMovement: updateMember.YouthMovement,
      AnotherEducation: updateMember.AnotherEducation,
      IsInstructor: updateMember.IsInstructor,
      AdultProffesion: updateMember.AdultProffesion
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
  let foundIndex = adltList.findIndex(x => x.Key == selectedPersonKey); //inddex of wanted member

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
