const firestore = firebase.firestore();

/*when document is ready*/
$(document).ready(function () {

    creatNamesList();

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

// $("#search").select(function(){
//     console.log("got it ");
// })

$("#search").keyup(function(){
    $("#inputId").blur();
    $("#inputId").focus();
});

$("#search").change(function(){
    console.log("got it ");
    //do whatever you need to do on actual change of the value of the input field
});