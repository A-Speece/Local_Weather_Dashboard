//Global Variables
var searchCityFormEl = $("#search-form");
var cityInputEl = $("#search-input");
var currentCity = $("#current-city");
var currentTemp = $("#current-temp");
var currentWind = $("#current-wind");
var currentHumidity = $("#current-humidity");
let today = new Date().toLocaleDateString();

var apiKey = "23ac2568a81ce4969e4c7f31ad40c4ed";
var searchHistoryArray = [];
var searchContainer = $(".search-container");
var forcastContainer = $("#forcastContainer");
var currentCityIcon = document.getElementById("weather-icon");

//Function to get City detail and use the
function getCityDetail(cityName) {
  fetch(
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
      cityName +
      "&limit=1&appid=" +
      apiKey
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      getCityWeather(data[0].lat, data[0].lon);
      getCurrentWeather(data[0].lat, data[0].lon);
    });
}

//function used to get the create the 5 day forcast
function getCityWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      var contents = "";
      for (let index = 7; index < data.list.length; index += 8) {
        var rowData = data.list[index];

        contents += `<div class="card" style="width: 12rem">
        <h3>${rowData.dt_txt.substr(0, 10)}</h3>
        <img src="https://openweathermap.org/img/wn/${
          rowData.weather[0].icon
        }@2x.png">
        
        <h5>Temp: ${rowData.main.temp} \xB0F</h5>
        <p class="card-text"></p>
        <h5>Wind: ${rowData.wind.speed} MPH</h5>
        <p class="card-text"></p>
        <h5>Humidity: ${rowData.main.humidity}%</h5>
      </div>`;
      }
      forcastContainer.html(contents);
    });
}
//function to get the current day city weather
function getCurrentWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      currentCity = currentCity.text(data.name + " " + "(" + today + ")");
      currentCityIcon.style.display = "flex";
      currentCityIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      currentTemp = currentTemp.text("Temp: " + data.main.temp + "\xB0F");
      currentWind = currentWind.text("Wind: " + data.wind.speed + " MPH");
      currentHumidity = currentHumidity.text(
        "Humidity: " + data.main.humidity + "%"
      );
    });
}
// functions used to store and get the city values from the user input
function citySearch(event) {
  event.preventDefault();
  var cityName = cityInputEl.val();

  setStorage(cityName);
  getCityDetail(cityName);
}

function cityHistory(event) {
  var cityName = event.target.textContent;

  getCityDetail(cityName);
}

function setStorage(input) {
  var exists = searchHistoryArray.includes(input);
  if (!exists) {
    searchHistoryArray.push(input);
    localStorage.setItem("citySearch", JSON.stringify(searchHistoryArray));
    renderButtons();
  }
}
// funcstion to create the buttons from previous used cities
function renderButtons() {
  searchContainer.empty();
  for (let I = 0; I < searchHistoryArray.length; I++) {
    var button = document.createElement("button");
    button.textContent = searchHistoryArray[I];
    button.addEventListener("click", cityHistory);
    searchContainer.append(button);
  }
}
// funcstion and call to get the user city inputs from local storage
function getCityStorage() {
  var cityButton = localStorage.getItem("citySearch");

  if (cityButton) {
    var cityArray = JSON.parse(cityButton);
    var citySet = new Set(cityArray);
    searchHistoryArray = [...citySet];
  }
  renderButtons();
}

getCityStorage();
// call to display the current and five day forcast on user submit
searchCityFormEl.on("submit", citySearch);
