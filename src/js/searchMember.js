const firestore = firebase.firestore(); // connect to our firebase storage.

/*when document is ready*/
$(document).ready(function () {
    getAllMembers().then(memberList => { // only when getallmembers return the memberlist continue:
        $('.description b').text(memberList.length);
        $('#loader').removeClass('active'); // remove the loader .

        const searchList = convertMemberListToSearchList(memberList);

        $('.ui.search').search({ // to show the search options
            source: searchList,
            onSelect: onSelect
        })
        showTable(memberList); // load the table.first -> without display it.
        
        const $table = $('#membersTable');
        $("#show-all").click(function () { // show-table. we can change animation.
            $table.transition('slide down');
        });

        $('#membersTable td').click(function () {
            const id = ($(this).closest('tr').attr('id'));
            console.log(id); // add click even to every row!!!
            if (id) {
                sessionStorage.setItem('selectedPersonKey', id); // save it temporeriy
                document.location.href = 'viewMember.html'; //TODO   show the view member. we need to change this command to new window
            }

        });
    })

});

/*return a promise - mean, that this function return something that we can do .then() after it*/
function getAllMembers() {
    return new Promise((resolve) => { // resolve <--->is need with promise.
        let memberList = []; // save all the member data.

        if (sessionStorage.getItem("memberList") === null || JSON.parse(sessionStorage.getItem('memberList')).length === 0) { // if its the first time 
            console.log("memberList is from FireBase")
            firestore.collection("Members").where("IsAdult", "==", "false").get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        const person = doc.data(); // pointer for document
                        memberList.push(person); // add for array of all names
                    })
                    sessionStorage.setItem('memberList', JSON.stringify(memberList)); // save it temporeriy
                    resolve(memberList);
                })
                
        } else {
            memberList = JSON.parse(sessionStorage.getItem('memberList'));
            console.log("memberlist is from session")
            resolve(memberList);
        }

    })

}

/* return array of object for the search method of 'semntic'. we need 'title' for semntic and firebasekey will be send to 'viewMember' */
function convertMemberListToSearchList(memberList) {
    const searchList = memberList.map(member => {
        const {
            First,
            Last,
            Key
        } = member;
        return {
            title: First + ' ' + Last,
            firebaseKey: Key
        };
    })
    return searchList;
}

/* the 'click listener' of the search. works with 'click' and also with enter! */
function onSelect(result, response) {
    const {
        title,
        id,
        firebaseKey
    } = result; // we could do also result.firebaseKey.
    sessionStorage.setItem('selectedPersonKey', firebaseKey); // save it temporeriy
    document.location.href = 'viewMember.html'; //TODO   show the view member. we need to change this command to new window
}

/*TODO- sort before show!    show the table of all the memberlists. */
function showTable(memberList) {
    
    memberList.sort(function (a, b) {

        let nameA = a.First + " " + a.Last;
        let nameB = b.First + " " + b.Last;  
        if (nameA < nameB) 
          return -1;
        if (nameA > nameB)
          return 1;
        return 0; 
      });
    console.log(memberList);
    let str = '<thead> <tr> <th>שם </th><th>מספר טלפון </th> <th>קבוצה</th> </tr> </thead>  <tbody> ';
    memberList.forEach(function (member) {
        str += '<tr class = "table-text" id = ' + member.Key + '> <td>' + member.First + ' ' + member.Last + '</td><td>' + member.PhoneNum + '</td> <td>' + (member.Group || "לא משויך לקבוצה") + '</td> </tr>';
    })
    str += '</tbody>';

    $("#membersTable").html(str);
   //(sortTable());
}


function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("membersTable");
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



  