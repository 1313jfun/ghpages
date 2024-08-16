import React, { useState, useEffect } from "react";
import "./FishingTool.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMoonPhase, moonPhaseDescription, moonPhaseEmoji } from "./MoonPhaseCalc.js";
import {
  fetchWeatherData,
  fetchHourlyWeatherData,
  getLocationName,
  searchLocation,
  fetchObservations,
  fetchAlertsForArea,
  fetchZoneFromPoint
} from "./FishingAPI.js";
import { convertTimeStampToUSFormat, convertAirPressureFromPascalToInHg } from "./FishingUtil.js";

function FishingTool() {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyWeatherData, setHourlyWeatherData] = useState(null);
  const [observationData, setObservationData] = useState(null);
  const [userZone, setUserZone] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const [pressureData, setPressureData] = useState([]);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [locationName, setLocationName] = useState("");
  const [stateName, setStateName] = useState("");
  const [locationError, setLocationError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const apiKey = process.env.REACT_APP_GEOLOCATE_API_KEY;

  const closeRuleModal = () => {
    setIsRuleModalOpen(false);
  };

  const openRuleCreateModal = () => {
    if (!isRuleModalOpen) setIsRuleModalOpen(true);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); // Toggle the expansion state
  };

  const today = new Date();
  const phase = getMoonPhase(today);
  const moonDescription = moonPhaseDescription(phase);
  const moonDescriptionEmoji = moonPhaseEmoji(phase);

  const handleWeeklyClick = (startTime) => {
    const timestamp = new Date(startTime).getTime();
    const targetElement = document.getElementById(`hourly-${timestamp}`);
  
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth", // Smooth scrolling effect
        block: "start", // Aligns the element at the top of the view (vertical alignment)
        inline: "start", // Aligns the element to the left side of the view (horizontal alignment)
      });
    }
  };

  const timeOptions = {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log(location);
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
      getLocationName(location.latitude, location.longitude, apiKey)
        .then((data) => {
          if (data && data.address) {
            setLocationName(
              data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.hamlet ||
                "Unknown location"
            );
            setStateName(data.address.state || "Unknown state");
          } else {
            setLocationName("Unknown location");
            setStateName("Unknown state");
          }
          console.log(location);
        })
        .catch((error) => {
          setLocationError("Error fetching location name");
          console.error("Error fetching location name:", error);
        });

      fetchWeatherData(location.latitude, location.longitude)
        .then((data) => setWeatherData(data))
        .catch((error) => setError(error));

      fetchHourlyWeatherData(location.latitude, location.longitude)
        .then((data) => setHourlyWeatherData(data))
        .catch((error) => setError(error));

      fetchObservations(location.latitude, location.longitude)
        .then((data) => setObservationData(data))
        .catch((error) => setError(error));

      fetchAlertsForArea(location.latitude, location.longitude)
        .then((data) => setAlertData(data))
        .catch((error) => setError(error));

      fetchZoneFromPoint(location.latitude, location.longitude)
        .then((data) => setUserZone(data))
        .catch((error) => setError(error));


    }
  }, [location]);

  const handleSearch = (event) => {
    event.preventDefault();
    searchLocation(searchQuery, apiKey)
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setLocation({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          });
        } else {
          setLocationError("Location not found");
        }
      })
      .catch((error) => {
        setLocationError("Error fetching location data");
        console.error("Error fetching location data:", error);
      });
  };

  return (
    <div className="fishing-tool">
      <h1>Fishing/Weather Assistant</h1>
      <br />
      <button onClick={openRuleCreateModal} className="btn btn-secondary">
        What is this?
      </button>
      {isRuleModalOpen && (
        <div className="modal d-block">
          <span className="close" onClick={closeRuleModal}>
            &times;
          </span>
          <br />
          <br />
          <br />
          <p>
            This is a weather app that currently uses NOAA's API and GeoLocate's
            API to display weather data for fishermen. It also displays the current moon
            phase as well as future moon phases.
          </p>
          <p>
            This section will ask for the device's current location, which can
            be declined.
          </p>
          <p>
            Regardless, you can use the search form below to search for a
            town/city, click on the search button, and it should display a
            weekly and hourly forecast for the town once it loads.
          </p>
          <p>
            Currently trying to add a calculation based on the
            data provided for what would make a good fishing day.
          </p>
        </div>
      )}
      <br />
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter town/city"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
      {locationName && (
        <p>
          Current location: {locationName}, {stateName}
        </p>
      )}
      {alertData && alertData.features ? (
    <div>
      <br />
      <br />
      <div className="alert-grid">
        {alertData.features.slice(0, 1).map((feature, index) => {
          const affectedZones = feature.properties.geocode.UGC; // List of affected zones
          console.log('affected zones: ' + affectedZones);
          // Check if the current zone is in the affected list
          const isZoneAffected = affectedZones.includes(userZone);

          return (
            <div
              className="alert-item"
              key={index}
              style={{
                backgroundColor: isZoneAffected ? "red" : "transparent",
              }}
            >
              <h2>Current Weather Advisory for: {stateName}</h2>
        
              {/* Clickable button or area to expand/collapse */}
              <button onClick={toggleExpand} className="btn btn-warning">
                {isExpanded ? "Hide Details" : "Show Details"}
              </button>
        
              {/* Conditionally render the advisory description based on the isExpanded state */}
              {isExpanded && (
                <div>
                  <p>{feature.properties.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <p>Loading Alert Data...</p>
  )}
  <br/>
  <h3>Current Moon phase:</h3>
  <br/>
  <h2>{moonDescription}</h2>
  <h1>{moonDescriptionEmoji}</h1>
  {weatherData ? (
  <div>
    <br />
    <br />
    <h2>
      Weekly Forecast for {locationName}, {stateName}
    </h2>
    <div className="weather-grid">
      {weatherData.properties.periods.slice(0, 14).map((period, index) => {
        // Calculate the moon phase for the specific date of each weather period
        const periodDate = new Date(period.startTime);
        const moonPhaseForDate = getMoonPhase(periodDate);  // Use the date to calculate moon phase
        const moonPhaseEmji = moonPhaseEmoji(moonPhaseForDate);  // Get the moon phase emoji

        // Extract numbers from the windSpeed string (e.g., "5 to 15 mph")
        const windSpeedNumbers = period.windSpeed.match(/\d+/g); // Extracts all numbers as an array
        const isWindSpeedHigh = windSpeedNumbers.some((num) => parseInt(num) >= 15); // Check if any number is 15 or greater

        return (
          <div
            className={`weather-item ${!period.isDaytime ? 'nighttime' : ''}`} // Apply 'nighttime' class if not daytime
            key={index}
            onClick={() => handleWeeklyClick(period.startTime)} // Clickable element
            style={{ cursor: "pointer" }} // Makes it look clickable
          > 
            <p>{period.name}</p>
            <p>{convertTimeStampToUSFormat(period.startTime)}</p>
            <p><img src={period.icon} className="weather-icon" alt="weather icon" /></p>
            <p>{period.shortForecast}</p>
            <p>{period.temperature}&#176;{period.temperatureUnit}</p>
            <p>
              Probability of Precipitation:&nbsp;
              {period.probabilityOfPrecipitation.value === 0 ||
              period.probabilityOfPrecipitation.value === "" ||
              period.probabilityOfPrecipitation.value === null
                ? 0
                : period.probabilityOfPrecipitation.value}
              &#37;
            </p>
            {/* Conditionally apply bold styling to wind speed if it contains 15 or more */}
            <p className={isWindSpeedHigh ? 'bold-wind' : ''}>
              Wind Speed: {period.windSpeed}
            </p>
            <p>Wind Direction: {period.windDirection}</p>
            {/* Display the moon phase in a separate row for nighttime */}
            {!period.isDaytime && (
              <div className="moon-phase-row">
                <p>Moon Phase: </p>
                <h2>{moonPhaseEmji}</h2>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
) : (
  <p>Loading Weather Data...</p>
)}

{hourlyWeatherData ? (
  <div>
    <br />
    <br />
    <br />
    <br />
    <h2>
      24-Hour Weather Forecast for {locationName}, {stateName}
    </h2>
    <div className="hourly-weather-grid">
      {hourlyWeatherData.properties.periods.slice(0, 156).map((period, index) => {
        const startTime = new Date(period.startTime);
        const formattedTime = startTime.toLocaleTimeString("en-US", timeOptions);

        // Extract numbers from the windSpeed string (e.g., "5 to 15 mph")
        const windSpeedNumbers = period.windSpeed.match(/\d+/g); // Extract all numbers as an array
        const isWindSpeedHigh = windSpeedNumbers.some((num) => parseInt(num) >= 15); // Check if any number is 15 or greater

        return (
          <div
            className={`hourly-weather-item ${!period.isDaytime ? 'nighttime' : ''}`} // Apply 'nighttime' class if not daytime
            key={index}
            id={`hourly-${startTime.getTime()}`} // Unique ID based on timestamp
          >
            <p>{formattedTime}</p>
            <p>{period.isDaytime ? "Day" : "Night"}</p>
            <p><img src={period.icon} className="weather-icon" alt="weather icon" /></p>
            <p>{period.shortForecast}</p>
            <p>{period.temperature}&#176;{period.temperatureUnit}</p>
            <p>
              Probability of Precipitation:&nbsp;
              {period.probabilityOfPrecipitation.value === 0 ||
              period.probabilityOfPrecipitation.value === "" ||
              period.probabilityOfPrecipitation.value === null
                ? 0
                : period.probabilityOfPrecipitation.value}
              &#37;
            </p>
            <p>Humidity: {period.relativeHumidity.value}&#37;</p>
            {/* Apply bold styling to wind speed if it contains 15 or more */}
            <p className={isWindSpeedHigh ? 'bold-wind' : ''}>
              Wind Speed: {period.windSpeed}
            </p>
            <p>Wind Direction: {period.windDirection}</p>
          </div>
        );
      })}
    </div>
  </div>
) : (
  <p>Loading Hourly Weather Data...</p>
)}
{observationData && observationData.features ? (
  <div>
    <br />
    <br />
    <h2>Historical Barometric Data for {locationName}, {stateName}</h2>

    {/* Prepare data for the chart */}
    {observationData.features.length > 0 && (
      <>
        {/* Extract and reverse the data for Recharts */}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={observationData.features.slice(0, 192).map((feature) => ({
              timestamp: new Date(feature.properties.timestamp).toLocaleTimeString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }),
              pressure: feature.properties.barometricPressure
                ? convertAirPressureFromPascalToInHg(feature.properties.barometricPressure.value)
                : null,
            })).reverse()}  
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis 
              domain={['dataMin - 0.25', 'dataMax + 0.25']}  // Zooming in on the range of data
            />
            {/* Customizing Tooltip */}
    <Tooltip
      formatter={(value, name, props) => [
        `Pressure at ${props.payload.timestamp}`, // Display timestamp in the tooltip
        `${value} inHg`, // Display pressure with units
      ]}
    />
            <Legend />
            <Line type="monotone" dataKey="pressure" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </>
    )}
  </div>
) : (
  <p>Loading Barometric Data...</p>
)}
  <br/><br/><br/><br/></div>
  );
}

export default FishingTool;
