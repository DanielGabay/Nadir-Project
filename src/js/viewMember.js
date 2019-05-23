const firestore = firebase.firestore();
let theMemeber = [];
$(document).ready(function () {
  $("#payment-track-btn").click(function () {
    document.location.href = "viewMemberFinancial.html";
  });

  $("#personal-track-btn").click(function () {
    document.location.href = "viewMemberComments.html";
  })

  let selectedPersonKey = sessionStorage.getItem('selectedPersonKey');
  console.log("we passed this data to the next screen:" + selectedPersonKey);
  theMemeber = JSON.parse( sessionStorage.getItem('memberList')).find(x => x.Key ===selectedPersonKey );
  console.log("this is who we need:" + theMemeber.Key);
  setFields();
});

function setFields() {//set the fields with info of wanted member
 
    $("#nameTitle").append(theMemeber.First + " " + theMemeber.Last);
    $("#first-name").val(theMemeber.First);
    $("#last-name").val(theMemeber.Last);
    $("#date").val(theMemeber.Date.split('-').reverse().join('/'));  // will show in the right way dd/mm/yyyy
    $("#group").val(theMemeber.Group);
    $("#comments").val(theMemeber.Comments);
    $("#school").val(theMemeber.School);
    $("#grade").val(theMemeber.Grade +"'");
    $("#phone-num").val([theMemeber.PhoneNum.slice(0, 3), "-", theMemeber.PhoneNum.slice(3)].join(''));//add '-' after 3 digit
    $("#parent-phone-num").val([theMemeber.ParentPhoneNum.slice(0, 3), "-", theMemeber.ParentPhoneNum.slice(3)].join(''));//add '-' after 3 digit
    $("#youth-movement").val(theMemeber.YouthMovement);
    $("#another-education").val(theMemeber.AnotherEducation)
    if (theMemeber.IsInstructor == "false")
      $("#is-instructor").val("לא");
    else
      $("#is-instructor").val("כן");
  }

function change() { 
  let selectedPersonKey = sessionStorage.getItem('selectedPersonKey');
  editToSave();
}

function editToSave() {
  if (theMemeber) {
    if ($("#edit-btn").text() == "עריכה") {
      $("#edit-btn").text("שמור").append("<i class='save icon'></i>");
      $("#first-name").removeAttr("readonly");
      $("#last-name").removeAttr("readonly");
      $("#date").removeAttr("readonly");
      $("#date").attr("type","date");
      $("#date").val(theMemeber.Date);
      $("#group").removeAttr("readonly");
      $("#group").replaceWith("<select class='ui fluid dropdown' id='group'></select>");
      $("#group").append(displayGroups());
      $("#group").val(theMemeber.Group);
      $("#comments").removeAttr("readonly");
      $("#school").removeAttr("readonly");
      $("#phone-num").removeAttr("readonly");
      $("#phone-num").attr("type","number");
      $("#phone-num").val(theMemeber.PhoneNum); //remove '-' for edit
      $("#grade").removeAttr("readonly");
      $("#grade").replaceWith("<select class='ui fluid dropdown' id='grade'><option value='ז'>ז'</option><option value='ח'>ח'</option><option value='ט'>ט'</option><option value='י'>י'</option><option value='יא'>י''א</option><option value='יב'>י''ב</option></select>");
      $("#grade").val(theMemeber.Grade);
      $("#parent-phone-num").removeAttr("readonly");
      $("#parent-phone-num").attr("type","number");
      $("#parent-phone-num").val(theMemeber.ParentPhoneNum); //remove '-' for edit
      $("#youth-movement").removeAttr("readonly");
      $("#another-education").removeAttr("readonly");
      $("#is-instructor").replaceWith("<select class='ui fluid dropdown' id='is-instructor' ><option value='false'>לא</option><option value='true'>כן</option></select>");
      $("#is-instructor").val(theMemeber.IsInstructor);
    }
    else if ($("#edit-btn").text() == "שמור") {//save to edit part
      $("#edit-btn").text("עריכה").append("<i class='edit icon'></i>");
      $("#first-name").attr("readonly", "");
      $("#last-name").attr("readonly", "");
      $("#date").attr("readonly", "");
      $("#group").replaceWith("<input type='text' readonly='' id='group'>"); //disable select 
      //$("#group").val(theMemeber.group);  AFTER UPDATE
      $("#comments").attr("readonly", "");
      $("#school").attr("readonly", "");
      $("#phone-num").attr("readonly", "");
      $("#grade").replaceWith("<input readonly='' id='grade'>");//disable select
      //$("#grade").val(theMemeber.grade);  AFTER UPDATE
      $("#parent-phone-num").attr("readonly", "");
      $("#youth-movement").attr("readonly", "");
      $("#another-education").attr("readonly", "");
      $("#is-instructor").replaceWith("<input readonly='' id='is-instructor'>");//disable select
      if (theMemeber.IsInstructor == "false")
        $("#is-instructor").val("לא");
      else
        $("#is-instructor").val("כן");
    }
  }
}

function displayGroups() {
  let str = "";
  let groups = JSON.parse(sessionStorage.getItem('groupsData'));
  for (let i = 0; i < groups.length; i++)
    str += '<option value="' + groups[i].groupName + '">' + groups[i].groupName + '</option>';
  return str;
}