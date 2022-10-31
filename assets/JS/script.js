var searchCity = document.getElementById('search');
var forecastHistory = document.querySelector('#history');
var forecastWeather = document.querySelector('#forecastContainer');
var currentWeather = document.querySelector('#currentContainer');
var historyContainer = document.querySelector('.historyContainer');
var apiKey = "47f166773e351368285402b79068ea73";
var geoKey = "c07a497972e4c2143988d8729440d005";
var geoApi = "http://api.openweathermap.org/geo/1.0/direct?appid=" + geoKey + "&limit=1&q=";
var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?units=metric&exclude=minutely,hourly,alerts&appid=" + apiKey;
var cities = [];

// Runs on site load to check if there are cities stored in Local
function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
  
    if (storedCities !== null) {
      cities = storedCities;
    }

    showHistory();
};

function storeCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
};

// Displays each city stored in local storage as a button
function showHistory() {
    console.log(cities);
    forecastHistory.innerHTML = "";

    for (var i = 0; i < cities.length; i++) {
        var previousCity = cities[i];
    
        var button = document.createElement("button");
        button.classList.add('btn');
        button.classList.add('reload');
        button.classList.add('btn-secondary');
        button.classList.add('col-md-12');
        button.setAttribute("type", button);
        button.textContent = previousCity;
        
        forecastHistory.append(button);
      };
};

// Use geo api to convert city name to latitude and longitude
function getLocation(city) {
    fetch(geoApi + city)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data[0].lon);
        console.log(data[0].lat);
        getWeather(data);
    })
};

// Uses latitude and longitude and inputs it into the weather api
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
        displayForecast(data);
    })
};


// Displays todays weather 
function displayWeather(results) {
    currentWeather.innerHTML = "<h2>Current Weather:<h2>";
    console.log(results.current);

    let icon = (src ='http://openweathermap.org/img/wn/' + ((results.current.weather[0].icon) + ".png"));
    let temp = (results.current.temp);
    let windSpeed = (results.current.wind_speed);
    let humidity = (results.current.humidity);
    let uvi = (results.current.uvi);
    let today = city.value + ("   (" + moment().format("DD/MM/YYYY") + ")");

    let date = document.createElement('div');
    let div = document.createElement('div');
    let div2 = '';
    let img = document.createElement('img');
    date.classList.add('fs-4');
    div.classList.add('fs-5');

    if(uvi <= 3) {
        div2 = `<div style='background: rgb(0, 255, 98); width: 50px; text-align: center; border-radius: 10px'>${uvi}</div>`;
    } else if(uvi >= 8) {
        div2 = `<div style='background: rgb(255, 87, 87); width: 50px; text-align: center; border-radius: 10px'>${uvi}</div>`;
    } else {
        div2 = `<div style='background: rgb(255, 187, 0); width: 50px; text-align: center; border-radius: 10px'>${uvi}</div>`;
    };

    console.log(uvi);
    div2.innerHTML = uvi;
    img.src = icon;
    date.innerHTML = today;
    div.innerHTML = 
        "Temp: " + temp + "°C<br>" +
        "Wind Speed: " + windSpeed + "km/hr<br>" +
        "Humidity: " + humidity + "%<br>" +
        "UV index: " + div2 + "<br>";

    date.append(img);
    currentWeather.append(date);
    currentWeather.append(div);
};

// Displays the weather data for each on the next 5 days
function displayForecast(results) {
    forecastWeather.innerHTML = "<h3>5-Day Forecast:<h3>";
    console.log(results.daily);

    var outerContainer = document.createElement('div');
    outerContainer.classList.add('container');

    for (var i = 0; i < 5; i++) {
        let icon = (src ='http://openweathermap.org/img/wn/' + ((results.daily[i].weather[0].icon) + ".png"));
        let temp = results.daily[i].temp.day;
        let windSpeed = results.daily[i].wind_speed;
        let humidity = results.daily[i].humidity;
        let day = moment().add((i+1),'days').format("DD/MM/YYYY");

        let container = document.createElement('div');
        let date = document.createElement('div');
        let div = document.createElement('div');
        let img = document.createElement('img');
        container.classList.add('forecastContainer');
        container.classList.add('row-cols-2');
        container.classList.add('row');
        date.classList.add('col');
        div.classList.add('col');

        img.src = icon;
        date.innerHTML = day;
        div.innerHTML = 
        "Temp: " + temp + "°C<br>" +
        "Wind Speed: " + windSpeed + "km/hr<br>" +
        "Humidity: " + humidity + "%<br>";

        date.append(img);
        container.append(date);
        container.append(div);
        outerContainer.append(container);
    };
    forecastWeather.append(outerContainer);
};

// Uses value of user input to check if it's been searched for already then input it into geo location
searchCity.addEventListener('click', function(event) {
    event.preventDefault();
    console.log("click");
    let city = document.querySelector('#city').value.trim();

    if (city === "") {
        return;
      } else if (cities.includes(city)) {
        getLocation(city);
        storeCities();
        showHistory();
      } else {
        cities.push(city);
        getLocation(city);
        storeCities();
        showHistory();
      };
});

// When user selects a button from previous searches, it searches for it again
historyContainer.addEventListener('click', function(event) {
    event.preventDefault();
    console.log(event.target.innerHTML);

    let city = event.target.innerHTML;

    getLocation(city);
});

init();