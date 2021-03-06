// registers all code within curly braces to be executed after the page loads
$(function() {


  // taskHtml takes in a JS representation of the task, that came from the 
  // JSON response, and produces an HTML representation using <li> tags
  function taskHtml(task) {
    var checkedStatus = task.done ? 'checked' : '';
    var liClass = task.done ? 'completed' : '';
    var liElement = '<li id="listItem-' + task.id + '" class="' + liClass + '"><div class="view"><input class="toggle" type="checkbox" data-id="' + task.id + '"' + checkedStatus + '><label>' + task.title + '</label></div></li>';
    return liElement;
  }


  // toggleTask takes in an HTML representation of the event that fires 
  // from the checkbox toggle action & performs a PUT API request to update
  // the value of the 'done' field in the DB
  function toggleTask(e) {
    var itemId = $(e.target).data("id");
    var doneValue = Boolean($(e.target).is(':checked'));
    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        done: doneValue
      }
    }).success( function( data ) {
      var liHtml = taskHtml(data);
      var $li = $("#listItem-" + data.id);
      $li.replaceWith(liHtml);
      $('.toggle').change(toggleTask);
    });
  }

  // we call the method .success on the OBJECT that the $.get value returns, 
  // which allows us to set a callback function to run when a successful 
  // response happens
  // we set 'data' to equal the JSON response
  $.get('/tasks').success( function( data ) {
    // builds an empty var to store the ENTIRE block of li code
    var htmlString = '';
    
    $.each(data, function(index, task) {
      // grabs a JS representation of a task, passes it to taskHTML, 
      // & pops the returned liElement into htmlString
      htmlString += taskHtml(task);
    });

    // grabs the ul element with class of .todo-list
    var ulTodos = $('.todo-list');

    // inserts htmlString code INTO the ul block
    ulTodos.html(htmlString);

    // listen for & handle the checkbox functionality
    $('.toggle').change(toggleTask);

  });


  // handles new task data submission to the DB
  $('#new-form').submit( function( event ) {
    // prevents the default page refresh on form submit
    event.preventDefault();
    var textbox = $('.new-todo');
    // the "payload"
    var payload = {
      task: {
        title: textbox.val()
      }
    };
    $.post("/tasks", payload).success( function( data ) {
      var htmlString = taskHtml(data);
      var ulTodos = $('.todo-list');
      ulTodos.append(htmlString);
      $('.toggle').click(toggleTask);
      $('.new-todo').val('');
    });
  });
});