'use strict';

const axios = require('axios');
const cache = require('./cache');

async function getWeather(request, response) {
  let searchLat = request.query.lat;
  let searchLon = request.query.lon;
  let key = 'weather-' + searchLat + searchLon;
  let url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${searchLat}&lon=${searchLon}&key=${process.env.WEATHER_BIT_IO_API_KEY}&days=5&units=I&lang=en`

  if (cache[key] && (Date.now() - chace[key].timestamp < 50000)) {
    console.log('cache hit');
  } else {
    let dataFromWeatherAPI = await axios.get(url);
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = dataFromWeatherAPI.then(response => parseWeather(response.data));
  }
  return cache[key].data;
}
  // console.log(dataFromWeatherAPI.data);
function parseWeather(weatherStats) {
  try {
    const weatherSummaries = weatherStats.data.map(day => new Forecast(day));
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}


//   let retrievedForecastData = dataFromWeatherAPI.data.data.map(day => new Forecast(day));

//   console.log(retrievedForecastData);

//   response.status(200).send(retrievedForecastData);
// };

//CLASSES
class Forecast {
  constructor(weatherInfo) {
    this.dateTime = weatherInfo.datetime;
    this.description = weatherInfo.weather.description;
    // console.log(this.dateTime, this.description);
  }
};

module.exports = getWeather;