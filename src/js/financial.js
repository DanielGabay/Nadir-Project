const firestore = firebase.firestore(); /*initialize firestore*/
let memberList = []; /*keeping memberList from db or sessionStorage*/
let displayInTable = []; /*list of all memebers that are currently displayed in table*/
let selectedMembersArr = []; /*list of selectedMembers in add Group Payment modal*/

/*when page is loaded*/
$(document).ready(function () {
  /*fetch all membres from db/seesion storage*/
  getAllMembers().then(memberList => { // only when getallmembers return the memberlist continue:
    $('#loader').removeClass('active'); // remove the loader .
    $("#datePicker").attr("value", todayDate());
    /*fetch all group data from db/session storage*/
    getGroupsData().then(groupsData => {
      /*fill dropdown of group section in addPayment modal*/
      setGroups(groupsData);
    })

    fillTable_displayAll();
  })
  /*Setting listeners*/
  //display in table buttons
  $("#displayAllBtn").click(fillTable_displayAll);
  $("#displayOnlyRedBtn").click(fillTable_displayOnlyRed);
  $("#displayOnlyGreenBtn").click(fillTable_displayOnlyGreen);

  /*addPayment modal*/
  $("#addGroupPaymentBtn").click(addGroupPaymentModal); // opens
  $("#addPaymentForm").submit(addPayment);
  $('#addGroupPaymentBtn')
    .popup({
      inline: true
    });
  $("#group").change(function () {
    openMemberSelectModal(false);
  });
  $("#displayBtn").click(function () {
    openMemberSelectModal(true);
  });

  $("#selectModalNo").click(function () {
    selectedMembersArr = [];
    addGroupPaymentModal();
  });
  $("#selectModalYes").click(addGroupPaymentModal);

  $('#select-all').click(function () {
      $('#selectFromGroup').multiSelect('select_all');
      return false;
    }),
    $('#deselect-all').click(function () {
      $('#selectFromGroup').multiSelect('deselect_all');
      return false;
    })
});



/*=============functions=============*/

/*===fiiling by filter table==-*/

function fillTable_displayAll() {
  $("#displayAllBtn").addClass("twitter");
  $("#displayOnlyRedBtn").removeClass("twitter");
  $("#displayOnlyGreenBtn").removeClass("twitter");
  displayInTable = [];
  memberList.forEach(member => {
    let sum = sumAllPayments(member.FinancialMonitoring);
    displayInTable.push({
      member,
      sum
    });
  })
  fill_table(displayInTable);
}

function fillTable_displayOnlyRed() {
  $("#displayAllBtn").removeClass("twitter");
  $("#displayOnlyRedBtn").addClass("twitter");
  $("#displayOnlyGreenBtn").removeClass("twitter");
  displayInTable = [];
  memberList.forEach(member => {
    let sum = sumAllPayments(member.FinancialMonitoring);
    if (sum > 0)
      displayInTable.push({
        member,
        sum
      });
  })
  fill_table(displayInTable);
}

function fillTable_displayOnlyGreen() {
  $("#displayAllBtn").removeClass("twitter");
  $("#displayOnlyRedBtn").removeClass("twitter");
  $("#displayOnlyGreenBtn").addClass("twitter");

  displayInTable = [];
  memberList.forEach(member => {
    let sum = sumAllPayments(member.FinancialMonitoring);
    if (sum < 0)
      displayInTable.push({
        member,
        sum
      });
  })
  fill_table(displayInTable);
}


/*===modals init===*/

/*opening addGroupPayment Modal*/
function addGroupPaymentModal() {
  $('#selectedCountIcon').empty();
  $('#selectedCountIcon').append(selectedMembersArr.length + '<i class ="child icon"></i>').show();
  if (selectedMembersArr.length != 0) {
    $("#errorPlaceHolder").removeClass("ui error mesage").hide();
  } 
  $('#groupPaymentModal')
    .modal({
      inverted: true
    })
    .modal('show');
}


