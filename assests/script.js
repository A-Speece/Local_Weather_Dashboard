var searchCityFormEl = $("#search-form");
var cityInputEl = $("#search-input");
var currentCity = $("#current-city");

var apiKey = "23ac2568a81ce4969e4c7f31ad40c4ed";
var searchHistoryArray = [];
var searchContainer = $(".search-container");

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
      currentCity = currentCity.text(data.name);
    });
}

function citySearch(event) {
  event.preventDefault();
  var cityName = cityInputEl.val();
  console.log(cityName);
  setStorage(cityName);
  getCityDetail(cityName);
}

function setStorage(input) {
  searchHistoryArray.push(input);
  localStorage.setItem("citySearch", JSON.stringify(searchHistoryArray));
  renderButtons();
}

function renderButtons() {
  searchContainer.empty();
  for (let I = 0; I < searchHistoryArray.length; I++) {
    var button = document.createElement("button");
    button.textContent = searchHistoryArray[I];
    searchContainer.append(button);
  }
}

function getCityStorage() {
  var cityButton = localStorage.getItem("citySearch");

  if (cityButton) {
    searchHistoryArray = JSON.parse(cityButton);
  }
  renderButtons();
}

getCityStorage();

searchCityFormEl.on("submit", citySearch);
