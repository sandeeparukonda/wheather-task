import React, { useState, useEffect } from "react";
import "./styles.css";

const apiKey = "3c7fb8b3c52dc38c3790da93d6aba078";

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchWeatherData(city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(apiURL);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  }

  function handleFavoriteClick(city) {
    fetchWeatherData(city);
    setShowFavorites(false);
  }

  function handleAddFavorite(city) {
    if (!favoriteCities.includes(city)) {
      setFavoriteCities([...favoriteCities, city]);
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    if (searchTerm) {
      fetchWeatherData(searchTerm);
      setSearchTerm("");
    }
  }

  useEffect(() => {
    function getLocation() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }

    async function fetchData() {
      try {
        const position = await getLocation();
        const { latitude, longitude } = position.coords;

        const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        const response = await fetch(apiURL);
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data: ", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <div>
        <iframe
          src="https://embed.lottiefiles.com/animation/102873"
          title="sky"
        ></iframe>
      </div>
      <div className="back">
        {weatherData ? (
          <div>
            <h2 className="currentTemp">
              Current Weather in {weatherData.name}
            </h2>
            <p>
              Temperature:{" "}
              {weatherData.main && weatherData.main.temp
                ? `${weatherData.main.temp} °C`
                : "N/A"}
            </p>
            <p>
              Humidity:{" "}
              {weatherData.main && weatherData.main.humidity
                ? `${weatherData.main.humidity}%`
                : "N/A"}
            </p>
            <p>
              Weather Condition:{" "}
              {weatherData.weather &&
              weatherData.weather[0] &&
              weatherData.weather[0].description
                ? weatherData.weather[0].description
                : "N/A"}
            </p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter city name"
          className="spacing border"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button className="border" type="submit">
          Search
        </button>
      </form>
      <br />

      <button
        className="spacing border"
        onClick={() => handleAddFavorite(weatherData.name)}
      >
        Add to Favorites
      </button>
      <button
        className="border"
        onClick={() => setShowFavorites(!showFavorites)}
      >
        Show Favorites
      </button>
      {showFavorites && (
        <div>
          <ul>
            {favoriteCities.map((city) => (
              <li key={city}>
                <button
                  className="citiesFav"
                  onClick={() => handleFavoriteClick(city)}
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Weather;