import React, { useState, useEffect } from "react";
import "./FishingTool.css";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

function FishingTool() {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyWeatherData, setHourlyWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationName, setLocationName] = useState('');
  const [stateName, setStateName] = useState('');
  const [locationError, setLocationError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);

  const apiKey = process.env.REACT_APP_GEOLOCATE_API_KEY
  
  console.log(apiKey);

  const closeRuleModal = () => {
    setIsRuleModalOpen(false);
  };

  const openRuleCreateModal = () => {
    if (!isRuleModalOpen) setIsRuleModalOpen(true);
  };

  const today = new Date();
  const stringToday = today.toString();
  const phase = getMoonPhase(today);
  const moonDescription = moonPhaseDescription(phase);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError(error.message);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      getLocationName(location);
      fetchWeatherData(location);
      fetchHourlyWeatherData(location);
    }
  }, [location]);

  const handleSearch = (event) => {
    setTimeout(() => {
    event.preventDefault();
    fetch(`/api/search?q=${searchQuery}&api_key=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setLocation({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          });
          getLocationName(location);
        } else {
          setLocationError("Location not found");
        }
      })
      .catch((error) => {
        setLocationError("Error fetching location data");
        console.error("Error fetching location data:", error);
      });
    }, 1000); // Delay of 1000 milliseconds (1 second)
  };

  const getLocationName = (location) => {
    fetch(`https://geocode.maps.co/reverse?lat=${location.latitude}&lon=${location.longitude}&api_key=${apiKey}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.address) {
          setLocationName(data.address.city || data.address.town || data.address.village || data.address.hamlet || 'Unknown location');
          setStateName(data.address.state || 'Unknown state');
        } else {
          setLocationName('Unknown location');
          setStateName('Unknown state');
        }
      })
      .catch(error => {
        setLocationError('Error fetching location name');
        console.error('Error fetching location name:', error);
      });
  };

  const fetchWeatherData = (location) => {
    fetch(`https://api.weather.gov/points/${location.latitude},${location.longitude}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const { cwa, gridX, gridY } = data.properties;
        return fetch(`https://api.weather.gov/gridpoints/${cwa}/${gridX},${gridY}/forecast`);
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setWeatherData(data);
      })
      .catch((error) => {
        setError(error);
        console.error("Error fetching the weather data:", error);
      });
  };

  const fetchHourlyWeatherData = (location) => {
    fetch(`https://api.weather.gov/points/${location.latitude},${location.longitude}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const { cwa, gridX, gridY } = data.properties;
        return fetch(`https://api.weather.gov/gridpoints/${cwa}/${gridX},${gridY}/forecast/hourly`);
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setHourlyWeatherData(data);
      })
      .catch((error) => {
        setError(error);
        console.error("Error fetching the weather data:", error);
      });
  };

  function getMoonPhase(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-11
    const day = date.getDate();

    // Adjust months so that March is 1 and February is 12
    const adjustedMonth = month < 3 ? month + 12 : month;
    const adjustedYear = month < 3 ? year - 1 : year;

    const k1 = Math.floor(365.25 * (adjustedYear + 4712));
    const k2 = Math.floor(30.6 * (adjustedMonth + 1));
    const k3 = Math.floor(Math.floor(adjustedYear / 100 + 49) * 0.75) - 38;

    // Leap year correction
    const isLeapYear =
      (adjustedYear % 4 === 0 && adjustedYear % 100 !== 0) ||
      adjustedYear % 400 === 0;
    const leapCorrection = isLeapYear && adjustedMonth < 3 ? -1 : 0;

    const julianDay = k1 + k2 + k3 + day + 59 + leapCorrection;
    const moonPhase = ((julianDay - 2451550.1) / 29.53058867) % 1;

    return Math.floor(moonPhase * 8 + 0.5) % 8;
  }

  function moonPhaseDescription(phase) {
    switch (phase) {
      case 0:
        return "New Moon";
      case 1:
        return "Waxing Crescent";
      case 2:
        return "First Quarter";
      case 3:
        return "Waxing Gibbous";
      case 4:
        return "Full Moon";
      case 5:
        return "Waning Gibbous";
      case 6:
        return "Last Quarter";
      case 7:
        return "Waning Crescent";
      default:
        return "Unknown phase";
    }
  }

  return (
    <div className="fishing-tool">
      <h1>Fishing and Weather App</h1>
      <br></br>
      {/*<p>{stringToday}</p>*/}
      <br></br>
      <button onClick={openRuleCreateModal} className="btn btn-secondary">
        What is this?
      </button>
      {isRuleModalOpen && (
        <div className="modal d-block">
                    <span className="close" onClick={closeRuleModal}>
              &times;
            </span>
            <br></br>
            <br></br>
            <br></br>
          <p>This is a weather app that currently uses NOAA's API and GeoLocate's API to display weather data for fishermen. It also displays the moon phase as well.</p>
          <p>This section will ask for device's current location, which can be declined.</p>
          <p>Regardless, you can use the search form below to search for a town/city, click on the search button, and it should display a weekly and hourly forecast for the town once it loads.</p>
          <p>Currently trying to get more data from the API to allow for Barometric support, as well as adding a calculation based on the data provided for what would make a good fishing day.</p>
        </div>
      )}
      <br></br>
      <p>Moon phase: {moonDescription}</p>
      {/*{locationError && <p>Error getting location: {locationError}</p>}*/}
      {/*{error && <p>Error fetching weather data: {error.message}</p>}*/}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter town/city"
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      {locationName && <p>Current location: {locationName}, {stateName}</p>}
      {weatherData ? (
        <div>
          <br></br>
          <br></br>
          <h2>Weekly Forecast for {locationName}, {stateName}</h2>
          <Carousel showArrows={true} infiniteLoop={false} showThumbs={false} showStatus={false}>
            {weatherData.properties.periods.slice(0, 14).map((period, index) => (
              <div key={index}>
                <p>{period.name}</p>
                <p>{period.shortForecast}</p>
                <p>{period.temperature}&#176;{period.temperatureUnit}</p>
                <p>
                  Probability of Precipitation:&nbsp; 
                  {period.probabilityOfPrecipitation.value === 0 || period.probabilityOfPrecipitation.value === "" || period.probabilityOfPrecipitation.value === null ? 0 : period.probabilityOfPrecipitation.value}
                  &#37;
                </p>
                <p>Wind Speed: {period.windSpeed}</p>
                <p>Wind Direction: {period.windDirection}</p>
                <br></br>
                <br></br>
              </div>
            ))}
          </Carousel>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
      {hourlyWeatherData ? (
        <div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <h2>24-Hour Weather Forecast for {locationName}, {stateName}</h2>
          <Carousel showArrows={true} infiniteLoop={false} showThumbs={false} showStatus={false}>
            {hourlyWeatherData.properties.periods.slice(0, 25).map((period, index) => {
              const startTime = new Date(period.startTime);
              const formattedTime = startTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
              });
              return (
              <div key={index}>
                <p>{formattedTime}</p>
                <p>{period.isDaytime}</p>
                <p>{period.shortForecast}</p>
                <p>{period.temperature}&#176;{period.temperatureUnit}</p>
                <p>
                  Probability of Precipitation:&nbsp; 
                  {period.probabilityOfPrecipitation.value === 0 || period.probabilityOfPrecipitation.value === "" || period.probabilityOfPrecipitation.value === null ? 0 : period.probabilityOfPrecipitation.value}
                  &#37;
                </p>
                <p>Humidity {period.relativeHumidity.value}&#37;</p>
                <p>Wind Direction: {period.windDirection}</p>
                <br></br>
                <br></br>
              </div>
            )})}
          </Carousel>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}

export default FishingTool;
