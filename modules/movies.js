'use strict';

//REQUIRE
const axios = require('axios');

async function getMovies(request, response, next) {
  try {
    let searchCity = request.query.city
    console.log('Seattle');
    console.log(searchCity);
    let url = 
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchCity}`;
    let dataFromMoviesAPI = await axios.get(url);
    let retrievedMovieData = dataFromMoviesAPI.data.results.map(movie => new Movie(movie));

    // console.log(dataFromMoviesAPI.data);
    console.log(retrievedMovieData);
    // response.status(200).send(dataFromMoviesAPI.data);
    response.status(200).send(retrievedMovieData);
    
  } catch (error) {
    console.log(error.message);
    response.status(500).send(error.message);
  }
};

// CLASSES
class Movie {
  constructor(movieData) {
    this.title = movieData.title;
    this.description = movieData.overview;
    this.average_votes = movieData.vote_average;
    this.total_votes = movieData.vote_count;
    // https://image.tmdb.org/t/p/w300/poster_path
    this.src = movieData.poster_path ? `https://image.tmdb.org/t/p/w300/${movieData.poster_path}` : '#';
    this.popularity = movieData.popularity
    this.released_on = movieData.release_date
  }
};

module.exports = getMovies;