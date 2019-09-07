// Wait for the DOM to load
$(function() {


	// TYPE SEARCH FUNCTIONS

 	// TYPE SEARCH FUNCTION --- TITLE
	$('#loanSearchTitle').on('keyup', loanSearchT);

	function loanSearchT() {

	  	// Function to search table cells
	  	// This code was taken from W3schools
	 	// accessed 05-02-2019
	  	// https://www.w3schools.com/howto/howto_js_filter_lists.asp
	    var input, filter, table, tr, td, i;
	    input = document.getElementById("loanSearchTitle");
	    filter = input.value.toUpperCase();
	    table = document.getElementById('loansTable');
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


 	// TYPE SEARCH FUNCTION --- USER ID
	$('#loanSearchUser').on('keyup', loanSearchU);

	  	function loanSearchU() {
	    var input, filter, table, tr, td, i;
	    input = document.getElementById("loanSearchUser");
	    filter = input.value.toUpperCase();
	    table = document.getElementById('loansTable');
	    tr = table.getElementsByTagName("tr");

	    // Loop through all list items, and hide those who don't match the search query
	    for (i = 0; i < tr.length; i++) {
	      td = tr[i].getElementsByTagName('td')[4];
	      if (td) {
	        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
	          tr[i].style.display = "";
	        } else {
	          tr[i].style.display = "none";
	        }
	      }
	    }
  	};
  	// end of referenced code.




	// GET LOANS + CREATE TABLE

	function createLoanTable() {

		// Get Loan Data
		$.ajax({
		  type: "GET",
		  url: "http://127.0.0.1:3000/loans/books",
		  contentType: "application/json",
		  data: {get_param: 'value'},
		  dataType: "json",
		  success: function (data) {
		    $.each(data, function(index, element) {

		      // Create a table from the data
		      var row = $("<tr />");
		      $("<td />").text(element.id).appendTo(row);
		      $("<td />").text(element.BookId).appendTo(row);
		      $("<td />").text(element["Book"]["title"]).appendTo(row);
		      $("<td />").text(element.dueDate).appendTo(row);
		      $("<td />").text(element.UserId).appendTo(row);
		      // Create a radio column
		      $("<td />").html('<input type="radio" name="book" class="updateUser"/>').appendTo(row);

		      row.appendTo("#loansTable");



		    })}});
	};

	createLoanTable();



	// UPDATE BUTTON --> SHOW UPDATE FORM

	// Hide the section until button is clicked
	document.getElementById('updateLoanOutput').style.display = "none";

	// Show the section when button is clicked
	function updateLoanOutput() {
		document.getElementById('updateLoanOutput').style.display = "block";
	}

	$('#updateDDBtn').on('click', updateLoanOutput);



	// REGEX VALIDATION
	// due date validation
 	let dueDateRegex = /^(\d){4}-(\d){2}-(\d){2}$/;


	// UPDATE LOAN FORM

	function updateLoan() {
		var selector = '#loansTable tr input:checked';
		$.each($(selector), function(idx, val) {
			loanID = $(this).parent().siblings(":first").text();
		});

		let updateDD = document.getElementById("updateDD").value;

		// Regex Validation
		let dueDateVal = dueDateRegex.test(updateDD);

		if (dueDateVal == false) {
			alert('Please enter a valid due Date.\nMust be in the format YYYY-MM-DD');
		} else {

			// PUT request to update due date
			$.ajax({
				type: "PUT",
				url: "http://127.0.0.1:3000/loans/" + loanID,
				contentType: "application/json",
				dataType: "json",
				data: JSON.stringify({
					dueDate: updateDD,
				}),
				success: function() {
					alert("Loan '" + loanID + "' has been updated with new due date: " + updateDD);
				}
			})
			// clear form input on submit
			$('#updateDD').val('');
		};
	}
	// call the function on click
	$('#updateDDSubmit').on('click', updateLoan);




	// DELETE LOAN 

	function deleteLoan() {
		var selector = '#loansTable tr input:checked';
		$.each($(selector), function(idx, val) {
			loanID = $(this).parent().siblings(':first').text();
		});

		// Delete loan request
		$.ajax({
			type: "DELETE",
			url: "http://127.0.0.1:3000/loans/" + loanID,
			contentType: "application/json",
			success: function() {
				alert("Loan '" +loanID+ "' has been deleted.");
			}
		});
	};

	// call function on click
	$('#delLoanBtn').on('click', deleteLoan);



  // Responsive Navigation Bar
  function showNav() {
    document.getElementById('hiddenNav5').style.display = "block";

    $('#toggle5').on('click', hideNav);
  }

  function hideNav() {
    document.getElementById('hiddenNav5').style.display = "none";
    $('#toggle5').on('click', showNav);
  }
    
  $('#toggle5').on('click', showNav);


// final closing tag for DOM loader function
});