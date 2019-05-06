const firestore = firebase.firestore();

 $(function () {
    $('#navbar').load('topNavbar.html');
    $("#payment-track-btn").click(function () {
      document.location.href = "homePage.html";
    });
    $("#personal-track-btn").click(function () {
      document.location.href = "homePage.html";
    })

   });