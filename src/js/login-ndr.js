$(document).ready(function () {
    
    $("#signUpBtn").click(function () {
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

    $("#signInBtn").click(function () {
        let email = $('#email').val();
        let password = $('#password').val();

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
});