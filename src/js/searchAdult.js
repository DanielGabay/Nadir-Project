const firestore = firebase.firestore(); // connect to our firebase storage.

/*when document is ready*/
$(document).ready(function () {
    getAllMemebers().then(adltList => { // only when getallmemebers return the memberlist continue:
        $('#loader').removeClass('active'); // remove the loader 
        const byNameList = createAdultListByName(adltList);
        const byProList =  createAdultListByPro(adltList);

        $('#byName').click(function () { //search by name
            $("#byName").addClass("buttonFocus");
            $("#byPro").removeClass("buttonFocus");
            console.log("clicked");

                $('.ui.search').search({ // to show the search options
                    source: byNameList,
                    onSelect: onSelect
                })
        });

        $('#byPro').click(function () { // search by proffesion 
            $("#byPro").addClass("buttonFocus");
            $("#byName").removeClass("buttonFocus");   
            console.log("clicked2");
                $('.ui.search').search({ // to show the search options
                    source: byProList,
                    onSelect: onSelect
                })
        });
        showTable(adltList); // load the table.first -> without display it.
     
      
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

    function createAdultListByName(adltList){
   
        const byNameList = adltList.map(member => {
            const {
                First,
                Last,
                AdultProffesion,
                Key
            } = member;
            return {
              
                title: First + ' ' + Last + ' ' + AdultProffesion,
                firebaseKey: Key
              
            };
           
        } )
        return byNameList;
    }

    function createAdultListByPro(adltList){
        const byProList = adltList.map(member => {
            const {
                AdultProffesion,
                First,
                Last,
                Key
            } = member;
            
            return {
                title: AdultProffesion + ' ' + First + ' ' + Last,
                firebaseKey: Key
            };

        } )
        return byProList;
    }

    /* the 'click listener' of the search. works with 'click' and also with enter! */
function onSelect(result, response) {
    const {
        title,
        id,
        firebaseKey
    } = result; // we could do also result.firebaseKey.
    sessionStorage.setItem('selectedPersonKey',firebaseKey); // save it temporeriy
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
    let str = '<thead> <tr> <th>שם </th><th>מספר טלפון </th> <th>קבוצה</th> </tr> </thead>  <tbody> ';
    adltList.forEach(function (member) {
        str += '<tr class = "table-text" id = ' + member.Key + '> <td>' + member.First + ' ' + member.Last + '</td><td>' + member.PhoneNum + '</td> <td>' + (member.Group || "לא משויך לקבוצה") + '</td> </tr>';
    })
    str += '</tbody>';

    $("#adultTable").html(str);
   //(sortTable());
}

