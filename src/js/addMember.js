const firestore = firebase.firestore();

setGroups();
const add_button = document.querySelector("#add-btn");

add_button.addEventListener("click", function () {
    /* attach the html elements*/

    const firstName = document.querySelector("#first-name").value;
    const lastName = document.querySelector("#last-name").value;
    const date = document.querySelector("#date").value;
    const city = document.querySelector("#city").value;
    const group = document.querySelector("#group").value;
    const comments = document.querySelector("#comments").value;

    /*the data of this user will store in this location*/
    const Path = "Users/" + firstName + "-" + lastName;
    const docRef = firestore.doc(Path); // pointer to the place we add the data

    /* make the object to add ===> key : value */
    docRef.set({
        First: firstName,
        Last: lastName,
        Date: date,
        City: city,
        Group: group,
        Comments: comments
    }).then(function () {
        console.log("status  saved");
    }).catch(function (error) {
        console.log("got error!!!", error)
    });
});

/*load groups names from database*/
function setGroups() {
    const Path = "groups/groups";
    const docRef = firestore.doc(Path); // pointer to the place we add the data
    let str = '<select class="ui fluid dropdown" id="group">';
    str += '<option disabled selected value value="">בחר קבוצה</option>';
  
    docRef.get().then(function (doc) { //  onsnapshot will do it faster
        if (doc && doc.exists) {
            const theData = doc.data();
            var names = theData.names;
            for (let i = 0; i < names.length; i++) {
                str += '<option value="' + names[i] + '">' + names[i] + '</option>'
            }
            str +="</select>"
            document.querySelector("#place-group").innerHTML = str;
        }
    });
    

}

