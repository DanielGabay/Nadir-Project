const firestore = firebase.firestore();

let selectedGroup = {}  //  save the group we just selected + if add pressed-> be the group we want to add .
let groupsData =[]; // // save groups data from firebase/ session

$(document).ready(function () {



    getGroupsData().then(groupsData => {

        groupsDropDown(groupsData);
        $('#loader').removeClass('active'); // remove the loader .

        $('.ui.dropdown')   // drop down settings
            .dropdown({
                on: 'hover',
                onChange: onChange
            });
    })

    $('#editGroupBtn').unbind().click(function () {     // edit button press
        console.log("edit clicked")
        formAddToEdit();
    });

    $('#addGroupForm').unbind().submit(function (e) {   // add button press
        console.log(" clicked on sumbit - in the add submit");
        e.preventDefault();

       let addOrSaveBtn = $('#addGroupBtn').text();

        if (addOrSaveBtn == "הוסף קבוצה")
        {
            selectedGroup.groupName = $("#newGroupName").val();
            selectedGroup.groupInstructor = $("#guideName").val();
            selectedGroup.groupPhoneNum = $("#guidePhoneNum").val();

            console.log("selectedgroup updated in הוסף קבוצה")
            console.log(selectedGroup);
    
            if (groupsData.find(group => group.groupName == selectedGroup.groupName)) // if there is already group with this name
            {
                alert("שם הקבוצה תפוס , בחר שם אחר");
                return;
            }
            addToDataBase();
        }
        
        else if( addOrSaveBtn == "שמור שינויים")
        {
            console.log("press saved!");
            updateDatabase()
        }
       
    });

});

function groupsDropDown(groupsData) {
    let colors = ["red", "blue", "yellow", "violet", "green", "olive", "purple", "teal"]

    let str = "";
    str += "<div class='header'>";             // tag in the beginning
    str += "<i class='tags icon'></i>";
    str += "בחר</div>";
    str += "<div class='divider'></div>";

    str += "<div id='addGroupChoice' class='item'>";       // the add option to the drop down
    str += "<i class='plus icon'></i>";
    str += "הוסף קבוצה</div>";
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
    
    if ($choise.attr('id') && $choise.attr('id') == "addGroupChoice") // add new group option
    {
        ScreenToaddGroup();
        return;
    }

    const selectedgroupName = $choise.text();
    selectedGroup = groupsData.find(group => group.groupName === selectedgroupName);  // update the global selectedGroup

    groupDetails();

    getGorupMemebers(selectedgroupName).then(memeberGroup => {  // only when getallmemebers return the memberlist continue:
        $('#howMany').text(memeberGroup.length + " חניכים בקבוצה");
        if(memeberGroup.length > 0) // there is members in this group
        {
            showTable(memeberGroup); // load the table.first -> without display it.
      
            const $table = $('#groupMemberTable');
           // // show-table. we can change animation.
            $table.transition('pulse');
   
           $('#groupMemberTable td').click(function (event) {
               console.log($(this).closest('tr').attr('id'));   // add click even to every row!!!           
           });
        }
        else{
            $("#groupMemberTable").html("");
            $('#groupMemberTable').hide();
            
        }
       
    })
}



/** show the group details in the left side of the screen */
function groupDetails() {

    const $form = $('#addGroupForm'); // no need from
    $form.hide();
    $("#group-details").show();
    $("#showNamePlaceHoler").text(selectedGroup.groupName);
    $("#showInstructorName").text("שם המדריך: " + selectedGroup.groupInstructor);
    $("#showInstructorPhone").text("מספר הטלפון: " + selectedGroup.groupPhoneNum);
    $('#editGroupBtn').show();  // now can press the edit button.
    $('#trackingGroupBtn').show();
}

/**  section ADD NEW GROUP */

function ScreenToaddGroup() {
    $("#group-details").hide();
    $('#groupMemberTable').hide();
    selectedGroup = {};  //  reset the selected group;
    console.log("ScreenToaddGroup function")
    $('#formHeader').text("הוסף קבוצה חדשה");
    $("#newGroupName").val("");
    $("#guideName").val("");
    $("#guidePhoneNum").val("");
    $('#addGroupBtn').text("הוסף קבוצה");
    $("#showNamePlaceHoler").text("");    // dont show the group details
    $("#showInstructorName").text("");
    $("#showInstructorPhone").text("");
    $('#editGroupBtn').hide();
    $('#trackingGroupBtn').hide();

    const $form = $('#addGroupForm');
    $form.show();
}


