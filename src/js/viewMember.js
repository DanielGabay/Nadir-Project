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