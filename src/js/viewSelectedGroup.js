const firestore = firebase.firestore();
const selectedgroup = "קבוצה 0"; // TODO : change it to selected 1

const selectedgroupsData = JSON
  .parse(sessionStorage.getItem('groupsData'))
  .find(group => group.groupName === selectedgroup);  

$(document).ready(function () {
 

  $("#namePlaceHoler").text(selectedgroupsData.groupName);
  $("#instructorName").append(selectedgroupsData.groupInstructor);
  $("#instructorPhone").append(selectedgroupsData.groupPhoneNum);

  getGorupMemebers(selectedgroup).then(memeberGroup => {  // only when getallmemebers return the memberlist continue:
    $('#loader').removeClass('active'); // remove the loader .
        showTable(memeberGroup); // load the table.first -> without display it.
        const $table = $('#groupMemberTable');
        // show-table. we can change animation.
            $table.transition('jiggle');
            
            $('#groupMemberTable tr').click(function(event) {
               console.log ($(this).closest('tr').attr('id'));   // add click even to every row!!!           
            });   
})

});

function showTable(GroupMemebers) {

     let str = '<thead> <tr> <th>שם </th> <th>טלפון</th> </tr> </thead>  <tbody> ';
     GroupMemebers.forEach(function (memeber) {
                str += '<tr id = '+memeber.Key+' > <td>' + memeber.First + ' ' + memeber.Last + '</td> <td>' + (memeber.PhoneNum ) + '</td> </tr>';
            })
            str += '</tbody>';
            $("#groupMemberTable").html(str);
}

function getGorupMemebers(selectedgroup) {
    return new Promise((resolve) => {   // resolve <--->is need with promise.
        let Groupmemebers = []; // save all the member data.
     
        if (sessionStorage.getItem("memberList") === null) {  // if its the first time 
        firestore.collection("Members").where("Group", "==", selectedgroup).get()
            .then(function (querySnapshot) {     
                querySnapshot.forEach(function (doc) {
                    const person = doc.data(); // pointer for document
                    Groupmemebers.push(person); // add for array of all names
                });
                resolve(Groupmemebers);
            });
        }
        else{   
            Groupmemebers = JSON.parse(sessionStorage.getItem('memberList')).filter(memeber => memeber.Group == selectedgroup );
            resolve(Groupmemebers);
        }

    })

}