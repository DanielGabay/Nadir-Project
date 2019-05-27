const firestore = firebase.firestore();
let memberList =[];

$(document).ready(function () {


  getAllMembers().then(memberList => { // only when getallmembers return the memberlist continue:
    $('#loader').removeClass('active'); // remove the loader .

    $('.ui.accordion').accordion(); //activate acordion effect
    $("#datePicker").attr("value", todayDate());
    getGroupsData().then(groupsData => {
      setGroups(groupsData);
    })
  
    //setting functionality
    $("#addPaymentForm").submit(addPayment);
    $("#charge").change(updatePaymentMethodDropDown);
    fill_table(); 

})

});



function addPayment(e) {
  e.preventDefault();
  const $group = $("#group").val();
  console.log($group);
  const $amount = $("#amount").val() * $("#charge").val(); //if charge = "חיוב" -> val is 1. if charge = "זיכוי" -> val = -1
  let $payMethod;
  /*if charge value is "1" (חיוב) -> paymentMethod is not needed then set its value to empty string*/
  if ($("#charge").val() == 1) {
    $payMethod = "";
  } else {
    $payMethod = $("#paymentMethod").val();
  }

  const paymentObj = {
    Details: $("#details").val(),
    Date: $("#datePicker").val(),
    Amount: $amount,
    Charge: $("#charge").val(),
    PaymentMethod: $payMethod
  };

  updateDbAndSession(paymentObj, $group);
  fill_table();
  $("#details").val("");
  $("#datePicker").attr("value", todayDate());
  $("#charge").val("");
  $("#amount").val("");
  $("#paymentMethod").val("");
  $("#group").val("");

}

function updateDbAndSession(paymentObj, group) {
  memberList.forEach(member => {
    if (member.Group === group) {
      firestore.collection("Members").doc(member.Key).update({
        FinancialMonitoring: firebase.firestore.FieldValue.arrayUnion(paymentObj)
      });
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
function fill_table() {
  clearTableRows();
  setSum(0);
  memberList.forEach(member => {
    let sum = sumAllPayments(member.FinancialMonitoring);
    if (sum > 0)
      insertToTable(member,sum);
  })
  $('#financial_table td').click(function () {
    const id = ($(this).closest('tr').attr('id'));
    console.log(id); // add click even to every row!!!
    if (id) {
      sessionStorage.setItem('selectedPersonKey', id); // save it temporeriy
      document.location.href = 'viewMemberFinancial.html'; //TODO   show the view member. we need to change this command to new window
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

/*dynamicly set groups name at the drop-down select tag of groups (fetch data from the data base)*/
function setGroups(groupsData) {
  let str = '<option disabled value="" selected value>בחר קבוצה</option>';
  if (groupsData) {
    for (let i = 0; i < groupsData.length; i++)
      str += '<option value="' + groupsData[i].groupName + '">' + groupsData[i].groupName + '</option>'
    $("#group").append(str);
  } else {
    console.log("there is no groups yet. so appent nothing")
    $("#group").append(str);
  }

}


/*return a promise - mean, that this function return something that we can do .then() after it*/
function getAllMembers() {
  return new Promise((resolve) => { // resolve <--->is need with promise.
    
      if (sessionStorage.getItem("memberList") === null || JSON.parse(sessionStorage.getItem('memberList')).length === 0) { // if its the first time 
          console.log("memberList is from FireBase")
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
          console.log("memberlist is from session")
          resolve(memberList);
      }

  })

}
