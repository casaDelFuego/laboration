
let errorCount = 0;
$(document).ready(() => {
  let key = null;
  $("#getTheKey").click(() => {
    console.log("button was clicked");
    $.ajax("https://www.forverkliga.se/JavaScript/api/crud.php?requestKey")
    .done((data)=>{
      let res = JSON.parse(data);
      console.log(res.key);
      //stor the key into a variable
      key = res.key;
      $("#theKey").html("Received: " + "<strong>" + res.key + "</strong>");

    })
  })

  $("#addBook").click(() => {
    console.log("add was clicked");
    //save author and title into variables
    let author = $(".author").val();
    let title = $(".title").val();
    //create the link and send the request to backend
    $.ajax(`https://www.forverkliga.se/JavaScript/api/crud.php?op=insert&key=${key}&author=${author}&title=${title}`)
    .done((data)=> {
      let reply = JSON.parse(data);

      if (reply.status==="success") {
        console.log("the book has been successfully added, book's id is " + reply.id);
        $(".msgForUser").html("Your book has been added, book's ID is " + "<strong>" + reply.id + "</strong>");
        $('input[type="text"]').val(''); //to clean the input after button was clicked
        fetchBooks();
      } else {
        console.log("error, reason: " + reply.message);
        $(".msgForUser").html("Your book has not been added, the reason is " + reply.message)
        reportError(reply.message);
      }


    })
  })

  $("#viewBooks").click(fetchBooks);
  function fetchBooks() {
    //hide the error msg from previous click
    $("#bookListError").hide();
    console.log("show books button was clicked");
    $.ajax(`https://www.forverkliga.se/JavaScript/api/crud.php?op=select&key=${key}`)
    .done((res) => {
      let reply = JSON.parse(res);

      if (reply.status === "success") {
        let bookList = reply.data;
        //clean the list of books to prevent repetitions
        $("#bookList").empty();
        //loop through the response of books
        bookList.forEach(book =>{
          //create new book element
          let elem = $(
            `<tr class="bookFromList" id="book-${book.id}">` +
            `<td> ${book.id} </td>` +
            `<td class="author"> ${book.author} </td>` +
            `<td class="title"> ${book.title} </td>` +
            `<td> ${book.updated} </td>` +
            `<td><button class="edit">Edit</button></td>` +
            `<td><button class="delete">Delete</button></td>` +
            '</tr>'
          );
          elem.find(".delete").click(()=>{
            deleteBook(book.id)
          })

          elem.find(".edit").click(()=>{
            makeBookEditable(book.id)
          })
          $("#bookList").append(elem);
          $(".tableOfBooks").show(); //show the head of table which is hidden before click

        })
        //in case of error
      } else {
        $("#bookListError").html("Something went wrong, probably because of " + reply.message + ". Please, try again");
        $("#bookListError").show(); // show the user the error msg
        reportError(reply.message);
      }
    })
  }

  function makeBookEditable(id) {
    let row = $(`#book-${id}`); //find the book which needs to be changed
    //find the cells inside the row
    let authorElem = row.find('td.author');
    let titleElem = row.find('td.title');
    //store current values into variables
    let orgAuthour = authorElem.text();
    let orgTitle = titleElem.text();
    //manipulate dom in order to create inputs for changing
    authorElem.html(`<input value="${orgAuthour}" type="text">`);
    titleElem.html(`<input value="${orgTitle}" type="text">`);
    //changing the button from edit to save, by hiding and adding new one
    let saveButton = $('<button class="save">Save</button>')
    let button = row.find(".edit");
    //hide
    button.hide();
    button.after(saveButton);
    saveButton.click(()=> {
      //call the function that stores new values from user input
      saveChanges(id, authorElem.find("input").val(), titleElem.find("input").val());
    })

  }

  function saveChanges(id, author, title) {
    console.log("change book button was clicked");
    //save user's input into variables
    //let author = $(".changeAuthor").val();
    //let title = $(".changeTitle").val();
    //let idOfBook = $(".changeId").val();
    //send api request after the button was clicked
    $.ajax(`https://www.forverkliga.se/JavaScript/api/crud.php?op=update&key=${key}&id=${id}&author=${author}&title=${title}`)
    .done((data)=> {
      let response = JSON.parse(data);

      if (response.status==="success") {
        console.log("the book has been successfully changed");
        $(".msgAboutChange").html("Your book has been changed");
        $('input[type="text"]').val('');
        fetchBooks();
      } else {
        console.log("error");
        $(".msgAboutChange").html("Your book has not been changed, try again ");
        reportError(response.message);
      }
    })
  } //end of change book click

  function deleteBook (id) {

    console.log("delete button was clicked");

    //send request to delete book by id
    $.ajax(`https://www.forverkliga.se/JavaScript/api/crud.php?op=delete&key=${key}&id=${id}`)
    .done((data)=> {
      let resp = JSON.parse(data);

      if (resp.status==="success") {
        console.log("the book has been successfully deleted");
        $(".msgAboutRemoval").html("Your book has been deleted");
        $('input').val('');
        fetchBooks();
      } else {
        console.log("error");
        $(".msgAboutRemoval").html("Your book has not been deleted, try again");
        reportError(resp.message);
      }
    })
  }//end of delete option

  function reportError (error) {
    errorCount++;
    $("#numOfErrors").html(errorCount);
    $("#errorLog").append(`<li>${error}</li>`);
  }
}) // end of ready

// $('input[type="text"]').val('');
