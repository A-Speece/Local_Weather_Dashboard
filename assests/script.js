var searchCityFormEl = $("#search-form");
var cityInputEl = $("#search-input");
var currentCityEl = $("#currentcity");
var apiKey = "23ac2568a81ce4969e4c7f31ad40c4ed";

function getCityDetail(cityName) {
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      cityName +
      "&limit=1&appid=" +
      apiKey
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      getCityWeather(data[0].lat, data[0].lon);
      getCurrentWeather(data[0].lat, data[0].lon);
    });
}

function getCityWeather(lat, lon) {
  fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function getCurrentWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
    });
}

function citySearch(event) {
  event.preventDefault();
  var cityName = cityInputEl.val();
  getCityDetail(cityName);
}

searchCityFormEl.on("submit", citySearch);