// will save the new GROUP in firestore and in the session +Key
function addToDataBase() {

    selectedGroup.groupTracking =[],
    
    console.log("is adding new group now");
    
    firestore.collection("Groups").add({ // add the member with Auto id
        groupName: selectedGroup.groupName, 
        groupInstructor: selectedGroup.groupInstructor,
        groupPhoneNum: selectedGroup.groupPhoneNum,
        groupTracking: selectedGroup.groupTracking

    }).then(function (docRef) {

        addKeyToGroup(docRef);
        $('#successfully-add').modal('show');
        $(".add-btn").modal({
            closable: true
        });

        $("#addGroupForm")[0].reset();

    }).catch(function (error) {
        console.log("got error!!!", error)
    });

}

/** add the key to the atributes of the group + call update session */
function addKeyToGroup(docRef) {

    selectedGroup.Key = docRef.id
    firestore.collection("Groups").doc(docRef.id).set({
        Key: docRef.id // add the key of firebase to the data.
    }, {
            merge: true
        })
        .then(function () {
            addToSession();
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });

}

function addToSession() {
    
    groupsData.push({
        groupName: selectedGroup.groupName,
        groupInstructor: selectedGroup.groupInstructor,
        groupPhoneNum: selectedGroup.groupPhoneNum,
        groupTracking:selectedGroup.groupTracking,
        Key: selectedGroup.Key
    });
    sessionStorage.setItem('groupsData', JSON.stringify(groupsData));
    console.log("session updated with the new group!");
    selectedGroup = {}; // reset after adding
    groupsDropDown(groupsData);
    
}


/**  section EDIT GROUP */

// edit group --->formAddToEdit


function formEditToAdd() {
    $('#formHeader').text("הוסף קבוצה חדשה");
    $("#newGroupName").val("");
    $("#guideName").val("");
    $('#editGroupBtn').hide();
    $('#trackingGroupBtn').hide();
    $("#guidePhoneNum").val("");
    $('#addGroupBtn').text("הוסף קבוצה");
    groupDetails();
}


function formAddToEdit() {
    $("#showNamePlaceHoler").text("");
    $("#showInstructorName").text("");
    $("#showInstructorPhone").text("");
    $('#addGroupForm').show();
    $('#editGroupBtn').hide();
    $('#trackingGroupBtn').hide();
    $('#formHeader').text(selectedGroup.groupName)
    $("#newGroupName").val(selectedGroup.groupName);
    $("#guideName").val(selectedGroup.groupInstructor);
    $("#guidePhoneNum").val(selectedGroup.groupPhoneNum);
    $('#addGroupBtn').text("שמור שינויים");
}

function updateDatabase() {
    let groupNameUpdated = $("#newGroupName").val();
    let guideNameUpdated = $("#guideName").val();
    let guidePhoneNumUpdated = $("#guidePhoneNum").val();

    let isGroupNameChanged = selectedGroup.groupName != groupNameUpdated;
    console.log("name changed? " + isGroupNameChanged);

    if (isGroupNameChanged && groupsData.find(group => group.groupName == groupNameUpdated)) // if there is already group with the new name
    {
        alert("שם הקבוצה תפוס , בחר שם אחר");
        return;
    }

    if (groupNameUpdated == selectedGroup.groupName && guideNameUpdated == selectedGroup.groupInstructor && guidePhoneNumUpdated == selectedGroup.groupPhoneNum) // no change
    {
        console.log("no change so do nothing")
        formEditToAdd();
        return;
    }
    
    console.log("gonna updata now:"+ groupNameUpdated,guideNameUpdated,guidePhoneNumUpdated);
    
    var updateRef = firestore.collection("Groups").doc(selectedGroup.Key);

    return updateRef.update({
        groupInstructor: guideNameUpdated,
        groupPhoneNum: guidePhoneNumUpdated,
        groupName: groupNameUpdated
    })
        .then(function () {
            console.log("Document successfully updated!");
            selectedGroup.groupName = groupNameUpdated
            selectedGroup.groupInstructor = guideNameUpdated
            selectedGroup.groupPhoneNum = guidePhoneNumUpdated
            updateSession();


        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}

function updateSession() {
    let foundIndex = groupsData.findIndex(x => x.Key == selectedGroup.Key);
    groupsData[foundIndex].groupName = selectedGroup.groupName;
    groupsData[foundIndex].groupPhoneNum = selectedGroup.groupInstructor;
    groupsData[foundIndex].groupInstructor = selectedGroup.groupPhoneNum;
    sessionStorage.setItem('groupsData', JSON.stringify(groupsData)); // save it temporeriy
    console.log("session updated successfully")
    formEditToAdd();
    groupsDropDown(groupsData);
}

function getGroupsData() {
    return new Promise((resolve) => { // resolve <--->is need with promise.
      //  let groupsData = []; // save all the member data.

      
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
