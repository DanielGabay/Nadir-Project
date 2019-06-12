$(document).ready(function () {
    $("#signInBtn").click(signIn);
    /*ENTER key listener when password input is focused*/
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
            if(err.code === "auth/invalid-email"){
                $('#errorPlaceHolder').text("כתובת המייל הוכנסה בצורה לא תקינה");
            }
            else if(err.code === "auth/wrong-password"){
                $('#errorPlaceHolder').text("הסיסמא לא נכונה");
            }
            else if(err.code === "auth/user-not-found"){
                $('#errorPlaceHolder').text("המשתמש לא נמצא");
            }
            else{
                $('#errorPlaceHolder').text(err.message);
            }
        })
}