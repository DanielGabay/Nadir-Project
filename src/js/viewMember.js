

const firestore = firebase.firestore();

$(document).ready(function () {
  let first = "שרי";
  let last = "זרביב";
  getName(first,last);



 // $( "#my_search" ).trigger( "search" );


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

   function getName(first,last){
    firestore.collection("Members").where("First", "==", first).where("Last", "==", last).get()
    .then(function(querySnapshot) {
        console.log(querySnapshot);
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            setFields(doc);
            console.log(doc.id, " => ", doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function setFields(doc){
  if (doc && doc.exists){
    const member = doc.data();
    $("#nameTitle").append(member.First + " " + member.Last);
    $("#first-name").val(member.First);
    $("#last-name").val(member.Last);
    $("#date").val(member.Date);
    $("#group").val(member.Group);
    $("#comments").val(member.Comments);
    $("#school").val(member.School);
    $("#phone-num").val(member.PhoneNum);
    $("#grade").val(member.Grade); 
    $("#parent-phone-num").val(member.ParentPhoneNum);
    $("#youth-movement").val(member.YouthMovement);
    $("#another-education").val(member.AnotherEducation)
    if(member.IsInstructor == "false")
      $("#is-instructor").val("לא");
    else
      $("#is-instructor").val("כן");
  }

}