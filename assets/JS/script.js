var searchCity = document.getElementById('search');
// var clearCity = document.getElementById('city');
var history = document.querySelector('#history');
var forecast = document.querySelector('#forecastContainer');
var apiKey = "47f166773e351368285402b79068ea73";
var geoKey = "c07a497972e4c2143988d8729440d005";
var geoApi = "http://api.openweathermap.org/geo/1.0/direct?appid=" + geoKey + "&limit=1&q=";
var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?exclude=minutely,hourly,alerts&appid=" + apiKey;
var cities = [];

function getLocation(city) {
    fetch(geoApi + city)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        console.log(data[0].lon);
        console.log(data[0].lat);
        getWeather(data);
    })
};

function getWeather(results) {
    var long = '&lon=' + (results[0].lon);
    var lati = '&lat=' + (results[0].lat);
    fetch(weatherApi + long + lati)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        displayWeather(data);
    })
};

function displayWeather(results) {

};

searchCity.addEventListener('click', function(event) {
    event.preventDefault();
    console.log("click");
    var city = document.querySelector('#city').value.trim();

    if (city === "") {
        return;
      }
    
    cities.push(city);

    getLocation(city);
    storeCities();
    showHistory();
});

function showHistory() {
    console.log(cities);
    history.innerHTML = "";

    for (var i = 0; i < cities.length; i++) {
        var previousCity = cities[i];
        // localStorage.setItem(previousCity, city);
    
        var button = document.createElement("button");
        button.textContent = previousCity;
        
        history.append(button);
      }

};

function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
  }

function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
  
    if (storedCities !== null) {
      cities = storedCities;
    }

    showHistory();
  };

  init();