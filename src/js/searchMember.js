const firestore = firebase.firestore(); // connect to our firebase storage.
let memeberList = []; // array of object that will save all our memeber object

/*when document is ready*/
$(document).ready(function () {
    getAllMemebers().then(memeberList => {  // only when getallmemebers return the memberlist continue:
        $('#loader').removeClass('active'); // remove the loader .
        const searchList = convertMemeberListToSearchList(memeberList);
        $('.ui.search').search({   // to show the search options
                source: searchList,
                onSelect: onSelect
            })
            showTable(memeberList); // load the table.first -> without display it.
            const $table = $('#membersTable');
            $("#show-all").click(function () {      // show-table. we can change animation.
                $table.transition('slide down');  
            });
    })

});

/*return a promise - mean, that this function return something that we can do .then() after it*/
function getAllMemebers() {
    return new Promise((resolve) => {   // resolve <--->is need with promise.
        firestore.collection("Members").get()
            .then(function (querySnapshot) {
                const memeberList = []; // save all the member data.
                querySnapshot.forEach(function (doc) {
                    const person = doc.data(); // pointer for document
                    memeberList.push(person); // add for array of all names
                });
                resolve(memeberList);
            });
    })

}

/* return array of object for the search method of 'semntic'. we need 'title' for semntic and firebasekey will be send to 'viewMember' */
function convertMemeberListToSearchList(memeberList) {
    const searchList = memeberList.map(memeber => {   
        const { First, Last, Key } = memeber;
        return { title: First + ' ' + Last, firebaseKey: Key };
    })
    return searchList;
}

/* the 'click listener' of the search. works with 'click' and also with enter! */
function onSelect(result, response) {
    const { title, id, firebaseKey } = result; // we could do also result.firebaseKey.
    console.log(result);
    sessionStorage.setItem('selectedPersonKey', firebaseKey); // save it temporeriy
    document.location.href = 'viewMember.html'; //TODO   show the view member. we need to change this command to new window
}

/*TODO- sort before show!    show the table of all the memberlists. */
function showTable(memeberList) {
    let str = '<thead> <tr> <th>שם </th> <th>קבוצה</th> </tr> </thead>  <tbody> ';
    memeberList.forEach(function (memeber) {
            str += '<tr> <td>' + memeber.First + ' ' + memeber.Last + '</td> <td>' + (memeber.Group || "לא משויך לקבוצה") + '</td> </tr>';
        })
        str += '</tbody>';
        $("#membersTable").html(str);
}