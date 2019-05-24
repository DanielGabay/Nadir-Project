const firestore = firebase.firestore();

$(document).ready(function () {

    getGroupsData().then(groupsData => {
        groupsDropDown(groupsData);
        $('#loader').removeClass('active'); // remove the loader .

        $('.ui.dropdown')
            .dropdown({
                on: 'hover',
                onChange: onChange
            });
    })
});


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
        else {
            Groupmemebers = JSON.parse(sessionStorage.getItem('memberList')).filter(memeber => memeber.Group == selectedgroup);
            resolve(Groupmemebers);
        }

    })

}

function getGroupsData() {
    return new Promise((resolve) => { // resolve <--->is need with promise.
        let groupsData = []; // save all the member data.

        if (sessionStorage.getItem("groupsData") === null || JSON.parse(sessionStorage.getItem('groupsData')).length === 0) { // if its the first time 
            console.log("groupsData is from FireBase")
            firestore.collection("Groups").get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        const group = doc.data(); // pointer for document
                        groupsData.push(group); // add for array of all names
                    })

                    sessionStorage.setItem('groupsData', JSON.stringify(groupsData)); // save it temporeriy
                    resolve(groupsData);
                })

        } else {
            groupsData = JSON.parse(sessionStorage.getItem('groupsData'));
            console.log("groupsData is from session")
            resolve(groupsData);
        }
    })
}

function groupsDropDown(groupsData) {
    let colors = ["red", "blue", "yellow", "violet", "green", "olive", "purple", "teal"]

    let str = "";
    str += "<div class='header'>";
    str += "<i class='tags icon'></i>";
    str += "בחר</div>";
    str += "<div class='divider'></div>";

    str += "<div id='addGroupChoise' class='item'>";
    str += "<i class='plus icon'></i>";
    str += "הוסף קבוצה </div>";
    str += "<div class='divider'></div>";

    if (groupsData) {
        for (let i = 0; i < groupsData.length; i++) {
            const color = colors[i % colors.length];
            str += "<div class='item'>";

            str += "<div class='ui " + color + " empty circular label'></div>";
            str += groupsData[i].groupName;
            str += "</div>";
        }

        $("#groups-menu").html(str);
    }
    else {
        console.log("there is no groups yet. so appent nothing")

    }

}

function onChange(value, text, $choise) {
    let groupsData = JSON.parse(sessionStorage.getItem('groupsData'));
    console.log($choise.attr('id'))

    if ($choise.attr('id') && $choise.attr('id') == "addGroupChoise") // add new group option
    {
        console.log("need to add new gorup")
        addNewGroup(groupsData);
        return;
    }

    const selectedgroup = $choise.text();
    const selectedgroupsData = groupsData.find(group => group.groupName === selectedgroup);

    groupDetails(selectedgroupsData);

    getGorupMemebers(selectedgroup).then(memeberGroup => {  // only when getallmemebers return the memberlist continue:

        showTable(memeberGroup); // load the table.first -> without display it.

        // const $table = $('#groupMemberTable');
        // // show-table. we can change animation.
        // $table.transition('shake');

        $('#groupMemberTable tr').click(function (event) {
            console.log($(this).closest('tr').attr('id'));   // add click even to every row!!!           
        });
    })

}

function groupDetails(selectedgroupsData) {

    const $form = $('#addGroupForm');

    $form.hide();
    // show-table. we can change animation.
    // $form.transition('drop out');

    $("#showNamePlaceHoler").text(selectedgroupsData.groupName);
    $("#showInstructorName").text("שם המדריך: " + selectedgroupsData.groupInstructor);
    $("#showInstructorPhone").text("מספר הטלפון: " + selectedgroupsData.groupPhoneNum);

    const $editBtn = $('#editGroupBtn');
    $editBtn.show();

    $editBtn.click(function () {           // edit button press
        editGroup(selectedgroupsData)
    });

    // const $table = $('#group-details');
    // // show-table. we can change animation.
    // $table.transition('flash');

}

