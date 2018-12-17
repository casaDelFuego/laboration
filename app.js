
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
      } else {
        console.log("error, reason: " + reply.message);
        $(".msgForUser").html("Your book has not been added, the reason is " + reply.message)
        errorCount++;
        //$("#badApi").html("Bad API!" + errorCount);
      }


    })
  })

  $("#viewBooks").click(() => {
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
            '<tr class="bookFromList">' +
            `<td> ${book.id} </td>` +
            `<td> ${book.author} </td>` +
            `<td> ${book.title} </td>` +
            `<td> ${book.updated} </td>` +
            '</tr>'
          );
          $("#bookList").append(elem);
          $(".tableOfBooks").show(); //show the head of table which is hidden before click

        })
        //in case of error
      } else {
        $("#bookListError").html("Something went wrong, probably because of " + reply.message + ". Please, try again");
        $("#bookListError").show(); // show the user the error msg
        errorCount++;
      }
    })
  })


  $("#changeBook").click(() => {
    console.log("change book button was clicked");
    //save user's input into variables
    let author = $(".changeAuthor").val();
    let title = $(".changeTitle").val();
    let idOfBook = $(".changeId").val();
    //send api request after the button was clicked
    $.ajax(`https://www.forverkliga.se/JavaScript/api/crud.php?op=update&key=${key}&id=${idOfBook}&author=${author}&title=${title}`)
    .done((data)=> {
      let response = JSON.parse(data);

      if (response.status==="success") {
        console.log("the book has been successfully changed");
        $(".msgAboutChange").html("Your book has been changed");
        $('input[type="text"]').val('');
      } else {
        console.log("error");
        $(".msgAboutChange").html("Your book has not been changed, try again ");
        errorCount++;
      }
    })
  }) //end of change book click

  $("#deleteBook").click(() => {
    console.log("delete button was clicked");
    let delBookId = $(".deleteBookId").val();

    //send request to delete book by id
    $.ajax(`https://www.forverkliga.se/JavaScript/api/crud.php?op=delete&key=${key}&id=${delBookId}`)
    .done((data)=> {
      let resp = JSON.parse(data);

      if (resp.status==="success") {
        console.log("the book has been successfully deleted");
        $(".msgAboutRemoval").html("Your book has been deleted");
        $('input').val('');
      } else {
        console.log("error");
        $(".msgAboutRemoval").html("Your book has not been deleted, try again");
        errorCount++;
      }
    })
  })//end of delete option
}) // end of ready

// $('input[type="text"]').val('');
