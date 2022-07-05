'use strict';

const axios = require('axios');

async function getWeather(request, response, next) => {
  let searchLat = request.query.lat;
  let searchLon = request.query.lon;
  let url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${searchLat}&lon=${searchLon}&key=${process.env.WEATHER_BIT_IO_API_KEY}&days=5&units=I&lang=en`
  let dataFromWeatherAPI = await axios.get(url);
  // console.log(dataFromWeatherAPI.data);

  let retrievedForecastData = dataFromWeatherAPI.data.data.map(day => new Forecast(day));

  console.log(retrievedForecastData);

  response.status(200).send(retrievedForecastData);
};

//CLASSES
class Forecast {
  constructor(weatherInfo) {
    this.dateTime = weatherInfo.datetime;
    this.description = weatherInfo.weather.description;
    // console.log(this.dateTime, this.description);
  }
};

module.exports = getWeather;