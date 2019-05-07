const firestore = firebase.firestore();


/*when document is ready*/
$(document).ready(function () {

    creatNamesList();
    $("#show-all").click(function(){
        showTable();

    });
    // $( "#my_search" ).trigger( "search" );

});


function creatNamesList() {
    var content = []; // array of all names


    firestore.collection("Members").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            let person = doc.data(); // pointer for document
            let personName = person.First + " " + person.Last; // shirshur the name
            let d = { title: personName };
            content.push(d); // add for array of all names
        });
        $('.ui.search')
            .search({
                source: content
            })
    });
}

$("#search").click(function () {         //// need to fix this 1!!!!!!! doesting catch the right name
    console.log("ייי");
    const memberName = $(this).text();
    console.log( memberName);
    var lol = "אסף";
    localStorage.setItem('name',memberName);
    document.location.href = 'viewMember.html';

})


function showTable() {
    let str = '<thead> <tr> <th>שם </th> <th>קבוצה</th> </tr> </thead>  <tbody> ';

    firestore.collection("Members").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            let person = doc.data(); // pointer for document
            str +='<tr> <td>' + person.First + ' ' + person.Last + '</td> <td>' + person.Group + '</td> </tr>'
        }
        )
        str += '</tbody>';
        $("#membersTable").html(str);
    });

}