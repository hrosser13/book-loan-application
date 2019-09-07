// Wait for the DOM to load
$(function() {
  
  // TYPE SEARCH FUNCTION --- NAME

  $('#searchUserN').on('keyup', searchUserName);

  // Function to search table cells
  // This code was taken from W3schools
  // accessed 05-02-2019
  // https://www.w3schools.com/howto/howto_js_filter_lists.asp
  function searchUserName() {
    let input, filter, table, tr, td, i;
    input = document.getElementById("searchUserN");
    filter = input.value.toUpperCase();
    table = document.getElementById('usersTable');
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

  // TYPE SEARCH FUNCTION --- BARCODE

  $('#searchUserBC').on('keyup', searchUserBarcode);

  function searchUserBarcode() {
    let input, filter, table, tr, td, i;
    input = document.getElementById("searchUserBC");
    filter = input.value.toUpperCase();
    table = document.getElementById('usersTable');
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
  // end of referenced code.


  // REGEX

  // barcode validation
  let barcodeRegex = /^(\d){6}$/;
  // user name validation
  let nameRegex = /^\w{1,20}\s?\w{0,20}-?\w{0,10}$/;

  // CREATE NEW USER
  function createUser() {
    // Grab the input values
    let name1 = document.getElementById("name").value;
    let barcode1 = document.getElementById("barcode").value;
    let radioValue = $("input[name=memberType]:checked").val();

    // Regex validation for form

    // validate the barcode
    let result = barcodeRegex.test(barcode1);

    // validate the name
    let result2 = nameRegex.test(name1);

    // check if name and barcode fit the criteria
    if (result == false) {
      alert('Please enter a valid barcode\nMust be 6 digits long\nNumbers only');
      return false;

    } else if (result2 == false) {
      alert('Please enter a valid name');
      return false;

    } else {

      // if data is valid, post to /users

      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3000/users",
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({
          name: name1,
          barcode: barcode1,
          memberType: radioValue,
        }),
        success: function() {
          alert('New User has been created: \n\t\tName: ' + name1 + '\n\t\tBarcode: ' + barcode1 + '\n\t\tMember Type: ' + radioValue);
        }
      });

    // Clear form data on submit
    $('#name').val('');
    $('#barcode').val('');
    }

  };

  // Call function on click
  $('#creatUSubmit').on('click', createUser);




  // GET USERS + CREATE TABLE

  function createUserTable() {
    // Get user data
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:3000/users",
      contentType: "application/json",
      data: {get_param: 'value'},
      dataType: "json",
      success: function (data) {
        $.each(data, function(index, element) {

          // create a table from the data
          let row = $("<tr />");
          $("<td />").text(element.id).appendTo(row);
          $("<td />").text(element.name).appendTo(row);
          $("<td />").text(element.barcode).appendTo(row);
          $("<td />").text(element.memberType).appendTo(row);
          // create radio input column
          $("<td />").html('<input type="radio" name="user"/>').appendTo(row);


          row.appendTo("#usersTable");
        });
      }
    });
  };

  // Call function to create table
  createUserTable();




  // VIEW USERS DETAILS

  // Hide the User Details section until clicked
  document.getElementById("container-update").style.visibility = "hidden";

  function updater() {
  // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
     
    // clear paragraph to avoid duplicates
    let loanPara = document.getElementById('userLoansP');
    loanPara.innerHTML = "";

    // Code to get the data from a specified column in the table
    // taken from Stack Overflow post by Robin Mackenzie 03-01-2017
    // accessed 08-01-2018
    // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
    let selector = '#usersTable tr input:checked';
    $.each($(selector), function(idx, val) {
      //undeclared - global variable
      id = $(this).parent().siblings(":first").text();
    });
    // end of referenced code. 

    // Get User data
    const userIDurl = "http://127.0.0.1:3000/users/" + id;
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', userIDurl);

    xhttp.addEventListener('load', function() {
      let users = JSON.parse(this.response);

      name = users.name;
      id = users.id;
      barcode = users.barcode;
      type = users.memberType;

      // append data to paragraph
      let detailsPara = document.getElementById("userDetailsP")
      detailsPara.innerHTML = "<b>User: </b>" +name+ "<br><b>Barcode: </b>" +barcode+ "<br><b>Member Type: </b>" +type;
      document.getElementById("result").appendChild(detailsPara)

      // Create Loans Header
      $('#loanHeader').innerHTML = 'Loans';
      $('#loanHeader').appendTo('#result');

      // Show the User Details section
      document.getElementById("container-update").style.visibility = "visible";

      // Call function to get User's loans
      userLoans();

    });

    xhttp.send();
      
  };

  // call function to update User on click
  $('#updateUser').on('click', updater)


  // GET USER'S LOANS
  function userLoans() {

    // Code to get the data from a specified column in the table
    // taken from Stack Overflow post by Robin Mackenzie 03-01-2017
    // accessed 08-01-2018
    // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
    let selector = '#usersTable tr input:checked';
    $.each($(selector), function(idx, val) {
      id = $(this).parent().siblings(':first').text();
    // end of referenced code.

      // Get Loan data of User
      $.ajax({
        type: "GET",
        url: "http://127.0.0.1:3000/users/" + id + "/loans/books",
        contentType: "application/json",
        dataType: 'json',
        success: function(data) {
          $.each(data, function(index, element) {

            // clear paragraph data to prevent duplicates
            $('#userLoansP').innerHTML = "";

            // create List of loans
            let list = $("<ul />");
            let bookTitle = element["Book"]["title"];
            $("<li />").html("<b>"+bookTitle+"<br>Book ID: </b>" + element.BookId + "<br><b>Due Date: </b>" + element.dueDate).appendTo(list);
      
            // append loans list to div
            list.appendTo('#userLoansP');
            $('#userLoansP').appendTo('#result')
          })
        }
      })
    })
  };




  // UPDATE USER

  function updateUserForm() {

    // Code to get the data from a specified column in the table
    // taken from Stack Overflow post by Robin Mackenzie 03-01-2017
    // accessed 08-01-2018
    // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
    let selector = '#usersTable tr input:checked';
    $.each($(selector), function(idx, val) {
      //undeclared - global variable
      id = $(this).parent().siblings(":first").text();
    // end of referenced code. 

      // Grab input values
      let updateName = document.getElementById("updateName").value;
      let updateBarcode = document.getElementById("updateBarcode").value;
      let updateMemberType = $("input[name=updateMemberType]:checked").val();

      // Regex validation for form

      // validate the barcode
      let result = barcodeRegex.test(updateBarcode);

      // validate the name
      let result2 = nameRegex.test(updateName);

      // check if name and barcode fit the criteria
      if (result == false) {
        alert('Please enter a valid barcode\nMust be 6 digits long\nNumbers only');
        return false;

      } else if (result2 == false) {
        alert('Please enter a valid name');
        return false;

      } else {

        // PUT request to update user
        $.ajax({
            type: "PUT",
            url: "http://127.0.0.1:3000/users/" + id,
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify({
              name: updateName,
              barcode: updateBarcode,
              memberType: updateMemberType,
            }),
            success: function() {
              alert('User ' + name + ' has been updated!');
            }
        });

        // clear form data on submit
        $('#updateName').val('');
        $('#updateBarcode').val('');

      };

  })};

  // call update user function on click
  $('#updateButton').on('click', updateUserForm);




  // DELETE USER

  function deleteUserForm() {

    // Code to get the data from a specified column in the table
    // taken from Stack Overflow post by Robin Mackenzie 03-01-2017
    // accessed 08-01-2018
    // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
    let selector = '#usersTable tr input:checked';
    $.each($(selector), function(idx, val) {
      //undeclared - global variable
      id = $(this).parent().siblings(":first").text();
    // end of referenced code.

      // Delete request
      $.ajax({
          type: "DELETE",
          url: "http://127.0.0.1:3000/users/" + id,
          contentType: "application/json",
          success: function() {
            alert('User: ' +id+ ' has been deleted');
          }
        })
      console.log("Success!");
    });
  };

  // Call delete user function on click
  $('#deleteUser').on('click', deleteUserForm);


  // Function to hide user details section
  function closeUpdate() {
    document.getElementById("container-update").style.visibility = "hidden";
  };

  // Call function when exit button is clicked
  $('#exit').on('click', closeUpdate);


  // Responsive Navigation Bar
  function showNav() {
    document.getElementById('hiddenNav2').style.display = "block";

    $('#toggle2').on('click', hideNav);
  }

  function hideNav() {
    document.getElementById('hiddenNav2').style.display = "none";
    $('#toggle2').on('click', showNav);
  }
    
  $('#toggle2').on('click', showNav);

// Final closing tag for DOM loader function
});