function openMemberSelectModal(btnClicked) {
  $('#selectPlaceHolder').empty();
  let select = '<select multiple="multiple" id="selectFromGroup">';
  let group = $('#group').val();
  if (btnClicked === false)
    selectedMembersArr = [];
  if (group === null)
    return;

  let optionArr = getMembersToSelect(group);
  /*filtering option -> if btnClicked (means that the user want to change the current selection from that group)
    then fill the selected members with the previous selection
  */
  optionArr.forEach(mem => {
    let name = mem.First + " " + mem.Last;
    let option;
    if (btnClicked && selectedMembersArr.includes(mem.Key))
      option = '<option selected value="' + mem.Key + '">' + name + '</option>';
    else
      option = '<option value="' + mem.Key + '">' + name + '</option>'
    select += option;
  });
  select += "</select>";
  $('#selectPlaceHolder').append(select);

  /*filling the selected/unselcted cols*/
  initMultiSelect();
  if (group === "allGroups")
    $('#selectMemberListHeader').text("בחר חניכים");
  else
    $('#selectMemberListHeader').text("בחר חניכים מקבוצת " + group);
  $('#selectMembersList').modal({
      inverted: true
    }).modal('setting', 'closable', false)
    .modal('show');

}


function getMembersToSelect(group) {
  let optionArr = [];
  if (group !== "allGroups") {
    memberList.forEach(mem => {
      if (mem.Group === group) {
        optionArr.push(mem);
      }
    })
  } else {
    memberList.forEach(mem => {
      optionArr.push(mem);
    })
  }

  optionArr.sort(function (a, b) {
    let aName = a.First + " " + a.Last;
    let bName = b.First + " " + b.Last;
    if (aName < bName)
      return -1;
    if (aName > bName)
      return 1;
    return 0;
  });

  return optionArr;
}

function initMultiSelect(){
  $('#selectFromGroup').multiSelect({
    selectableHeader: "<div class='selectableHeader large-text'>בחר חניכים</div>",
    selectionHeader: "<div class='selectableHeader large-text'>חניכים שנבחרו</div>",
    afterSelect: function (values) {
      values.forEach(val => {
        selectedMembersArr.push(val);
      })
    },
    afterDeselect: function (values) {
      values.forEach(val => {
        let index = selectedMembersArr.indexOf(val);
        if (index > -1) {
          selectedMembersArr.splice(index, 1);
        }
      })

    }
  });
}

/*====adding payment, update db & session, clear form and selected members, update table====*/
function addPayment(e) {
  e.preventDefault();
  //no members selected
  if (selectedMembersArr.length === 0) {
    $("#errorPlaceHolder").addClass("ui error message").text("שגיאה. לא נבחרו חניכים").show();
    return;
  } else {
    $("#errorPlaceHolder").removeClass("ui error mesage").hide();
  }
  let $charge = $("#charge").val()
  const $group = $("#group").val();
  const $amount = $("#amount").val() * $charge; //if charge = "חיוב" -> val is 1. if charge = "זיכוי" -> val = -1
  let $receipt;
  if ($charge == 1) { //dont need receipt
    $receipt = "";
  } else if ($charge == -1) { //set automaticly all receipt to no.
    $receipt = "false";
  }

  let id = uuidv4();
  const paymentObj = {
    Details: $("#details").val(),
    Date: $("#datePicker").val(),
    Amount: $amount,
    Charge: $charge,
    PaymentMethod: "", //DONT NEED THIS FOR GROUP PAYMENT!
    Id: id,
    Receipt: $receipt,
  };
  updateDbAndSession(paymentObj);
    displayInTable.forEach(elem => {
      if (selectedMembersArr.includes(elem.member.Key))
        elem.sum += $amount;
    })

  fill_table(displayInTable);
  clearFormAndSelectedMembers();

  $('.ui.modal').modal('hide');
}

function clearFormAndSelectedMembers() {
  selectedMembersArr = [];
  $("#details").val("");  
  $("#datePicker").attr("value", todayDate());
  $("#charge").val("");
  $("#amount").val("");
  $("#group").val("");
}

