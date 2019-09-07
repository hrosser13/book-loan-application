// Wait for the DOM to load
$(function() {

  // GET total number of Users in Database
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/users",
    contentType: "application/json",
    data: {get_param: 'value'},
    dataType: "json",
    success: function (data) {
      let length = data.length;

      let userData = document.getElementById('userData');
      userData.innerHTML = 'Users in Database: <br>' +length;
      document.getElementById('user').appendChild(userData);

      }});



  // GET total number of Books in Database
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/books",
    contentType: "application/json",
    data: {get_param: 'value'},
    dataType: "json",
    success: function (data) {
      let length = data.length;

      let bookData = document.getElementById('bookData');
      bookData.innerHTML = 'Books in Database: <br>' +length;
      document.getElementById('book').appendChild(bookData);

      }});


  // GET total number of Authors in Database
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:3000/authors",
    contentType: "application/json",
    data: {get_param: 'value'},
    dataType: "json",
    success: function (data) {
      let length = data.length;

      let authorData = document.getElementById('authorData');
      authorData.innerHTML = 'Authors in Database: <br>' +length;
      document.getElementById('author').appendChild(authorData);

      }});

  // Responsive Navigation Bar
  function showNav() {
    document.getElementById('hiddenNav').style.display = "block";

    $('#toggle').on('click', hideNav);
  }

  function hideNav() {
    document.getElementById('hiddenNav').style.display = "none";
    $('#toggle').on('click', showNav);
  }
    
  $('#toggle').on('click', showNav);


// final closing tag for DOM loader function
});
