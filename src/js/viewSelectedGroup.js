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

function onChange(value, text, $choise) {
    let groupsData = JSON.parse(sessionStorage.getItem('groupsData'));
    
    if ($choise.attr('id') && $choise.attr('id') == "addGroupChoice") // add new group option
    {
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

function groupsDropDown(groupsData) {
    let colors = ["red", "blue", "yellow", "violet", "green", "olive", "purple", "teal"]

    let str = "";
    str += "<div class='header'>";
    str += "<i class='tags icon'></i>";
    str += "בחר</div>";
    str += "<div class='divider'></div>";

    str += "<div id='addGroupChoice' class='item'>";
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

function groupDetails(selectedgroupsData) {

    const $form = $('#addGroupForm');

    $form.hide();

    $("#showNamePlaceHoler").text(selectedgroupsData.groupName);
    $("#showInstructorName").text("שם המדריך: " + selectedgroupsData.groupInstructor);
    $("#showInstructorPhone").text("מספר הטלפון: " + selectedgroupsData.groupPhoneNum);

    $('#editGroupBtn').show();
    
    $('#editGroupBtn').unbind().click(function () {                    // edit button press
        console.log("edit clicked")
        editGroup(selectedgroupsData)
    });

}

/**  section ADD NEW GROUP */

function addNewGroup(groupsData) {

    console.log("addNewGroup function")
    $("#showNamePlaceHoler").text("");    // dont show the group details
    $("#showInstructorName").text("");
    $("#showInstructorPhone").text("");
    $('#editGroupBtn').hide();

    const $form = $('#addGroupForm');
    $form.show();

    $form.unbind().submit(function (e) {
        console.log(" clicked on sumbit - in the add submit");
        e.preventDefault();
        let groupName = $("#newGroupName").val();
        let guideName = $("#guideName").val();
        let guidePhoneNum = $("#guidePhoneNum").val();

        if (groupsData.find(group => group.groupName == groupName)) // if there is already group with this name
        {
            alert("שם הקבוצה תפוס , בחר שם אחר");
            return;
        }
        addToDataBase(groupName, guideName, guidePhoneNum, groupsData);
    });
}


// will save the new GROUP in firestore and in the session +Key
function addToDataBase(groupName, guideName, guidePhoneNum, groupsData) {

    let groupTracking = [];

    console.log("is adding new group now");
    return;

    firestore.collection("Groups").add({ // add the member with Auto id 
        groupInstructor: guideName,
        groupPhoneNum: guidePhoneNum,
        groupName: groupName,
        groupTracking: groupTracking

    }).then(function (docRef) {

        addKeyToGroup(docRef, groupName, guideName, guidePhoneNum, groupsData);
        $('#successfully-add').modal('show');
        $(".add-btn").modal({
            closable: true
        });

        $("#addGroupForm")[0].reset();

    }).catch(function (error) {
        console.log("got error!!!", error)
    });

}


function addKeyToGroup(docRef, groupName, guideName, guidePhoneNum, groupsData) {
    firestore.collection("Groups").doc(docRef.id).set({
        Key: docRef.id // add the key of firebase to the data.
    }, {
            merge: true
        })
        .then(function () {
            addToSession(groupName, guideName, guidePhoneNum, groupsData, docRef.id);
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });

}

function addToSession(groupName, guideName, guidePhoneNum, groupsData, key) {
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


/**  section EDIT GROUP */


function editGroup(selectedgroupsData) {

    formAddToEdit(selectedgroupsData);
    const $form = $('#addGroupForm');

    $form.unbind().submit(function (e) {
        e.preventDefault();
        console.log("in the save the Edits submit");
        updateDatabase(selectedgroupsData)

    });
}


function formEditToAdd(selectedgroupsData) {
    $('#formHeader').text("הוסף קבוצה חדשה");
    $("#newGroupName").val("");
    $("#guideName").val("");
    $('#editGroupBtn').hide();
    $("#guidePhoneNum").val("");
    $('#addGroupBtn').text("הוסף קבוצה");
    groupDetails(selectedgroupsData);
}


function formAddToEdit(selectedgroupsData) {
    $("#showNamePlaceHoler").text("");
    $("#showInstructorName").text("");
    $("#showInstructorPhone").text("");
    $('#addGroupForm').show();
    $('#editGroupBtn').hide();
    $('#formHeader').text(selectedgroupsData.groupName)
    $("#newGroupName").val(selectedgroupsData.groupName);
    $("#guideName").val(selectedgroupsData.groupInstructor);
    $("#guidePhoneNum").val(selectedgroupsData.groupPhoneNum);
    $('#addGroupBtn').text("שמור שינויים");
}



function updateDatabase(selectedgroupsData) {
    let groupName = $("#newGroupName").val();
    let guideName = $("#guideName").val();
    let guidePhoneNum = $("#guidePhoneNum").val();

    let isGroupNameChanged = selectedgroupsData.groupName != groupName;
    console.log("name changed? " + isGroupNameChanged);

    if (isGroupNameChanged && (JSON.parse(sessionStorage.getItem('groupsData'))).find(group => group.groupName == groupName)) // if there is already group with the new name
    {
        alert("שם הקבוצה תפוס , בחר שם אחר");
        return;
    }

    if (groupName == selectedgroupsData.groupName && guideName == selectedgroupsData.groupInstructor && guidePhoneNum == selectedgroupsData.groupPhoneNum) // no change
    {
        console.log("no change so do nothing")
        formEditToAdd(selectedgroupsData);
        return;
    }

    console.log("gonna updata now:"+ groupName,guideName,guidePhoneNum);
    return;
    var updateRef = firestore.collection("Groups").doc(selectedgroupsData.Key);

    return updateRef.update({
        groupInstructor: guideName,
        groupPhoneNum: guidePhoneNum,
        groupName: groupName
    })
        .then(function () {
            console.log("Document successfully updated!");
            updateSession(selectedgroupsData, groupName, guideName, guidePhoneNum);


        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}


function updateSession(selectedgroupsData, groupName, guideName, guidePhoneNum) {
    let groupsData = JSON.parse(sessionStorage.getItem('groupsData'));
    let foundIndex = groupsData.findIndex(x => x.Key == selectedgroupsData.Key);
    groupsData[foundIndex].groupName = groupName;
    groupsData[foundIndex].groupPhoneNum = guidePhoneNum;
    groupsData[foundIndex].groupInstructor = guideName;
    sessionStorage.setItem('groupsData', JSON.stringify(groupsData)); // save it temporeriy
    console.log("session updated successfully")
    selectedgroupsData = groupsData[foundIndex]  // update the selectedgroupsData
    formEditToAdd(selectedgroupsData);

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


//   - this part is for the group MEMBERS!

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


function showTable(GroupMemebers) {
    let str = '<thead> <tr> <th>שם </th> <th>טלפון</th> </tr> </thead>  <tbody> ';
    GroupMemebers.forEach(function (memeber) {
        str += '<tr id = ' + memeber.Key + ' > <td>' + memeber.First + ' ' + memeber.Last + '</td> <td>' + (memeber.PhoneNum) + '</td> </tr>';
    })
    str += '</tbody>';
    $("#groupMemberTable").html(str);
}
