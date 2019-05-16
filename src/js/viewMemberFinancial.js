const firestore = firebase.firestore();
const selectedMemberKey = sessionStorage.getItem('selectedPersonKey');
const selectedMember = JSON.parse(sessionStorage.getItem('memberList')).find(member => member.Key === selectedMemberKey );

$(document).ready(function () {
//   $('#datePicker').val(new Date().toDateInputValue());

  let name = selectedMember.First +" " +selectedMember.Last;
  $("#namePlaceHoler").text(name);

  console.log(selectedMember);
  //fill_table();

});


function fill_table(){
  financial_data = selectedMember.FinancialMonitoring;
  console.log(financial_data);
  $table = $("#financial_table");
}

