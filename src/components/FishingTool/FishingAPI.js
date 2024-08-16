export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const pointResponse = await fetch(
      `https://api.weather.gov/points/${latitude},${longitude}`
    );
    if (!pointResponse.ok) {
      throw new Error("Network response was not ok");
    }
    const pointData = await pointResponse.json();
    const { cwa, gridX, gridY } = pointData.properties;

    const forecastResponse = await fetch(
      `https://api.weather.gov/gridpoints/${cwa}/${gridX},${gridY}/forecast`
    );
    if (!forecastResponse.ok) {
      throw new Error("Network response was not ok");
    }
    return await forecastResponse.json();
  } catch (error) {
    console.error("Error fetching the weather data:", error);
    throw error;
  }
};

export const fetchHourlyWeatherData = async (latitude, longitude) => {
  try {
    const pointResponse = await fetch(
      `https://api.weather.gov/points/${latitude},${longitude}`
    );
    if (!pointResponse.ok) {
      throw new Error("Network response was not ok");
    }
    const pointData = await pointResponse.json();
    const { cwa, gridX, gridY } = pointData.properties;

    const hourlyForecastResponse = await fetch(
      `https://api.weather.gov/gridpoints/${cwa}/${gridX},${gridY}/forecast/hourly`
    );
    if (!hourlyForecastResponse.ok) {
      throw new Error("Network response was not ok");
    }
    return await hourlyForecastResponse.json();
  } catch (error) {
    console.error("Error fetching the hourly weather data:", error);
    throw error;
  }
};

export const fetchObservations = async (latitude, longitude) => {
  try {
    const pointResponse = await fetch(
      `https://api.weather.gov/points/${latitude},${longitude}`
    );
    if (!pointResponse.ok) {
      throw new Error("Network response was not ok");
    }
    
    const pointData = await pointResponse.json();
    const { forecastZone } = pointData.properties;
    console.log(String(forecastZone + ' zone url'));

    const zoneUrl = pointData.properties.forecastZone; // forecastZone URL like "https://api.weather.gov/zones/forecast/ILZ012",
    
    // Extract the county code (e.g., ILC089) from the URL
    const zoneId = zoneUrl.split("/").pop();

    const observationsResponse = await fetch(
      `https://api.weather.gov/zones/forecast/${zoneId}/observations`
    );
    if (!observationsResponse.ok) {
      throw new Error("Network response was not ok");
    }
    return await observationsResponse.json();
  } catch (error) {
    console.error("Error fetching the observation data:", error);
    throw error;
  }
};

export const fetchAlertsForArea = async (latitude, longitude) => {
  try {
    const pointResponse = await fetch(
      `https://api.weather.gov/points/${latitude},${longitude}`
    );
    if (!pointResponse.ok) {
      throw new Error("Network response was not ok");
    }
    
    const pointData = await pointResponse.json();
    const { state } = pointData.properties.relativeLocation.properties;
    console.log(String(state));

    const alertResponse = await fetch(
      `https://api.weather.gov/alerts/active/area/${state}`
    );
    if (!alertResponse.ok) {
      throw new Error("Network response was not ok");
    }
    return await alertResponse.json();
  } catch (error) {
    console.error("Error fetching the alert data:", error);
    throw error;
  }
};

export const fetchZoneFromPoint = async (latitude, longitude) => {
  try {
    const pointResponse = await fetch(
      `https://api.weather.gov/points/${latitude},${longitude}`
    );
    if (!pointResponse.ok) {
      throw new Error("Network response was not ok");
    }
    
    const pointData = await pointResponse.json();
    const { forecastZone } = pointData.properties;
    console.log(String(forecastZone + ' zone url'));

    const zoneUrl = pointData.properties.forecastZone; // forecastZone URL like "https://api.weather.gov/zones/forecast/ILZ012",
    
    // Extract the zone code from the URL
    const zoneId = zoneUrl.split("/").pop();
    console.log(String(zoneId + ' zone ID'));

    return zoneId; // Return user county
  } catch (error) {
    console.error("Error fetching the alert data:", error);
    throw error;
  }
};

export const getLocationName = async (latitude, longitude, apiKey) => {
  try {
    const response = await fetch(
      `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching location name:", error);
    throw error;
  }
};

export const searchLocation = async (query, apiKey) => {
  try {
    const response = await fetch(
      `https://geocode.maps.co/search?q=${query}&api_key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching location:", error);
    throw error;
  }
};
