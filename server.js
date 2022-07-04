'use strict';
//REQUIRE
const express = require('express');
const weatherData = require('./data/weather.json');
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

app.get('/weather', async (request, response) => {
  let searchLat = request.query.lat;
  let searchLon = request.query.lon;
  let url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${searchLat}&lon=${searchLon}&key=${process.env.WEATHER_BIT_IO_API_KEY}&days=5&units=I&lang=en`
  let dataFromWeatherAPI = await axios.get(url);
  // console.log(dataFromWeatherAPI.data);

  let retrievedForecastData = dataFromWeatherAPI.data.data.map(day => new Forecast(day));

  console.log(retrievedForecastData);

  response.status(200).send(retrievedForecastData);
});

app.get('/movies', async (request, response) => {
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
    // console.log(this.dateTime, this.description);
  }
};

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

//ERRORS
app.use((error, req, res, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
});

//LISTEN
app.listen(PORT, () => console.log(`listening on port ${PORT}`));






