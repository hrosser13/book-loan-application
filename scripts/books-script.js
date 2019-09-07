// Wait for the DOM to load
$(function() {

  // Hide the book details + forms section
  document.getElementById("loanInPlace").style.display = "none";


  // TYPE SEARCH FUNCTIONS

  // TYPE SEARCH FUNCTION --- TITLE
  $('#searchTitle').on('keyup', searchTitle);

  // Function to search table cells
  // This code was taken from W3schools
  // accessed 05-02-2019
  // https://www.w3schools.com/howto/howto_js_filter_lists.asp
  function searchTitle() {
    let input, filter, table, tr, td, i;
    input = document.getElementById("searchTitle");
    filter = input.value.toUpperCase();
    table = document.getElementById('booksTable');
    tr = table.getElementsByTagName("tr");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[1];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        };
      };
    };
  };


  // TYPE SEARCH FUNCTION --- ISBN
  $('#searchISBN').on('keyup', searchISBN);

  function searchISBN() {
    let input, filter, table, tr, td, i;
    input = document.getElementById("searchISBN");
    filter = input.value.toUpperCase();
    table = document.getElementById('booksTable');
    tr = table.getElementsByTagName("tr");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[2];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        };
      };
    };
  };


  // TYPE SEARCH FUNCTION --- AUTHOR
  $('#searchAuth').on('keyup', searchAuthor);

  function searchAuthor() {
    let input, filter, table, tr, td, i;
    input = document.getElementById("searchAuth");
    filter = input.value.toUpperCase();
    table = document.getElementById('booksTable');
    tr = table.getElementsByTagName("tr");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[4];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        };
      };
    };
  };
  // end of referenced code. 



  // GET BOOKS + CREATE TABLE
  function createBookTable() {
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:3000/books?allEntities=true",
      contentType: "application/json",
      data: {get_param: 'value'},
      dataType: "json",
      success: function (data) {
        var names = data
        $.each(data, function(index, element) {

          // create a table from the data
          var row = $("<tr />");
          $("<td />").text(element.id).appendTo(row);
          $("<td />").text(element.title).appendTo(row);
          $("<td />").text(element.isbn).appendTo(row);
          // Create a radio column
          $("<td />").html('<input type="radio" name="book" class="updateUser"/>').appendTo(row);

          // if book has Author(s), append to table
          if (element["Authors"][0] != null) {
            $.each(element["Authors"], function(i,j) {
              $("<td />").html(element["Authors"][i].name + "<br>").appendTo(row);
            })  
          } else {
            $("<td />").html("").appendTo(row);
          };

          // Code to perform table merge
          // taken from Stack Overflow post by user1106925 18-02-2012
          // accessed 20-01-2019
          // https://stackoverflow.com/questions/9343171/merge-multiple-td-into-1-with-jquery
          $('table tr > :nth-child(5)').append(function() {
            return $(this).next().remove().contents();
          });
          // end of referenced code.

          row.appendTo("#booksTable");

      })}});
  };

  // call the function
  createBookTable();



  // GET BOOK DETAILS + APPEND TO DIV

  document.getElementById("container-updateBook").style.visibility = "hidden";
  function getBookDetails() {

    var loanPara = document.getElementById('pAuthors');
    // clear data to prevent duplicates
    loanPara.innerHTML = "";

    // Code to get the data from a specified column in the table
    // taken from Stack Overflow post by Robin Mackenzie 03-01-2017
    // accessed 08-01-2018
    // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
    var selector = '#booksTable tr input:checked';
    $.each($(selector), function(idx, val) {
      //undeclared - global variable to access outside of function
      id = $(this).parent().siblings(":first").text();
    });
    // end of referenced code.

    const userIDurl = "http://127.0.0.1:3000/books/" + id + "/?allEntities=true";
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', userIDurl);

    xhttp.addEventListener('load', function() {
      var books = JSON.parse(this.response);

      title = books.title;
      id = books.id;
      isbn = books.isbn;
          
      year = books.year;
      publisher = books.publisher;

      // Append details to Div
      let pBook = document.getElementById("pBook");
      pBook.innerHTML = "<b>Title: </b>" +title+ "<br><b>ISBN: </b>" +isbn+ "<br><b>Published: </b>" +year+ " by " + "<i>"+publisher+"</i><br><b>Authors: </b>";
      document.getElementById("bookResult").appendChild(pBook);

      let pAuthors = document.getElementsByTagName("pAuthors");

      // check to see if book has an author
      if (books["Authors"][0] != null) {
        authors = books["Authors"][0].name;
        $.each(books["Authors"], function(i,j) {

          // clear paragraph to avoid duplicates
          $('#pAuthors').innerHTML = "";
          let list = $("<ul />");
          let output = books["Authors"][i].name;
          // append Authors to list 
          $("<li />").html(output).appendTo(list);
          // append Authors to paragraph
          list.appendTo('#pAuthors');
          $('#pAuthors').appendTo('#bookResult');
      }); 

      } else {
        console.log('No authors');
      };

      // display the div
      document.getElementById("container-updateBook").style.visibility = "visible";

      // call function to get loan details of book
      ifLoan();


    });

  xhttp.send();
        
  };


  // Clear data in 'pUser' to avoid multiple items being appended
  let userDetails = document.getElementById('pUser');
  userDetails.innerHTML = "";



  // GET loan details of selected book
  function ifLoan() {

    // Code to get the data from a specified column in the table
    // taken from Stack Overflow post by Robin Mackenzie 03-01-2017
    // accessed 08-01-2018
    // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
    var selector = '#booksTable tr input:checked';
    $.each($(selector), function(idx, val) {
      //undeclared - global variable
      id = $(this).parent().siblings(":first").text();
    // end of referenced code.

      const userIDurl = "http://127.0.0.1:3000/books/" + id + "/loans";
      var xhttp = new XMLHttpRequest();
      xhttp.open('GET', userIDurl);

      xhttp.addEventListener('load', function() {
        var loans = JSON.parse(this.response);

        hasLoan = loans["Loan"];


        let pLoan = document.getElementById("pLoan");
        let span = document.getElementById("loanStatus");
        let pDD = document.getElementById("pDD");
          

        // Check if the book is on loan
        if (hasLoan != null) {
            
          span.innerHTML = "On Loan";
          span.style.color = "red";
          pLoan.appendChild(span);
          document.getElementById("bookResult").appendChild(pLoan);
          userLoanID = loans["Loan"]["UserId"];

          DD = loans["Loan"]["dueDate"];
          pDD.innerHTML = "Until: "+DD;
          document.getElementById("bookResult").appendChild(pDD);

          // Disable the 'Loan Book to User' form 
          $("#updateHidden :input").prop('readonly', true);
          document.getElementById("createLoan").disabled = true;
          document.getElementById("loanInPlace").style.display = "block";

          // call function to get user currently borrowing the book
          bookLoanUser();

            
          } else {

            span.innerHTML = "Available";
            span.style.color = "green";
            pLoan.appendChild(span);
            document.getElementById("bookResult").appendChild(pLoan);
            userDetails.innerHTML = "";
            pDD.innerHTML = "";

            // Enable the 'Loan Book to User' form
            $("#updateHidden :input").prop('readonly', false);
            document.getElementById("createLoan").disabled = false;
            document.getElementById("loanInPlace").style.display = "none";
          };


      });

    xhttp.send();


    });
};


