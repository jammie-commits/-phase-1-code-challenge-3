const baseUrl = 'http://localhost:3000'; 

document.addEventListener('DOMContentLoaded', function () {
  // Fetch movie details
  fetch(`${baseUrl}/films/1`)
    .then(response => response.json())
    .then(movie => {
      const availableTickets = movie.capacity - movie.tickets_sold;
      document.getElementById('poster').src = movie.poster;
      document.getElementById('title').textContent = movie.title;
      document.getElementById('runtime').textContent = `${movie.runtime} minutes`;
      document.getElementById('film-info').textContent = movie.description;
      document.getElementById('showtime').textContent = movie.showtime;
      document.getElementById('ticket-num').textContent = availableTickets;
    });

  // Fetch and display all movies in the list
  fetch(`${baseUrl}/films`)
    .then(response => response.json())
    .then(movies => {
      const filmsList = document.getElementById('films');
      movies.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.classList.add('film', 'item');
        listItem.textContent = movie.title;
        filmsList.appendChild(listItem);
      });
    });

  // Buy ticket button click handler
  const buyTicketButton = document.getElementById('buy-ticket');
  buyTicketButton.addEventListener('click', function () {
    const availableTicketsElement = document.getElementById('ticket-num');
    const availableTickets = parseInt(availableTicketsElement.textContent);

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
          // Update ticket information 
          availableTicketsElement.textContent = updatedMovie.tickets_sold;

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
  const filmsList = document.getElementById('films');
  filmsList.addEventListener('click', function (event) {
    if (event.target.classList.contains('film', 'item')) { 
      const movieId = event.target.textContent; 
      fetch(`${baseUrl}/films/${movieId}`)
        .then(response => response.json())
        .then(movie => {
          const availableTickets = movie.capacity - movie.tickets_sold;
          document.getElementById('poster').src = movie.poster;
          document.getElementById('title').textContent = movie.title;
          document.getElementById('runtime').textContent = `${movie.runtime} minutes`;
          document.getElementById('film-info').textContent = movie.description;
          document.getElementById('showtime').textContent = movie.showtime;
          document.getElementById('ticket-num').textContent = availableTickets;
        });
    }
  });


});
