const firestore = firebase.firestore();
const selectedGroupKey = sessionStorage.getItem('selectedGroupKey');
const selectedGroup = JSON
  .parse(sessionStorage.getItem('groupsData'))
  .find(group => group.Key === selectedGroupKey);
console.log(selectedGroup);


$(document).ready(function () {
  $('.ui.accordion').accordion(); //activate acordion effect
  $("#datePicker").attr("value", todayDate());
  // place selectedGroup name at the header
  let name = selectedGroup.groupName;
  $("#namePlaceHoler").text(name);

  $("#modalYes").click(deleteComment);
  $("#modalNo").click(function () {
    $('.mini.modal').modal('hide');
  });


  //setting functionality
  $("#addCommentForm").submit(addComment);
  fill_table();
});

function setRemoveLisetener(id) {
  $("#" + id).click(function (e) {
    $('.mini.modal').modal('show');
    let commentToRemove = getComment(id);
    selectedcommentToRemove = {
      tr: $(this).closest('tr'),
      commentToRemove: commentToRemove,
      id: id
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


function addComment(e) {
  e.preventDefault();
  let id = uuidv4();
  const commentObj = {
    Auther: $("#auther").val(),
    Date: $("#datePicker").val(),
    Comment: handle_comment($("#comment").val()),
    Id: id,
  };
  console.log(getCommentArrray().length);
  if (getCommentArrray().length === 0)
    createTable();

  //updating the table and the db
  updateDataBase(commentObj);
  updateSessionStorage(commentObj);
  insertToTable(commentObj);
  sortTable();


  //clear form
  $("#auther").val("");
  $("#datePicker").attr("value", todayDate());
  $("#comment").val("");
}

function updateDataBase(commentObj) {
  firestore.collection("Groups").doc(selectedGroupKey).update({
    groupTracking: firebase.firestore.FieldValue.arrayUnion(commentObj)
  });
}

function updateSessionStorage(commentObj) {
  list = JSON.parse(sessionStorage.getItem('groupsData'))
  list.find(group => group.Key === selectedGroupKey).groupTracking.push(commentObj);
  sessionStorage.setItem('groupsData', JSON.stringify(list));
}

function getCommentArrray() {
  return JSON.parse(sessionStorage.getItem('groupsData')).find(group => group.Key === selectedGroupKey).groupTracking;
}

/*inserting new comment into table*/
function insertToTable(obj) {
  const $table = $("#comment_table");
  let html = '<tr><td><i class = "trash red icon" id ="' + obj.Id + '"></td>';
  html += '<td>' + obj.Auther + '</td>';
  html += '<td>' + obj.Date.split('-').reverse().join('/') + '</td>';
  html += '<td>' + obj.Comment + '</td>';

  html += "</tr>"
  $table.append(html);
  setRemoveLisetener(obj.Id);
}

function fill_table() {
  commentHistory = getCommentArrray();;
  if (commentHistory.length != 0)
    createTable();
  commentHistory.forEach(element => {
    insertToTable(element);

  });
  if (commentHistory.length != 0)
    sortTable();
}

function createTable() {
  let tableStr = `<table class="ui compact striped table" id="comment_table">
   <colgroup> <col width="5%">  <col width="15%">  <col width="20%">  <col width="60%"></colgroup>
  <thead>
  <tr height="50">  <th></th>  <th>שם הכותב</th>  <th>תאריך</th>  <th>פרטים</th>
  </tr></thead><tbody></tbody></table>`;
  $("#tablePlaceHolder").append(tableStr);
  console.log("crate table");

}



function getCommentArrray() {
  return JSON.parse(sessionStorage.getItem('groupsData')).find(group => group.Key === selectedGroupKey).groupTracking;
}
function todayDate() {
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

function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("comment_table");
  console.log("jfgjfjfj");
  if (table === null)
    return;
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("td")[2];

      y = rows[i + 1].getElementsByTagName("td")[2];
      //check if the two rows should switch place:

      if ((x.innerHTML).split("").reverse().join("") > y.innerHTML.split("").reverse().join("")) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}


function deleteComment() {
  removeFromDataBase(selectedcommentToRemove.commentToRemove);
  removeFromSession(selectedcommentToRemove.id);
  selectedcommentToRemove.tr.remove();
  let len = getCommentArrray().length;
  if (len == 0) {
    //if the FinancialTracking array is empty remove table
    $("#comment_table").remove();
  }
  $('.mini.modal').modal('hide')
}


function removeFromDataBase(commentObj) {
  firestore.collection("Groups").doc(selectedGroupKey).update({
    groupTracking: firebase.firestore.FieldValue.arrayRemove(commentObj)
  });
}

function removeFromSession(id) {
  let groupsData = JSON.parse(sessionStorage.getItem('groupsData'));
  let index = groupsData.findIndex(i => i.Key === selectedGroupKey);
  groupsData[index].groupTracking = groupsData[index].groupTracking.filter(pay => pay.Id !== id);
  sessionStorage.setItem('groupsData', JSON.stringify(groupsData));
}



function getComment(id) {
  return getCommentArrray().find(obj => {
    return obj.Id === id;
  })
}