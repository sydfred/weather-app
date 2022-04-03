//time
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let day = days[now.getDay()];

let hours = [
  "12",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
];
let hour = hours[now.getHours()];

let minutes = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
];
let minute = minutes[now.getMinutes()];

let date = document.querySelector(".date");
date.innerHTML = `${day} ${hour}:${minute}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
//location

function logLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}&units=${units}`;
  axios.get(url).then(updateWeather);
}
function updateCurrentDetails() {
  navigator.geolocation.getCurrentPosition(logLocation);
}
function titleCase(input) {
  input = input.toLowerCase().split(" ");
  for (let index = 0; index < input.length; index++) {
    input[index] = input[index].charAt(0).toUpperCase() + input[index].slice(1);
  }
  return input.join(" ");
}

function getForecast(coordinates) {
  let apiKey = "cedf9c77bb47c88f8069170815609200";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function updateWeather(response) {
  document.querySelector("#city").innerHTML = titleCase(response.data.name);
  document.querySelector(".sky").innerHTML = titleCase(
    response.data.weather[0].description
  );
  fahrenheitTemp = response.data.main.temp;
  document.querySelector("#temp").innerHTML = Math.round(fahrenheitTemp);
  document.querySelector(".feels").innerHTML = Math.round(
    response.data.main.feels_like
  );

  document.querySelector(".humidity").innerHTML = Math.round(
    response.data.main.humidity
  );
  document.querySelector(".wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("#high").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#low").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#icon")
    .setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function submitCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  cityInput.innerHTML = `${cityInput.value}`;
  let city = cityInput.value.trim().toLowerCase();
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=${units}`;
  if (city.value !== "") {
    axios.get(apiUrl).then(updateWeather);
    cityInput.value = "";
  }
}
//forecast
function displayForecast(response) {
  console.log(response.data.daily);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector(".ahead");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2" >

            <div class="card">
              <div class="card-body">
                <h5 id = date-1 class="card-title">${formatDay(
                  forecastDay.dt
                )}</h5>
                <center>
                  <img id = "day-1" src="https://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }.png" alt="" class="center">
                </center>
                <p class="card-text"><span class="weather-forecast-max"> ${Math.round(
                  forecastDay.temp.max
                )}°</span> | <span class="weather-forecast-min"> ${Math.round(
          forecastDay.temp.min
        )}°</span> </p>
              </div>
            </div>
           
          </div>
         
          `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

//unit conversion
function showCelcius(event) {
  event.preventDefault();
  celciusLink.classList.add("active");
  farLink.classList.remove("active");
  let celciusTemperature = (fahrenheitTemp - 32) * (5 / 9);

  document.querySelector("#temp").innerHTML = Math.round(celciusTemperature);
}
function showFar(event) {
  event.preventDefault();
  celciusLink.classList.remove("active");
  farLink.classList.add("active");
  document.querySelector("#temp").innerHTML = Math.round(fahrenheitTemp);
}

let celciusLink = document.querySelector("#celcius-link");
if (celciusLink) {
  celciusLink.addEventListener("click", showCelcius);
}
let farLink = document.querySelector("#fahrenheit-link");
if (farLink) {
  farLink.addEventListener("click", showFar);
}

let fahrenheitTemp = null;

//search functions

let searchCity = document.querySelector("#search-city");
searchCity.addEventListener("submit", submitCity);

let currentLocation = document.querySelector("#current-location");
if (currentLocation) {
  currentLocation.addEventListener("click", logLocation);
}
updateCurrentDetails();
let units = "imperial";
let key = "cedf9c77bb47c88f8069170815609200";

function search(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=${units}`;
  if (city.value !== "") {
    axios.get(apiUrl).then(updateWeather);
  }
}
search("Atlanta");
