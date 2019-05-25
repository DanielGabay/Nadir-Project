const firestore = firebase.firestore();
const selectedMemberKey = sessionStorage.getItem('selectedPersonKey');
const selectedMember = JSON
  .parse(sessionStorage.getItem('memberList'))
  .find(member => member.Key === selectedMemberKey);
  console.log(selectedMember);


$(document).ready(function () {
  //TODO : set date to current date
  //$('#datePicker').val(new Date().toDateInputValue());
  $('.ui.accordion').accordion(); //activate acordion effect
  $("#datePicker").attr("value", todayDate());
  // place selectedMember name at the header
  let name = selectedMember.First + " " + selectedMember.Last;
  $("#namePlaceHoler").text(name);

  //setting functionality
  $("#addPaymentForm").submit(addPayment);
  $("#charge").change(updatePaymentMethodDropDown);
  fill_table();
});

function setRemoveLisetener(){
  $('.rmvBtn').click(function(e){
    $(this).closest('tr').remove();
    console.log(this.closest('tr'));
 })
}

function addPayment(e) {
  e.preventDefault();
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

  updateDataBase(paymentObj);
  updateSessionStorage(paymentObj);
  insertToTable(paymentObj);
  $("#details").val("");
 // $("#datePicker").val("");
  $("#datePicker").attr("value", todayDate());
  $("#charge").val("");
  $("#amount").val("");
  $("#paymentMethod").val("");

}

function updateDataBase(paymentObj) {
  firestore.collection("Members").doc(selectedMemberKey).update({
    FinancialMonitoring: firebase.firestore.FieldValue.arrayUnion(paymentObj)
  });
}

function updateSessionStorage(paymentObj) {
  list = JSON.parse(sessionStorage.getItem('memberList'))
  list.find(member => member.Key === selectedMemberKey).FinancialMonitoring.push(paymentObj);
  sessionStorage.setItem('memberList', JSON.stringify(list));
}

function getFinancialArrray() {
  return JSON.parse(sessionStorage.getItem('memberList')).find(member => member.Key === selectedMemberKey).FinancialMonitoring;
}

/*inserting new payment into table
TODO: update financialTracing of selected member in data base & in session storage.
*/
function insertToTable(obj) {
  const $table = $("#financial_table");
  let html = '<tr><td><button class ="rmvBtn"></td>';
  html += '<td>' + obj.Details + '</td>';
  html += '<td>' + obj.Date + '</td>';

  html += '<td>' + obj.PaymentMethod + '</td>';
  if (obj.Amount > 0) {
    html += '<td class = "vmf-negative">' + obj.Amount + '</td><td></td>';
  } else {
    html += '<td></td><td class = "vmf-positive" dir="ltr">' + obj.Amount + '</td>';
  }
  html += "</tr>"
  updateSum(obj.Amount);
  $table.append(html);
  setRemoveLisetener();
}

/*update overall sum when adding new payment*/
function updateSum(amount) {
  let $sum = $("#summaryAmount")
  let newSum = parseInt($sum.text()) + amount;
  if (newSum > 0)
    $sum.removeClass().addClass("vmf-negative");
  else
    $sum.removeClass().addClass("vmf-positive");

  $sum.text(newSum);
}

/*TODO: populate table with data from the selectedMember financialTracking array*/
function fill_table() {
  financial_data = selectedMember.FinancialMonitoring;
  financial_data.forEach(element => {
    insertToTable(element);

  });
}

/*When charge value is '-1' (זיכוי) then show paymentMenthod drop down, o.w hide it*/
function updatePaymentMethodDropDown() {
  let elm = $("#charge");
  if (elm.val() === "-1") {
    $("#formSecondRow").removeClass().addClass("three fields");
    $("#paymentMethod").prop('required', true)
    $("#payMethodDiv").show();
  } else {
    $("#formSecondRow").removeClass().addClass("two fields");
    $("#paymentMethod").prop('required', false)
    $("#payMethodDiv").hide();
  }
}


function todayDate()
{
  var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;
return today
}