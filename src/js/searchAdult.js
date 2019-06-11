const firestore = firebase.firestore(); // connect to our firebase storage.

/*when document is ready*/
$(document).ready(function () {
    getAllMemebers().then(adltList => { // only when getallmemebers return the memberlist continue:
        $('#loader').removeClass('active'); // remove the loader 

        let byNameList = createAdultListByName(adltList);

        $('.ui.search').search({ // to show the search options
            source: byNameList,
            onSelect: onSelect
        })

        showTable(adltList); // load the table.first -> without display it.

        const $table = $('#adultTable');
        $table.hide();
        $("#showAdlt").click(function () { // show-table. we can change animation.
            $table.transition('slide down');
        });


        $('#adultTable td').click(function () {
            const id = ($(this).closest('tr').attr('id'));
            console.log(id); // add click even to every row!!!
            if (id) {
                sessionStorage.setItem('selectedPersonKey', id); // save it temporeriy
                document.location.href = 'viewAdult.html'; //TODO   show the view member. we need to change this command to new window
            }
        });
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
                    })
                    sessionStorage.setItem('adltList', JSON.stringify(adltList)); // save it in session
                    resolve(adltList);
                })

        } else {
            adltList = JSON.parse(sessionStorage.getItem('adultList'));
            console.log("adltList is from session")
            resolve(adltList);
        }
    })
}

function createAdultListByName(adltList) {

    const byNameList = adltList.map(member => {
        const {
            First,
            Last,
            AdultProffesion,
            Key
        } = member;
        return {

            title: First + ' ' + Last,
            description: AdultProffesion,
            firebaseKey: Key

        };

    })
    return byNameList;
}



/* the 'click listener' of the search. works with 'click' and also with enter! */
function onSelect(result, response) {
    const {
        title,
        id,
        firebaseKey
    } = result; // we could do also result.firebaseKey.
    sessionStorage.setItem('selectedPersonKey', firebaseKey); // save it temporeriy
    document.location.href = 'viewAdult.html';

}

/*TODO- sort before show!    show the table of all the memberlists. */
function showTable(adltList) {

    adltList.sort(function (a, b) {

        let nameA = a.First + " " + a.Last;
        let nameB = b.First + " " + b.Last;
        if (nameA < nameB)
            return -1;
        if (nameA > nameB)
            return 1;
        return 0;
    });
    console.log(adltList);
    let str = '<thead> <tr> <th>מקצוע</th><th>שם </th><th>מספר טלפון </th>  </thead>  <tbody> ';
    adltList.forEach(function (member) {
        str += '<tr class = "table-text" id = ' + member.Key + '><td>' + (member.AdultProffesion) + '</td> <td>' + member.First + ' ' + member.Last + '</td><td>' + member.PhoneNum + '</td></tr>';
    })
    str += '</tbody>';

    $("#adultTable").html(str);
    //(sortTable());
}

function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("adultTable");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("td")[0];
            y = rows[i + 1].getElementsByTagName("td")[0];
            //check if the two rows should switch place:
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}