// Get the details of the user currently borrowing the book

  function bookLoanUser() {

    // Code to get the data from a specified column in the table
    // taken from Stack Overflow post by Robin Mackenzie 03-01-2017
    // accessed 08-01-2018
    // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
    var selector = '#booksTable tr input:checked';
      $.each($(selector), function(idx, val) {
        //undeclared - global variable
        id = $(this).parent().siblings(":first").text();
    // end of referenced code. 


        const userLoanURL = "http://127.0.0.1:3000/books/"+id+"/loans/users/"+userLoanID;
        let xhttp2 = new XMLHttpRequest();
        xhttp2.open("GET", userLoanURL);

        xhttp2.addEventListener('load', function() {
          let user = JSON.parse(this.response);

          userName = user.name;

          // append the details to paragraph/div
          let userDetails = document.getElementById('pUser');
          userDetails.innerHTML = "<i>Currently being loaned to: <br>"+userName+" (ID: "+userLoanID+")</i>";
          document.getElementById('bookResult').appendChild(userDetails);
        });

        xhttp2.send(); 

      });
        
  };


  // REGEX

  // title validation
  let titleRegex = /^.{1,100}$/
  // isbn validation
  let isbnRegex = /^(\d){7,12}$/;
  // author validation
  let idRegex = /^(\d){1,5}$/;
  // publication year validation
  let yearRegex = /^(\d){4}$/;
  // publisher validation
  let publisherRegex = /^.{4,50}$/
  // due date validation
  let dueDateRegex = /^(\d){4}-(\d){2}-(\d){2}$/



  // On button click - trigger the function to get Book Details
  $('#bookUpdateClick').on('click', getBookDetails);
  $('#bookLoanClick').on('click', getBookDetails);
  $('#bookAuthorClick').on('click', getBookDetails);

  // On click - trigger functions to get each form
  $('#bookUpdateClick').on('click', getUpdateForm);
  $('#bookLoanClick').on('click', getLoanForm);
  $('#bookAuthorClick').on('click', getAuthorForm);


  // Function to show Update Form
  function getUpdateForm() {
    document.getElementById("updateBookForm").style.display = "block";
    document.getElementById("updateForm").style.display = "none";
    document.getElementById("addAuthorForm").style.display = "none";
  };

  // Function to show Loan Form
  function getLoanForm() {
    document.getElementById("updateBookForm").style.display = "none";
    document.getElementById("updateForm").style.display = "block";
    document.getElementById("addAuthorForm").style.display = "none";
  };

  // Function to show Author Form
  function getAuthorForm() {
    document.getElementById("updateBookForm").style.display = "none";
    document.getElementById("updateForm").style.display = "none";
    document.getElementById("addAuthorForm").style.display = "block";
  };


