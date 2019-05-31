const firestore = firebase.firestore();
let memberList = [];
let displayInTable = [];

$(document).ready(function () {
  getAllMembers().then(memberList => { // only when getallmembers return the memberlist continue:
    $('#loader').removeClass('active'); // remove the loader .
    $("#datePicker").attr("value", todayDate());
    getGroupsData().then(groupsData => {
      setGroups(groupsData);
    })

    //setting functionality
    $("#addPaymentForm").submit(addPayment);
    $("#charge").change(updatePaymentMethodDropDown);
    displayAll();
  })

  $('#addGroupPayment')
  .popup({
    inline: true
  })
;

  $("#displayAllBtn").click(displayAll);
  $("#displayOnlyRedBtn").click(displayOnlyRed);
  $("#displayOnlyGreenBtn").click(displayOnlyGreen);
  $("#addGroupPayment").click(addGroupPayment);


});

function addGroupPayment() {
  $('.ui.modal')
    .modal({
      inverted: true
    })
    .modal('show');
}

function displayOnlyGreen() {
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

function displayOnlyRed() {
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

function displayAll() {
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


function addPayment(e) {
  e.preventDefault();
  let $charge = $("#charge").val()
  const $group = $("#group").val();
  const $amount = $("#amount").val() * $charge ; //if charge = "חיוב" -> val is 1. if charge = "זיכוי" -> val = -1
  let $receipt;
  if($charge == 1) { //dont need receipt
    $receipt = "";
  }
  else if($charge == -1){ //set automaticly all receipt to no.
    $receipt = "false";
  }

  let id = uuidv4();
  const paymentObj = {
    Details: $("#details").val(),
    Date: $("#datePicker").val(),
    Amount: $amount,
    Charge: $("#charge").val(),
    PaymentMethod: "", //DONT NEED THIS FOR GROUP PAYMENT!
    Id: id,
    Receipt: $receipt,
  };

  updateDbAndSession(paymentObj, $group);

  displayInTable.forEach(elem => {
    if (elem.member.Group === $group)
      elem.sum += $amount;
  })

  fill_table(displayInTable);

  $("#details").val("");
  $("#datePicker").attr("value", todayDate());
  $("#charge").val("");
  $("#amount").val("");
  $("#paymentMethod").val("");
  $("#group").val("");
  $("#receipt").val("");

  $('.ui.modal').modal('hide');
}

function updateDbAndSession(paymentObj, group) {
  memberList.forEach(member => {
    if (member.Group === group) {
      firestore.collection("Members").doc(member.Key).update({
        FinancialMonitoring: firebase.firestore.FieldValue.arrayUnion(paymentObj)
      })
      member.FinancialMonitoring.push(paymentObj);
    }
  })
  sessionStorage.setItem('memberList', JSON.stringify(memberList));
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
    html += '<td class ="vmf-negative">' + sum + '</td>';
  else
    html += '<td class ="vmf-positive">' + sum + '</td>';
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

/*When charge value is '-1' (זיכוי) then show paymentMenthod drop down, o.w hide it*/
function updatePaymentMethodDropDown() {
  let elm = $("#charge");
  if (elm.val() === "-1") {
    $("#formThirdRow").removeClass().addClass("two fields");
    $("#paymentMethod").prop('required', true)
    $("#payMethodDiv").show();
  } else {
    // $("#formThirdRow").removeClass().addClass("field");
    $("#paymentMethod").prop('required', false)
    $("#payMethodDiv").hide();
  }
}


function todayDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today
}


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
    for (let i = 0; i < groupsData.length; i++)
      str += '<option value="' + groupsData[i].groupName + '">' + groupsData[i].groupName + '</option>'
    $("#group").append(str);
  } else {
    $("#group").append(str);
  }

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

/**Generating id for each payment */
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}