const firestore = firebase.firestore();
let theMemeber = [];
$(document).ready(function () {
  let selectedPersonKey = sessionStorage.getItem('selectedPersonKey');
  console.log("we passed this data to the next screen:" + selectedPersonKey);
  theMemeber = JSON.parse( sessionStorage.getItem('memberList')).find(x => x.Key ===selectedPersonKey );
  console.log("this is who we need:" + theMemeber.Key);
  setFields();
});

$(function () {
  $('#navbar').load('topNavbar.html');
  $("#payment-track-btn").click(function () {
    document.location.href = "homePage.html";
  });
  $("#personal-track-btn").click(function () {
    document.location.href = "homePage.html";
  })
});

function getName(selectedPersonKey) {


setFields(theMemeber);
  // firestore.collection("Members").doc(selectedPersonKey).get()
  //   .then(function (doc) {
  //     if (doc.exists) {
  //       setFields(doc)
  //       console.log("Document data:", doc.data());
  //     } else {
  //       // doc.data() will be undefined in this case
  //       console.log("No such document!");
  //     }
  //   }).catch(function (error) {
  //     console.log("Error getting document:", error);
  //   });
}

function setFields() {
 
    $("#nameTitle").append(theMemeber.First + " " + theMemeber.Last);
    $("#first-name").val(theMemeber.First);
    $("#last-name").val(theMemeber.Last);
    $("#date").val(theMemeber.Date.split('-').reverse().join('/'));  // will show in the right way dd/mm/yyyy
    $("#group").val(theMemeber.Group);
    $("#comments").val(theMemeber.Comments);
    $("#school").val(theMemeber.School);
    $("#phone-num").val([theMemeber.PhoneNum.slice(0, 3), "-", theMemeber.PhoneNum.slice(3)].join(''));
    $("#grade").val(theMemeber.Grade);
    $("#parent-phone-num").val([theMemeber.ParentPhoneNum.slice(0, 3), "-", theMemeber.ParentPhoneNum.slice(3)].join(''));
    $("#youth-movement").val(theMemeber.YouthMovement);
    $("#another-education").val(theMemeber.AnotherEducation)
    if (theMemeber.IsInstructor == "false")
      $("#is-instructor").val("לא");
    else
      $("#is-instructor").val("כן");
  }

function change() {
  let selectedPersonKey = sessionStorage.getItem('selectedPersonKey');
  // firestore.collection("Members").doc(selectedPersonKey).get()
  //   .then(function (doc) {
  //     if (doc.exists) {
  //       const member = doc.data();
  //       console.log("Document data:", doc.data());
  //       editToSave(doc);

  //     } else {
  //       // doc.data() will be undefined in this case
  //       console.log("No such document!");
  //     }
  //   }).catch(function (error) {
  //     console.log("Error getting document:", error);
  //   });
}

function editToSave() {
  if (theMemeber) {

    if ($("#edit-btn").text() == "עריכה") {
      $("#edit-btn").text("שמור").append("<i class='save icon'></i>");
      $("#first-name").removeAttr("readonly");
      $("#last-name").removeAttr("readonly");
      $("#date").removeAttr("readonly");
      //$("#date").val(member.Date.split('/').reverse().join('-')); 
      //$("#date").attr("type","date");
      //$("#date").attr("value", $("#date").val);
      $("#group").removeAttr("readonly");
      $("#comments").removeAttr("readonly");
      $("#school").removeAttr("readonly");
      $("#phone-num").removeAttr("readonly");
      $("#grade").removeAttr("readonly");
      $("#parent-phone-num").removeAttr("readonly");
      $("#youth-movement").removeAttr("readonly");
      $("#another-education").removeAttr("readonly");
      $("#is-instructor").replaceWith("<select class='ui fluid dropdown' id='is-instructor' ><option value='false'>לא</option><option value='true'>כן</option></select>");
      $("#is-instructor").val(theMemeber.IsInstructor);
    }
    else if ($("#edit-btn").text() == "שמור") {
     // update(theMemeber.Key);
      $("#edit-btn").text("עריכה").append("<i class='edit icon'></i>");
      $("#first-name").attr("readonly", "");
      $("#last-name").attr("readonly", "");
      $("#date").attr("readonly", "");
      $("#group").attr("readonly", "");
      $("#comments").attr("readonly", "");
      $("#school").attr("readonly", "");
      $("#phone-num").attr("readonly", "");
      $("#grade").attr("readonly", "");
      $("#parent-phone-num").attr("readonly", "");
      $("#youth-movement").attr("readonly", "");
      $("#another-education").attr("readonly", "");
      $("#is-instructor").replaceWith("<input readonly='' id='is-instructor'>");
      if (theMemeber.IsInstructor == "false")
        $("#is-instructor").val("לא");
      else
        $("#is-instructor").val("כן");
    }
  }
}

function update(selectedPersonKey) {

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

  var memberRef = firestore.collection("Members").doc(selectedPersonKey);
  return memberRef.update({
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
    Comments: comments
  })
    .then(function () {
      console.log("Document successfully updated!");
    })
    .catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });

}
