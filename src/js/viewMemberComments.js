const firestore = firebase.firestore();
const selectedMemberKey = sessionStorage.getItem('selectedPersonKey');
const selectedMember = JSON
  .parse(sessionStorage.getItem('memberList'))
  .find(member => member.Key === selectedMemberKey);
  console.log(selectedMember);


$(document).ready(function () {
  $('.ui.accordion').accordion(); //activate acordion effect
  $("#datePicker").attr("value", todayDate());
  // place selectedMember name at the header
  let name = selectedMember.First + " " + selectedMember.Last;
  $("#namePlaceHoler").text(name);

  //setting functionality
  $("#addCommentForm").submit(addComment);
  fill_table();
});

function setRemoveLisetener(){
  $('.rmvBtn').click(function(e){
    $(this).closest('tr').remove();
    console.log(this.closest('tr'));
 })
}

function addComment(e) {
  e.preventDefault();
  const commentObj = {
    Auther: $("#auther").val(),
    Date: $("#datePicker").val(),
    Comment: handle_comment($("#comment").val()),
  };

  updateDataBase(commentObj);
  updateSessionStorage(commentObj);
  insertToTable(commentObj);
  $("#auther").val("");
  $("#datePicker").attr("value", todayDate());
  $("#comment").val("");
}

function updateDataBase(commentObj) {
  firestore.collection("Members").doc(selectedMemberKey).update({
    PersonalTracking: firebase.firestore.FieldValue.arrayUnion(commentObj)
  });
}

function updateSessionStorage(commentObj) {
  list = JSON.parse(sessionStorage.getItem('memberList'))
  list.find(member => member.Key === selectedMemberKey).PersonalTracking.push(commentObj);
  sessionStorage.setItem('memberList', JSON.stringify(list));
}

function getFinancialArrray() {
  return JSON.parse(sessionStorage.getItem('memberList')).find(member => member.Key === selectedMemberKey).FinancialMonitoring;
}

/*inserting new comment into table*/
function insertToTable(obj) {
  const $table = $("#comment_table");
  let html = '<tr><td><button class ="rmvBtn"></td>';
  html += '<td>' + obj.Auther + '</td>';
  html += '<td>' + obj.Date.split('-').reverse().join('/') + '</td>';
  html += '<td>' + obj.Comment + '</td>';

  html += "</tr>"
  $table.append(html);
  setRemoveLisetener();
}

function fill_table() {
  commentHistory = selectedMember.PersonalTracking;
  $table = $("#comment_table");
  commentHistory.forEach(element => {
    insertToTable(element);

  });
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

function handle_comment(comment) {
  comment = comment.trim()
  comment = comment.replace(/(?:\r\n|\r|\n)/g, '<br>')
  return comment
}