function updateDbAndSession(paymentObj) {
  selectedMembersArr.forEach(key => {
    firestore.collection("Members").doc(key).update({
      FinancialMonitoring: firebase.firestore.FieldValue.arrayUnion(paymentObj)
    }).then(()=>{
      memberList.forEach(mem => {
        if (mem.Key === key)
          mem.FinancialMonitoring.push(paymentObj);
          sessionStorage.setItem('memberList', JSON.stringify(memberList));
      })
    });
  })
}

function getFinancialArrray() {
  return JSON.parse(sessionStorage.getItem('memberList')).find(member => member.Key === selectedMemberKey).FinancialMonitoring;
}


function insertToTable(member, sum) {
  const $table = $("#financial_table");
  let html = '<tr class = "table-text" id = ' + member.Key + '>';
  html += '<td>' + member.First + " " + member.Last + '</td>';
  html += '<td>' + member.PhoneNum + '</td>';
  html += '<td>' + member.Group + '</td>';
  if (sum > 0)
    html += '<td class ="vmf-negative" dir="ltr">' + sum + '</td>';
  else
    html += '<td class ="vmf-positive" dir="ltr">' + sum + '</td>';
  html += "</tr>"
  updateSum(sum);
  $table.append(html);

}

/*update overall sum when adding new payment*/
function updateSum(amount) {
  let $sum = $("#summaryAmount");
  let newSum = parseInt($sum.text()) + amount;
  if (newSum > 0)
    $sum.removeClass().addClass("vmf-negative");
  else
    $sum.removeClass().addClass("vmf-positive");

  $sum.text(newSum);
}

function setSum(sum) {
  $("#summaryAmount").text(sum);
}

function clearTableRows() {
  $("tbody tr").remove();
}

/*TODO: populate table with data from the selectedMember financialTracking array*/
function fill_table(displayArray) {
  clearTableRows();
  setSum(0);
  displayArray.sort(function (a, b) {
    if (a.sum < b.sum)
      return 1;
    if (a.sum > b.sum)
      return -1;
    return 0;
  });
  displayArray.forEach(elem => {
    insertToTable(elem.member, elem.sum);
  })
  $('#financial_table td').click(function () {
    const id = ($(this).closest('tr').attr('id'));
    if (id) {
      sessionStorage.setItem('selectedPersonKey', id); // save it temporeriy
      document.location.href = 'viewMemberFinancial.html';
    }

  });
}

function sumAllPayments(financialArray) {
  let sum = 0;
  financialArray.forEach(obj => {
    sum += obj.Amount;
  })
  return sum;
}

function todayDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today
}


/*return a promise - mean, that this function return something that we can do .then() after it*/
function getAllMembers() {
  return new Promise((resolve) => { // resolve <--->is need with promise.
    if (sessionStorage.getItem("memberList") === null || JSON.parse(sessionStorage.getItem('memberList')).length === 0) { // if its the first time 
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
      resolve(memberList);
    }

  })

}

/*return a promise - mean, that this function return something that we can do .then() after it*/
function getGroupsData() {
  return new Promise((resolve) => { // resolve <--->is need with promise.
    let groupsData = []; // save all the member data.

    if (sessionStorage.getItem("groupsData") === null || JSON.parse(sessionStorage.getItem('groupsData')).length === 0) { // if its the first time 
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
      resolve(groupsData);
    }

  })

}

/*dynamicly set groups name at the drop-down select tag of groups (fetch data from the data base)*/
function setGroups(groupsData) {
  let str = '<option disabled value="" selected value>בחר קבוצה</option>';
  if (groupsData) {
    str += '<option value="allGroups">כל הקבוצות</option>';
    for (let i = 0; i < groupsData.length; i++)
      str += '<option value="' + groupsData[i].groupName + '">' + groupsData[i].groupName + '</option>';
    $("#group").append(str);
  } else {
    $("#group").append(str);
  }

}


/**Generating id for each payment */
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}