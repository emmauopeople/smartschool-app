const regionSelect = document.getElementById('region-select');
const weatherInfo = document.getElementById('weather-info');
const weatherDetails = document.getElementById('weather-details');
const weatherRecommendation = document.getElementById('weather-recommendation');
const weatherIcon = document.getElementById('weather-icon');

const regionCities = {
  "Adamawa": "Ngaoundéré",
  "Centre": "Yaoundé",
  "East": "Bertoua",
  "Far North": "Maroua",
  "Littoral": "Douala",
  "North": "Garoua",
  "Northwest": "Bamenda",
  "South": "Ebolowa",
  "Southwest": "Buea",
  "West": "Bafoussam"
};

// Default on page load: Yaoundé
fetchWeather("Yaoundé");

// Listen for region selection
regionSelect.addEventListener("change", () => {
  const selected = regionSelect.value;
  if (regionCities[selected]) {
    fetchWeather(regionCities[selected]);
  }
});

async function fetchWeather(city) {
  const apiKey = "cbf78d4e3f8d8859cf3a2ef2957f39df";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const temp = data.main.temp;
    const wind = data.wind.speed;
    const visibility = data.visibility / 1000;
    const rain = data.rain ? data.rain["1h"] || 0 : 0;
    const condition = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    weatherInfo.textContent = `${city}: ${temp}°C — ${condition}`;
    weatherDetails.innerHTML = `
      🌬️ Wind: ${wind} m/s<br>
      🌧️ Rain: ${rain} mm<br>
      👁️ Visibility: ${visibility} km
    `;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    if (temp < 20) {
      weatherRecommendation.textContent = "It’s chilly—consider a sweater!";
    } else if (temp > 30) {
      weatherRecommendation.textContent = "It’s hot—stay hydrated!";
    } else {
      weatherRecommendation.textContent = "Perfect weather for learning!";
    }
  } catch (error) {
    weatherInfo.textContent = "Unable to fetch weather.";
    weatherDetails.textContent = "";
    weatherRecommendation.textContent = "";
    weatherIcon.src = "";
  }
}
