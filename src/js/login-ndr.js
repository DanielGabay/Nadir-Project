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



    $("#signInBtn").click(signIn);
    $('#password').keypress(function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            signIn();
        }
    });

    $('#forgotPasswordBtn').click(function () {
        $('#forgotPassModal')

            .modal('show');
    })

    $('#sendBtn').click(function () {
        let email = $("#modalEmail").val();
        firebase.auth().sendPasswordResetEmail(email).then(function (result) {
            $('#modalErrorPlaceHolder').removeClass("ui error message");
            $('#modalErrorPlaceHolder').addClass("ui positive message");
            $('#modalErrorPlaceHolder').text("הודעת שחזור סיסמא נשלחה בהצלחה לתיבת הדואר שלך");
        }).catch(function (err) {
            $('#modalErrorPlaceHolder').removeClass("ui positive message");
            $('#modalErrorPlaceHolder').addClass("ui error message");
            $('#modalErrorPlaceHolder').text(err.message);
        });
    });
});

function signIn() {
    let email = $('#email').val();
    let password = $('#password').val();
    $('#loader').addClass('active');
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (result) {
            $('#loader').removeClass('active');
            $('#errorPlaceHolder').removeClass("ui error message");
            $('#errorPlaceHolder').text("");
            document.location.href = 'homePage.html';
        })
        .catch(function (err) {
            $('#loader').removeClass('active');
            $('#errorPlaceHolder').addClass("ui error message");
            $('#errorPlaceHolder').text(err.message);

            console.log(err);
        })
}