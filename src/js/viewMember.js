const firestore = firebase.firestore();

$(document).ready(function () {
  var text = window.location.hash.substring(1);
  var name = localStorage.getItem('name').split(" ");
  console.log("we passed this 1:"+ localStorage.getItem('name'));
  
  let first =name[0];
  let last = name[2];

  console.log("the names are: "+first);
  getName("אלה","ישראלי");


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
    $("#date").val(member.Date.split('-').reverse().join('/'));  // will show in the right way dd/mm/yyyy
    $("#group").val(member.Group);
    $("#comments").val(member.Comments);
    $("#school").val(member.School);
    $("#phone-num").val([member.PhoneNum.slice(0, 3), "-", member.PhoneNum.slice(3)].join(''));
    $("#grade").val(member.Grade); //member.ParentPhoneNum
    $("#parent-phone-num").val([member.ParentPhoneNum.slice(0, 3), "-", member.ParentPhoneNum.slice(3)].join(''));
    $("#youth-movement").val(member.YouthMovement);
    $("#another-education").val(member.AnotherEducation)
    if(member.IsInstructor == "false")
      $("#is-instructor").val("לא");
    else
      $("#is-instructor").val("כן");
  }

}