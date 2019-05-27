const firestore = firebase.firestore(); // connect to our firebase storage.

/*when document is ready*/
$(document).ready(function () {
    getAllMemebers().then(adltList => { // only when getallmemebers return the memberlist continue:
        $('#loader').removeClass('active'); // remove the loader 
    })
});


function getAllMemebers() {
    return new Promise((resolve) => { // resolve <--->is need with promise.
        let adltList = []; // save all the adlt data.      
     
        if (sessionStorage.getItem("adultList") === null || JSON.parse(sessionStorage.getItem('adultList')).length === 0) { // if its the first time 
            console.log("adltlist is from FireBase")
            firestore.collection("Members").where("IsAdult", "==", "true").get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        const person = doc.data(); // pointer for document
                        adltList.push(person); // add for array of all names
                        console.log(adltList);
                    }) 
                    sessionStorage.setItem('adltList', JSON.stringify(adltList)); // save it in session
                    resolve(adltList);
                })

            } else {
                adltList = JSON.parse(sessionStorage.getItem('adultList'));
                console.log("adltList is from session")
                console.log(adltList);
                resolve(adltList);
            }
        })

    }
