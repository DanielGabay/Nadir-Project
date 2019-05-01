  const signUpBtn = document.getElementById('signUpBtn');
  const signInBtn = document.getElementById('signInBtn');


  signUpBtn.addEventListener('click', function () {
      let email = document.getElementById('email').value;
      let password = document.getElementById('password').value;

      firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(function (result) {
              console.log(result);
          })
          .catch(function (err) {
              if (err != null) {
                  console.log(err.message);
                  return;
              }
          })
  });


  signInBtn.addEventListener('click', function () {
      createSpinner("body");
      let email = document.getElementById('email').value;
      let password = document.getElementById('password').value;

      firebase.auth().signInWithEmailAndPassword(email, password)
          .then(function (result) {
              document.location.href = 'homePage.html';
          })
          .catch(function (err) {
              if (err != null) {
                  console.log(err.message);
                  return;
              }
          })
  });


  function createSpinner(currDiv) {
      // create a new div element 
      let newDiv = document.createElement("div");
      newDiv.className = "loader";
      // add the newly created element and its content into the DOM 
      document.getElementById("main").appendChild(newDiv);
  }