const movieList = document.getElementById('films');
let movieData = [];

function fetchData() {
    fetch('db.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching data from db.json');
            }
            return response.json();
        })
        .then(data => {
            movieData = data.films;
            displayData();
            console.log(movieData); // Log fetched data
        })
        .catch(error => {
            console.error('Error fetching data from db.json:', error);
            showErrorMessage('Error loading movie data');
        });
}

function displayData() {
    movieData.forEach(movie => {
        const li = createMovieListItem(movie);
        movieList.appendChild(li);
    });
}

function createMovieListItem(movie) {
    const li = document.createElement('li');
    li.textContent = movie.title;
    li.dataset.movieId = movie.id;
    li.classList.add('film', 'item');
    li.addEventListener('click', () => updateDetails(movie.id));
    return li;
}

function updateDetails(movieId) {
    const movie = movieData.find(m => m.id === movieId);
    if (!movie) return;

    const availableTickets = movie.capacity - movie.tickets_sold;
    const buyButton = document.getElementById('buy-ticket');

    buyButton.textContent = availableTickets > 0 ? 'Buy Ticket' : 'Sold Out';
    buyButton.classList.toggle('disabled', availableTickets === 0);
    buyButton.onclick = () => {
        if (availableTickets > 0) {
            purchaseTicket(movie);
        }
    };

    displayMovieDetails(movie);
}

function purchaseTicket(movie) {
    movie.tickets_sold++;
    updateTicketCount(movie.id);
    updateDetails(movie.id);
}

function updateTicketCount(movieId) {
    const movie = movieData.find(m => m.id === movieId);
    const availableTickets = movie.capacity - movie.tickets_sold;
    document.getElementById('ticket-num').textContent = availableTickets;
}

function displayMovieDetails(movie) {
    document.getElementById('title').textContent = movie.title;
    document.getElementById('runtime').textContent = `${movie.runtime} minutes`;
    document.getElementById('film-info').textContent = movie.description;
    document.getElementById('showtime').textContent = movie.showtime;
    document.getElementById('poster').src = movie.poster;
    document.getElementById('poster').alt = `Poster for ${movie.title}`;
    updateTicketCount(movie.id);
}

function showErrorMessage(message) {
    const errorMessage = document.createElement('div');
    errorMessage.textContent = message;
    errorMessage.classList.add('ui', 'negative', 'message');
    document.body.appendChild(errorMessage);
    setTimeout(() => errorMessage.remove(), 5000);
}

fetchData(); // Call fetchData function

