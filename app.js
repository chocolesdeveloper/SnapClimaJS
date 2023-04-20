const citySearchInput = document.querySelector("#city-search-bar")
const citySearchButton = document.querySelector("#city-search-button")
const currentDate = document.querySelector("#current-date")
const cityName = document.querySelector("#city-name")
const weatherIcon = document.querySelector("#weather-icon")
const weatherDescription = document.querySelector("#weather-description")
const currentTemperature = document.querySelector("#current-temperature")
const windSpeed = document.querySelector("#wind-speed")
const feelsLikeTemperature = document.querySelector("#feels-like-temperature")
const currenteHumidity = document.querySelector("#current-humidity")
const sunriseTime = document.querySelector("#sunrise-time")
const sunsetTime = document.querySelector("#sunset-time")

const api_key = "54ac8622bf008a0281f5fac723b3b8f5"

citySearchButton.addEventListener("click", () => {
  let cityName = citySearchInput.value
  getCityWeather(cityName)
})

navigator.geolocation.getCurrentPosition(
  (position) => {
    let lat = position.coords.latitude
    let lon = position.coords.longitude

    getCurrentLocationWeather(lat, lon)
  },
  (err) => {
    if (err.code === 1) {
      alert(
        "Parece que você não deixou buscarmos sua localização, mas você pode buscar manualmente!"
      )
    } else {
      console.log(err)
    }
  }
)

function getCurrentLocationWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${api_key}`
  )
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      displayWeather(data)
    })
    .catch((err) => {
      console.log(err)
    })
}

function getCityWeather(cityName) {
  weatherIcon.src = "./assets/img/loading-icon.svg"

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${api_key}`
  )
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      displayWeather(data)
    })
}

function displayWeather(data) {
  citySearchInput.value = ""

  let {
    dt,
    name,
    weather: [{ icon, description }],
    main: { temp, feels_like, humidity },
    wind: { speed },
    sys: { sunrise, sunset },
  } = data

  currentDate.textContent = formatDate(dt)
  cityName.textContent = name
  weatherIcon.src = `./assets/img/${icon}.svg`
  weatherDescription.textContent = description
  currentTemperature.textContent = `${Math.round(temp)}°C`
  windSpeed.textContent = `${Math.round(speed * 3.6)}/km`
  feelsLikeTemperature.textContent = `${Math.round(feels_like)}°C`
  currenteHumidity.textContent = `${humidity}%`
  sunriseTime.textContent = formatTime(sunrise)
  sunsetTime.textContent = formatTime(sunset)
}

function formatDate(epochTime) {
  let date = new Date(epochTime * 1000)
  let formattedDate = date.toLocaleDateString("pt-br", {
    month: "long",
    day: "numeric",
  })
  return `Hoje, ${formattedDate}`
}

function formatTime(epochTime) {
  let date = new Date(epochTime * 1000)
  let hours = date.getHours()
  let minutes = date.getMinutes().toString().padStart(2, "0")

  return `${hours}:${minutes}`
}
