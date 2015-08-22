var refURL = "https://joshuajharris-todo.firebaseio.com";
var ref = new Firebase(refURL);

function checkTask(el) {
  var taskId = String($(el).parent().attr("id"));
  var task = ref.child(taskId);
  task.child("state").on('value', function(snap) {
    var taskState = snap.val();
    if(taskState === "active") {
      ref.child(taskId).update({state: "closed"});
    } else {
      ref.child(taskId).update({state: "active"});
    }
  });
}

$(document).ready(function() {
  ref.on("value", function(snapshot) {
    $("#active").empty();
    $("#closed").empty();

    todos = snapshot.val();
 
    $.each(todos, function(i, todo){
      if(todo.state === "active") {
        $("#active").append(
          '<div id=\"' + todo.id + '\">' +
            '<input type="checkbox" onchange="checkTask(this)"/>' +
            ' <b>' + todo.task + '</b>' +
          '</div>'
        );
      }
      else if(todo.state === "closed") {
        $("#closed").append(
          '<div id=\"' + todo.id + '\">' +
            '<input type="checkbox" onchange="checkTask(this)"/>' +
            ' <b>' + todo.task + '</b>' +
          '</div>'
        );
      }
    }); 

  });

  $("#task").keypress(function(e) {
    if(e.which === 13) {
      var newTask = ref.push({id:"0" ,state: "active", task: $(e.target).val()});
      ref.child(newTask.key()).update({id: newTask.key()});
      $(e.target).val('');
      return false;
    }
  });

});
