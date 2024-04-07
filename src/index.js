const baseUrl = 'http://localhost:3000'; 

$(document).ready(function () {
  // Fetch movie details
  fetch(`${baseUrl}/films/1`)
    .then(response => response.json())
    .then(movie => {
      const availableTickets = movie.capacity - movie.tickets_sold;
      $('#poster').attr('src', movie.poster);
      $('#title').text(movie.title);
      $('#runtime').text(`${movie.runtime} minutes`);
      $('#film-info').text(movie.description);
      $('#showtime').text(movie.showtime);
      $('#ticket-num').text(availableTickets);
    });

  // Fetch and display all movies in the list
  fetch(`${baseUrl}/films`)
    .then(response => response.json())
    .then(movies => {
      movies.forEach(movie => {
        const listItem = $('<li>').addClass('film item').text(movie.title);
        $('#films').append(listItem);
      });
    });

  // Buy ticket button click handler
  $('#buy-ticket').click(function (event) {
    event.preventDefault();
    const availableTickets = parseInt($('#ticket-num').text());

    if (availableTickets > 0) {
      const movieId = 1; 
      const ticketCount = 1;

      // Update movie tickets sold on backend using PATCH
      fetch(`${baseUrl}/films/${movieId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets_sold: availableTickets - 1 })
      })
        .then(response => response.json())
        .then(updatedMovie => {
          // Update ticket information on frontend
          $('#ticket-num').text(updatedMovie.tickets_sold);

          // Create new ticket entry on backend using POST
          fetch(`${baseUrl}/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ film_id: movieId, number_of_tickets: ticketCount })
          });
        });
    } else {
      alert('Sold out!');
    }
  });


  // Clicking a movie in the list handler 
  $('#films').on('click', '.film.item', function (event) {
    event.preventDefault();
    const movieTitle = $(this).text(); 
    const movieId = movieTitle; 
    fetch(`${baseUrl}/films/${movieId}`)
      .then(response => response.json())
      .then(movie => {
        const availableTickets = movie.capacity - movie.tickets_sold;
        $('#poster').attr('src', movie.poster);
        $('#title').text(movie.title);
        $('#runtime').text(`${movie.runtime} minutes`);
        $('#film-info').text(movie.description);
        $('#showtime').text(movie.showtime);
        $('#ticket-num').text(availableTickets);
      });
  });
  
 
});

