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
  let dataFromWeatherAPI = weatherData.find(obj => obj.city_name.toLowerCase()===request.query.searchQuery.toLowerCase());
  let retrievedForecastData = dataFromWeatherAPI.data.map(day => new Forecast(day));
  console.log(retrievedForecastData);
  response.status(200).send(retrievedForecastData);
});

// Response for invalid req
app.get('*', (req, res) => {
  res.status(404).send('These are not the droids you\'re looking for');
});

//CLASSES
class Forecast {
  constructor(weatherInfo){
    this.dateTime = weatherInfo.datetime;
    this.description = weatherInfo.weather.description;
    console.log(this.dateTime , this.description);
  }
};

//ERRORS
app.use((error, req, res, next) => {
  console.log(error.message);
  response.status(500).send(error.message);
}); 

//LISTEN
app.listen(PORT, () => console.log(`listening on port ${PORT}`));






