function processData(wJson) {
  data = {};
  if (wJson.cod == 200) {
    data.city = wJson.name;
    data.country = wJson.sys.country;
    data.main = wJson.weather[0].main;
    data.temp = Math.round(wJson.main.temp);
    data.st = Math.round(wJson.main.feels_like);
    data.humidity = wJson.main.humidity;
    data.wind = Math.round(wJson.wind.speed);
    data.description = wJson.weather[0].description;
    data.cod = wJson.cod;
  }
  return data;
}

const spanError = document.querySelector(".error-msg");
const button = document.querySelector(".submit");
button.addEventListener("click", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
  searchCity();
}

async function requestWeather(city = "Cordoba") {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=b0187130499d5d8e40eb260f0bfc58cd`,
    { mode: "cors" }
  );
  if (response.status === 404) {
    throwError();
  } else {
    spanError.style.display = "none";
    const weatherJson = await response.json();
    const newData = processData(weatherJson);
    displayData(newData);
  }
}

function displayData(data) {
  const info = document.querySelector(".info");
  info.innerHTML = "";

  if (info.classList.contains("animate__pulse")) {
    info.classList.remove("animate__pulse");
    info.offsetWidth;
    info.classList.add("animate__pulse");
  } else {
    info.classList.add("animate__pulse");
  }

  const a = [
    `sensacion termica:   ${data.st} ºC`,
    `viento de:   ${data.wind} kmh`,
    `humedad del:   ${data.humidity}%`,
  ];

  const description = document.createElement("p");
  description.textContent = data.description;

  const city = document.createElement("h1");
  city.textContent = `${data.city}, ${data.country}`;

  const temp = document.createElement("span");
  temp.textContent = data.temp;
  temp.setAttribute("class", "degrees");

  info.append(description, city, temp);

  a.forEach((elem) => {
    const p = document.createElement("p");
    p.textContent = elem;
    info.appendChild(p);
  });

  changeBackground(data.main);
}

function searchCity() {
  const input = document.querySelector("#search");
  if(input.value)
    requestWeather(input.value);
}

function throwError() {
  spanError.style.display = "block";
}

function changeBackground(main) {
  const body = document.querySelector("body");
  if (main == "Clouds") {
    body.style.background =
      'url("./assets/few_clouds.jpg") no-repeat center fixed';
  } else if (main == "Snow") {
    body.style.background = 'url("./assets/snow.jpg") no-repeat center fixed';
  } else if (main == "Rain") {
    body.style.background = 'url("./assets/rain.jpg") no-repeat center fixed';
    body.style.backgroundSize = "cover";
  } else {
    body.style.background =
      'url("./assets/clear_sky.jpg") no-repeat center fixed';
  }
}

requestWeather();
