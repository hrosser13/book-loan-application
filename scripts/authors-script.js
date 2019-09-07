// Wait for the DOM to load
$(function() {


  // TYPE SEARCH FUNCTION --- AUTHOR NAME

  $('#searchAName').on('keyup', searchAuthName);

  // Function to search table cells
  // This code was taken from W3schools
  // accessed 05-02-2019
  // https://www.w3schools.com/howto/howto_js_filter_lists.asp
  function searchAuthName() {
    let input, filter, table, tr, td, i;
    input = document.getElementById("searchAName");
    filter = input.value.toUpperCase();
    table = document.getElementById('authorsTable');
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


  // TYPE SEARCH FUNCTION --- AUTHOR BOOKS
  $('#searchABook').on('keyup', searchAuthBook);

  function searchAuthBook() {
    let input, filter, table, tr, td, i;
    input = document.getElementById("searchABook");
    filter = input.value.toUpperCase();
    table = document.getElementById('authorsTable');
    tr = table.getElementsByTagName("tr");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[3];
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



  // GET AUTHORS + CREATE TABLE

  function createAuthorsTable() {

    // Get author data
    $.ajax({
      type: "GET",
      url: "http://127.0.0.1:3000/authors?allEntities=true",
      contentType: "application/json",
      data: {get_param: 'value'},
      dataType: "json",
      success: function (data) {
        $.each(data, function(index, element) {

          // create a table from the data
          var row = $("<tr />");
          $("<td />").text(element.id).appendTo(row);
          $("<td />").text(element.name).appendTo(row);
          // create a radio button column
          $("<td />").html('<input type="radio" name="book" class="updateUser"/>').appendTo(row);

          // Check if Author has book(s) and append to row
          if (element["Books"][0] != null) {
            $.each(element["Books"], function(i,j) {
              $("<td />").html("'"+element["Books"][i].title+"'" + "<br>").appendTo(row).addClass("authorsTD");
            });  
          } else {
            $("<td />").html("").appendTo(row);
          };

          // Code to perform table merge
          // taken from Stack Overflow post by user1106925 18-02-2012
          // accessed 20-01-2019
          // https://stackoverflow.com/questions/9343171/merge-multiple-td-into-1-with-jquery
          $('table tr > :nth-child(4)').append(function() {
            return $(this).next().remove().contents();
          });
          // end of referenced code.

          row.appendTo("#authorsTable");

        })}});
  };

  // call the function to create table
  createAuthorsTable();


  // REGEX FOR VALIDATION
  // name validation
  let nameRegex = /^\w{1,20}\s?\w{0,20}-?\w{0,10}$/;


  // CREATE NEW AUTHOR

  function submitAuthor() {

    let authorName = document.getElementById('authorName').value;

    // regex validation
    let nameVal = nameRegex.test(authorName);

    if (nameVal == false) {
      alert('Please enter a valid name')
    } else {

      // Post form data
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1:3000/authors",
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({
        name: authorName,
        }),
        success: function() {
          alert(authorName + ' has been created!');
        }
      });
      
      // Clear form data on submit
      $('#authorName').val('');
    };
  };

  // Call the Submit Author function on clock
  $('#submitAuthor').on('click', submitAuthor);




	// SHOW AUTHOR DETAILS

  // Hide section until button is clicked
	document.getElementById("updateAuthOutput").style.display = "none";

  // Show section on click
	function updateAuthOutput() {
		document.getElementById("updateAuthOutput").style.display = "block";
	};

	$('#updateAuthBtn').on('click', updateAuthOutput);


  // UPDATE AUTHOR
	function updateAuthor() {

    // Code to get the data from a specified column in the table
    // taken from Stack Overflow post by Robin Mackenzie 03-01-2017
    // accessed 08-01-2018
    // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
    let selector = '#authorsTable tr input:checked';
    $.each($(selector), function(idx, val) {
	   //undeclared - global variable
      id = $(this).parent().siblings(":first").text();
    });
      
		let updateName = document.getElementById("updateAuthName").value;

    // Regex validation
    let updateNameVal = nameRegex.test(updateName);

    if (updateNameVal == false) {
      alert('Please enter a valid name')
    } else {
		  
      // Update Data Request
  		$.ajax({
  		  type: "PUT",
  		  url: "http://127.0.0.1:3000/authors/" + id,
  		  contentType: "application/json",
  		  dataType: 'json',
  		  data: JSON.stringify({
  		  name: updateName,          
  		  }),
  		  success: function() {
  		    alert('Author "' + updateName + '"" has been updated!');
  		  }
  		});
    
      // clear form data on submit
      $('#updateAuthName').val('');	 
    }; 	
	};
	  
  // Call function to update author on click
	$('#updateAuthSubmit').on('click', updateAuthor);


	        
	      
	// DELETE AUTHOR

  function deleteAuthor() {

    // Code to get the data from a specified column in the table
    // taken from Stack Overflow post by Robin Mackenzie 03-01-2017
    // accessed 08-01-2018
    // https://stackoverflow.com/questions/41438506/retrieve-first-column-value-of-checkbox-selected-row-of-an-html-table-and-modify
    var selector = '#authorsTable tr input:checked';
    $.each($(selector), function(idx, val) {
      id = $(this).parent().siblings(":first").text();
    // end of referenced code.

      // Delete Request
      $.ajax({
        type: "DELETE",
        url: "http://127.0.0.1:3000/authors/" + id,
        contentType: "application/json",
        success: function() {
          alert('Author: ' +id+ ' has been deleted\nRefresh page to see changes');
        }
      });
      console.log("Success!");
    });
  };

  // Call the function to delete author
  $('#delAuthBtn').on('click', deleteAuthor);


  // Responsive Navigation Bar
  function showNav() {
    document.getElementById('hiddenNav4').style.display = "block";

    $('#toggle4').on('click', hideNav);
  }

  function hideNav() {
    document.getElementById('hiddenNav4').style.display = "none";
    $('#toggle4').on('click', showNav);
  }
    
  $('#toggle4').on('click', showNav);


// Final closing tag for DOM loader function
});