function addNewGroup(groupsData) {
    $("#showNamePlaceHoler").text("");
    $("#showInstructorName").text("");
    $("#showInstructorPhone").text("");

    const $form = $('#addGroupForm');
    $form.show();
    // // show-table. we can change animation.
    // $form.transition('drop');
    $form.submit(function (e) {
        e.preventDefault();
        
        let groupName = $("#newGroupName").val();
        let guideName = $("#guideName").val();
        let guidePhoneNum = $("#guidePhoneNum").val();

        if (groupsData.find(group => group.groupName == groupName)) // if there is already group with this name
        {
            alert("שם הקבוצה תפוס , בחר שם אחר");
            return;
        }
         addToDataBase(groupName, guideName, guidePhoneNum,groupsData);
    });
}

function addToDataBase(groupName, guideName, guidePhoneNum, groupsData) {

    let groupTracking = [];

    firestore.collection("Groups").add({ // add the member with Auto id 
        groupInstructor: guideName,
        groupPhoneNum: guidePhoneNum,
        groupName: groupName,
        groupTracking: groupTracking

    }).then(function (docRef) {

        addKeyToGroup(docRef,groupName, guideName, guidePhoneNum,groupsData);
        $('#successfully-add').modal('show');
        $(".add-btn").modal({
            closable: true
        });

        $("#addGroupForm")[0].reset();

    }).catch(function (error) {
        console.log("got error!!!", error)
    });

}


function addKeyToGroup(docRef,groupName, guideName, guidePhoneNum,groupsData) {
    firestore.collection("Groups").doc(docRef.id).set({
            Key: docRef.id // add the key of firebase to the data.
        }, {
            merge: true
        })
        .then(function () {
            addToSession(groupName, guideName, guidePhoneNum, groupsData ,docRef.id);
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });

}

function addToSession(groupName, guideName, guidePhoneNum, groupsData,key) {
    let groupTracking = [];
    groupsData.push({

        groupInstructor: guideName,
        groupPhoneNum: guidePhoneNum,
        groupName: groupName,
        groupTracking: groupTracking,
        Key: key

    });
    sessionStorage.setItem('groupsData', JSON.stringify(groupsData));
    console.log("session updated with the new group!");
    groupsDropDown(groupsData)
}

function editGroup(selectedgroupsData) {

    formAddToEdit(selectedgroupsData);
    $('#editGroupBtn').click(function () {           // edit button press
        saveAfterEdit(selectedgroupsData);
    });
}

function formAddToEdit(selectedgroupsData) {
    $("#showNamePlaceHoler").text("");
    $("#showInstructorName").text("");
    $("#showInstructorPhone").text("");
    $('#addGroupForm').show();
    $('#addGroupBtn').hide();
    $('#formHeader').text(selectedgroupsData.groupName)

    $("#newGroupName").val(selectedgroupsData.groupName);
    $("#guideName").val(selectedgroupsData.groupInstructor);
    $("#guidePhoneNum").val(selectedgroupsData.groupPhoneNum);

    $('#editGroupBtn').text("שמור שינויים");
}

function saveAfterEdit(selectedgroupsData) {
    console.log("here need to save the change")
    
    updateDatabase(selectedgroupsData)
}

function updateDatabase (selectedgroupsData)
{
    let groupName = $("#newGroupName").val();
    let guideName = $("#guideName").val();
    let guidePhoneNum = $("#guidePhoneNum").val();

    console.log(groupName,guideName,guidePhoneNum);


    if (selectedgroupsData.groupName != groupName &&(JSON.parse(sessionStorage.getItem('groupsData'))).find(group => group.groupName == groupName)) // if there is already group with the new name
    {
        alert("שם הקבוצה תפוס , בחר שם אחר");
        return;
    }

    var updateRef = firestore.collection("Groups").doc(selectedgroupsData.Key);

    return updateRef.update({
        groupInstructor: guideName,
        groupPhoneNum: guidePhoneNum,
        groupName: groupName
    })
    .then(function() {
        console.log("Document successfully updated!");
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

function showTable(GroupMemebers) {
    let str = '<thead> <tr> <th>שם </th> <th>טלפון</th> </tr> </thead>  <tbody> ';
    GroupMemebers.forEach(function (memeber) {
        str += '<tr id = ' + memeber.Key + ' > <td>' + memeber.First + ' ' + memeber.Last + '</td> <td>' + (memeber.PhoneNum) + '</td> </tr>';
    })
    str += '</tbody>';
    $("#groupMemberTable").html(str);
}