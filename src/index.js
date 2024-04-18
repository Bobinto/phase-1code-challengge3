document.addEventListener('DOMContentLoaded', () => {
    const baseURL = 'http://localhost:3000';
    const filmsList = document.querySelector('#films');
    const movieDetails = document.querySelector('#movie-details');

    const fetchMovieDetails = async (id) => {
        try {
            const response = await fetch(`${baseURL}/films/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
            }
            const movie = await response.json();
            return movie;
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    const updateMovieDetails = (movie) => {
        const availableTickets = movie.capacity - movie.tickets_sold;
        movieDetails.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title} Poster">
            <h2>${movie.title}</h2>
            <p>${movie.description}</p>
            <p><strong>Showtime:</strong> ${movie.showtime}</p>
            <p><strong>Runtime:</strong> ${movie.runtime} minutes</p>
            <p><strong>Available Tickets:</strong> ${availableTickets}</p>
            <button id="buy-ticket">Buy Ticket</button>
        `;
        const buyTicketButton = document.querySelector('#buy-ticket');
        buyTicketButton.addEventListener('click', async () => {
            if (availableTickets > 0) {
                const updatedTicketsSold = movie.tickets_sold + 1;
                const patchResponse = await fetch(`${baseURL}/films/${movie.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tickets_sold: updatedTicketsSold
                    })
                });
                if (patchResponse.ok) {
                    updateMovieDetails(await fetchMovieDetails(movie.id));
                }
            }
        });
        if (availableTickets === 0) {
            buyTicketButton.textContent = 'Sold Out';
        }
    };

    const populateFilmsList = async () => {
        try {
            const response = await fetch(`${baseURL}/films`);
            if (!response.ok) {
                throw new Error('Failed to fetch films');
            }
            const films = await response.json();
            filmsList.innerHTML = '';
            films.forEach(film => {
                const li = document.createElement('li');
                li.textContent = film.title;
                li.classList.add('film', 'item');
                li.addEventListener('click', async () => {
                    updateMovieDetails(await fetchMovieDetails(film.id));
                });
                filmsList.appendChild(li);
            });
        } catch (error) {
            console.error('Error populating films list:', error);
        }
    };

    populateFilmsList();
    fetchMovieDetails(1).then(movie => {
        updateMovieDetails(movie);
    });
});