// Update Book form - SUBMIT

  function updateBookSubmit() {
    let updateTitle = document.getElementById("updateTitle").value;
    let updateISBN = document.getElementById("updateISBN").value;
    let updateYear = document.getElementById("updateYear").value;
    let updatePublisher = document.getElementById("updatePublisher").value;

    // Regex validation

    let valTitle = titleRegex.test(updateTitle);
    let valISBN = isbnRegex.test(updateISBN);
    let valYear = yearRegex.test(updateYear);
    let valPublisher = publisherRegex.test(updatePublisher);

    // check if data input is valid
    if (valTitle == false) {
      alert('Please enter a valid Title');
    } else if (valISBN == false) {
      alert('Please enter a valid ISBN');
    } else if (valYear == false) {
      alert('Please enter a valie Year');
    } else if (valPublisher == false) {
      alert('Please enter a valid Publisher');
    } else {

      // Update Request
      $.ajax({
        type: "PUT",
        url: "http://127.0.0.1:3000/books/" + id,
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({
          title: updateTitle,
          isbn: updateISBN,
          year: updateYear,
          publisher: updatePublisher,
        }),
          success: function() {
            alert('Book "' + title + '"" has been updated!');
          }
      });
      // clear input values on submit
      $('#updateTitle').val('');
      $('#updateISBN').val('');
      $('#updateYear').val('');
      $('#updatePublisher').val('');
    };
  };

  // Call the function to submit update request
  $('#updateBookBtn').on('click', updateBookSubmit);





  // LOAN BOOK TO USER -- Submit Form
  function loanBook() {

    // Code to get the data from a specified column in the table
    // taken from Stack Overflow post by Robin Mackenzie 03-01-2017
    // accessed 08-01-2018
    // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
    let selector = '#booksTable tr input:checked';
    $.each($(selector), function(idx, val) {
      //undeclared - global variable
      id = $(this).parent().siblings(":first").text();
    // end of referenced code.

      // get form values
      let userID = document.getElementById("loanUser").value;
      let DD = document.getElementById("loanDD").value;

      // Regex validation
      let valID = idRegex.test(userID);
      let valDD = dueDateRegex.test(DD);

      // check if data input is valid
      if (valID == false) {
        alert('Please enter a valid Author ID');
      } else if (valDD == false) {
        alert('Please enter a valid due Date.\nMust be in the format YYYY-MM-DD');
      } else {

        // Post the form data
        $.ajax({
          type: "POST",
          url: "http://127.0.0.1:3000/users/" + userID + "/loans/" +id,
          contentType: "application/json",
          dataType: 'json',
          data: JSON.stringify({
            dueDate: DD,
          }),
          success: function() {
            alert('Loan has been created!');
          }
        });
        // clear values on submit
        $('#loanUser').val('');
        $('#loanDD').val('');
      };
    });
  };

  // Call the function on button click
  $('#createLoan').on('click', loanBook);




  // ADD AUTHOR TO EXISTING BOOK
  function addAuthor() {

    // Code to get the data from a specified column in the table
    // taken from Stack Overflow post by Robin Mackenzie 03-01-2017
    // accessed 08-01-2018
    // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
    var selector = '#booksTable tr input:checked';
    $.each($(selector), function(idx, val) {
      bookID = $(this).parent().siblings(":first").text();
      bookTitle = $(this).parent().siblings(":first").next().text();
      bookISBN = $(this).parent().siblings(":first").next().next().text();
    });
    // end of referenced code.

    let authorID = document.getElementById('addAuthor').value;

    // Regex validation
    let valID = idRegex.test(authorID);

    // check if data input is valid
    if (valID == false) {
      alert('Please enter a valid Author ID');
    } else {

      // Post form data 
      $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/authors/' +authorID+ "/books/" + bookID,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          bookTitle: bookTitle,
          bookISBN: bookISBN,
        }),
          success: function() {
            alert('Author: "' +authorID+ '" has been added to "'+bookTitle+'"' );
          }
        });

      // clear form data on submit
      $('#addAuthor').val('');

    };
  };

  // Call the function on click
  $('#addAuthorBtn').on('click', addAuthor);




  // DELETE BOOK

  function deleteBook() {

    // Code to get the data from a specified column in the table
    // taken from Stack Overflow post by Robin Mackenzie 03-01-2017
    // accessed 08-01-2018
    // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
    var selector = '#booksTable tr input:checked';
    $.each($(selector), function(idx, val) {
      //undeclared - global variable
      id = $(this).parent().siblings(":first").text();
    // end of referenced code.

      // Delete the book
      $.ajax({
        type: "DELETE",
        url: "http://127.0.0.1:3000/books/" + id,
        contentType: "application/json",
        success: function() {
          alert('Book: ' +id+ ' has been deleted\nRefresh page to see changes');
        }
      });
      console.log("Success!");
    });
  };

  // call the function to delete book
  $('#bookDelete').on('click', deleteBook);



  // CREATE NEW BOOK

  function newBook() {
    // get values from form input
    let bookTitle = document.getElementById('bookTitle').value;
    let bookISBN = document.getElementById('bookISBN').value;
    let authorID = document.getElementById('bookAuthor').value;
    let bookYear = document.getElementById('bookYear').value;
    let bookPublisher = document.getElementById('bookPublisher').value;


    // Regex validation
    let valTitle = titleRegex.test(bookTitle);
    let valISBN = isbnRegex.test(bookISBN);
    let valAuthor = idRegex.test(authorID);
    let valYear = yearRegex.test(bookYear);
    let valPublisher = publisherRegex.test(bookPublisher);

    // check if data input is valid
    if (valTitle == false) {
      alert('Please enter a valid Title');
    } else if (valISBN == false) {
      alert('Please enter a valid ISBN');
    } else if (valAuthor == false) {
      alert('Please enter a valid Author ID')
    } else if (valYear == false) {
      alert('Please enter a valid Year');
    } else if (valPublisher == false) {
      alert('Please enter a valid Publisher');
    } else {

      // post data
      $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/authors/' +authorID+ "/books",
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          bookTitle: bookTitle,
          bookISBN: bookISBN,
          bookYear: bookYear,
          bookPublisher: bookPublisher,

        }),
        success: function() {
          alert('New book has been added: \n\t\tTitle: ' + bookTitle + '\n\t\tISBN: ' + bookISBN);
        }
      });

      // clear form data on submit
      $('#bookTitle').val('');
      $('#bookISBN').val('');
      $('#bookAuthor').val('');
      $('#bookYear').val('');
      $('#bookPublisher').val('');

    };
  };

  // On submit new book - trigger newBook function
  $('#newBookBtn').on('click', newBook);


  // Responsive Navigation Bar
  function showNav() {
    document.getElementById('hiddenNav3').style.display = "block";

    $('#toggle3').on('click', hideNav);
  }

  function hideNav() {
    document.getElementById('hiddenNav3').style.display = "none";
    $('#toggle3').on('click', showNav);
  }
    
  $('#toggle3').on('click', showNav);



// final closing tag for DOM loader function
});
