'use strict';

//REQUIRE
const express = require('express');
const weatherData = require('./data/weather.json')
const cors = require('cors');
const axios = require('axios');
const { response } = require('express');
const dotenv = require('dotenv').config();

//USE
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

//ROUTES
// this is the app.get's with try/catch
// console.log(weatherData);
app.get('/', (req, res) => {
  res.status(200).send('Hello there!');
});

app.get('/weather', (request, response) => {
  let dataFromWeatherAPI = weatherData.find(obj => obj.city_name.toLowerCase() === request.query.searchQuery.toLowerCase());
  let retrievedForecastData = dataFromWeatherAPI.data.map(day => new Forecast(day));
  console.log(retrievedForecastData);
  response.status(200).send(retrievedForecastData);
});

app.get('/movies', async (request, response) => {
  try {
    let searchQuery = request.query.searchQuery
    let url = `
    https://api.themoviedb.org/3/search/movie?api_key=${process.env.THE_MOVIE_DB_API_KEY_V3}&quer${searchQuery}`
    let dataFromMoviesAPI = await axios.get(url);
    let retrievedMovieData = dataFromMoviesAPI.data.results.map(movie => new Movie);
    console.log(dataFromMoviesAPI);
    // console.log(retrievedMovieData);
    // response(200).send(retrievedMovieData);
  } catch (error) {
    console.log(error.message);
  }
  });

// Response for invalid req
app.get('*', (req, res) => {
  res.status(404).send('These are not the droids you\'re looking for');
});

//CLASSES
class Forecast {
  constructor(weatherInfo) {
    this.dateTime = weatherInfo.datetime;
    this.description = weatherInfo.weather.description;
    console.log(this.dateTime, this.description);
  }
};

class Movies {
  constructor(movieData) {
    this.title = movieData.title;
    this.description = movieData.overview;
    // https://image.tmdb.org/t/p/w300/poster_path
    this.src = movieObj.poster_path ? movieData.poster_path : 'myImg.jpg'
  }
}

//ERRORS
app.use((error, req, res, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});

//LISTEN
app.listen(PORT, () => console.log(`listening on port ${PORT}`));






