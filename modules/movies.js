'use strict';

//REQUIRE
const axios = require('axios');
const cache = require('./cache');

async function getMovies(request, response, next) {
  try {
    let searchCity = request.query.city

    let key = 'movie-' + searchCity;

    let url = 
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchCity}`;
    
    if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
      console.log('cache hit');
    } else { 
      let dataFromMoviesAPI = await axios.get(url);
      console.log('cache miss');
      cache[key] = {};
      cache[key].timestamp = Date.now();
      cache[key].data = dataFromMoviesAPI.then(response => parseMovies(response.data));
    } 
    return cache[key].data;
  } catch (error) {
    console.log(error.message);
    response.status(500).send(error.message);
  };
  };

  function parseMovies(movieStats) {
    try {
      let retrievedMovieData = movieStats.data.results.map(movie => new Movie(movie));
      return Promise.resolve(retrievedMovieData);
    } catch (e) {
      return Promise.reject(e);
    }
  }

    // console.log(dataFromMoviesAPI.data);
    // console.log(retrievedMovieData);
    // // response.status(200).send(dataFromMoviesAPI.data);
    // response.status(200).send(retrievedMovieData);
    

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