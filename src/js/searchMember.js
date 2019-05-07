const firestore = firebase.firestore();

/*when document is ready*/
$(document).ready(function () {

    creatNamesList();
    showTable();
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

$(".title").click(function () {
    console.log("ייי");
    const search = $(this).text();
    console.log(search);
})



function showTable() {
    let str = '<thead> <tr> <th>שם </th> <th> </th> <th>קבוצה</th> </tr> </thead>  <tbody> ';

    firestore.collection("Members").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            let person = doc.data(); // pointer for document
            console.log(person.First);
            str +='<tr> <td>' + person.First + '</td> <td>' + person.Last + '</td> <td>' + person.Group + '</td> </tr>'
        }
        )

        str += '</tbody>';
        console.log(str);
        $("#membersTable").append(str);
    });

}

