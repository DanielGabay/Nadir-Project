const firestore = firebase.firestore();

$(document).ready(function () {
  let selectedPersonKey = sessionStorage.getItem('selectedPersonKey');
  console.log("we passed this data to the next screen:"+ selectedPersonKey);
  
  getName(selectedPersonKey); 
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

   function getName(selectedPersonKey){

    firestore.collection("Members").doc(selectedPersonKey).get()
    .then(function(doc) {
      if (doc.exists) {
        setFields(doc)
          console.log("Document data:", doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
}
function setFields(doc){
  if (doc && doc.exists){
    const member = doc.data();
    $("#nameTitle").append(member.First + " " + member.Last);
    $("#first-name").val(member.First);
    $("#last-name").val(member.Last);
    $("#date").val(member.Date.split('-').reverse().join('/'));  // will show in the right way dd/mm/yyyy
    $("#group").val(member.Group);
    $("#comments").val(member.Comments);
    $("#school").val(member.School);
    $("#phone-num").val([member.PhoneNum.slice(0, 3), "-", member.PhoneNum.slice(3)].join(''));
    $("#grade").val(member.Grade); 
    $("#parent-phone-num").val([member.ParentPhoneNum.slice(0, 3), "-", member.ParentPhoneNum.slice(3)].join(''));
    $("#youth-movement").val(member.YouthMovement);
    $("#another-education").val(member.AnotherEducation)
    if(member.IsInstructor == "false")
      $("#is-instructor").val("לא");
    else
      $("#is-instructor").val("כן");
  }

}

function change(){
  let selectedPersonKey = sessionStorage.getItem('selectedPersonKey');
  firestore.collection("Members").doc(selectedPersonKey).get()
  .then(function(doc) {
    if (doc.exists) {
       const member = doc.data();
       console.log("Document data:", doc.data());
       editToSave(doc);
       
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});   
}

function editToSave(doc){
  if (doc && doc.exists){
    const member = doc.data();
  if($("#edit-btn").text() == "עריכה"){
    $("#edit-btn").text("שמור").append("<i class='save icon'></i>");
    $("#first-name").removeAttr("readonly");
    $("#last-name").removeAttr("readonly");
    $("#date").removeAttr("readonly");
    $("#group").removeAttr("readonly");
    $("#comments").removeAttr("readonly");
    $("#school").removeAttr("readonly");
    $("#phone-num").removeAttr("readonly");
    $("#grade").removeAttr("readonly");
    $("#parent-phone-num").removeAttr("readonly");
    $("#youth-movement").removeAttr("readonly");
    $("#another-education").removeAttr("readonly");
    $("#is-instructor").replaceWith("<select class='ui fluid dropdown' id='is-instructor' ><option value='false'>לא</option><option value='true'>כן</option></select>");
    $("#is-instructor").val(member.IsInstructor);
  }
  else if($("#edit-btn").text() == "שמור"){
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
    if(member.IsInstructor == "false")
      $("#is-instructor").val("לא");
    else
      $("#is-instructor").val("כן");
  }
}
}