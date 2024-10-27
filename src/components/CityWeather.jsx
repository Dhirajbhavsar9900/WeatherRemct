import React, { useState } from "react";

const apiConfig = {
  apiKey: "7717ce4f9db1402b9ef193329242710",
  baseURL: "https://api.weatherapi.com/v1/",
};

const WeatherApp = () => {
  const [queryCity, setQueryCity] = useState("");
  const [cityWeatherList, setCityWeatherList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const defaultLocations = ["Mumbai", "Pune", "Dhule", "Nashik", "Malegaon"];

  const fetchCityWeather = async (city) => {
    setIsFetching(true);
    try {
      const response = await fetch(
        `${apiConfig.baseURL}current.json?key=${apiConfig.apiKey}&q=${city}`
      );
      if (!response.ok) throw new Error("City not found");
      const weatherData = await response.json();
      setCityWeatherList((prevList) => [
        ...prevList,
        { ...weatherData, isEditingDesc: false },
      ]);
    } catch (error) {
      console.error("Failed to fetch city weather:", error);
    }
    setIsFetching(false);
  };

  const handleCityAdd = () => {
    if (queryCity && !cityWeatherList.some((w) => w.location.name === queryCity)) {
      fetchCityWeather(queryCity);
      setQueryCity("");
    }
  };

  const removeCity = (index) => {
    setCityWeatherList((prevList) => prevList.filter((_, i) => i !== index));
  };

  const toggleDescriptionEdit = (index) => {
    setCityWeatherList((prevList) =>
      prevList.map((weather, i) =>
        i === index ? { ...weather, isEditingDesc: !weather.isEditingDesc } : weather
      )
    );
  };

  const updateDescription = (index, newText) => {
    setCityWeatherList((prevList) =>
      prevList.map((weather, i) =>
        i === index
          ? {
              ...weather,
              current: {
                ...weather.current,
                condition: { text: newText },
              },
            }
          : weather
      )
    );
  };

  return (
    <div className="h-screen bg-gradient-to-b from-blue-500 to-indigo-900 text-white p-6 flex flex-col justify-center items-center">
      <h1 className="text-center text-4xl mb-6 font-semibold">Weather App</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search city"
          onChange={(e) => setQueryCity(e.target.value)}
          value={queryCity}
          className="p-2 text-gray-700 rounded-md w-64"
        />
        <button
          onClick={handleCityAdd}
          className="ml-2 px-4 py-2 bg-green-500 rounded-md"
        >
          Add City
        </button>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {defaultLocations.map((location) => (
          <button
            key={location}
            onClick={() => fetchCityWeather(location)}
            className="bg-white text-indigo-900 py-1 px-3 rounded-md"
          >
            {location}
          </button>
        ))}
      </div>
      {isFetching && <p className="text-center mt-4">Loading...</p>}
      <div className="flex flex-wrap gap-6 justify-center mt-6 max-w-3xl">
        {cityWeatherList.map((weather, index) => (
          <div
            key={index}
            className="bg-white text-gray-900 p-4 rounded-lg shadow-lg w-64"
          >
            <h2 className="text-2xl font-bold mb-2 text-center">
              {weather.location.name}
            </h2>
            <p className="text-lg text-center">
              {weather.isEditingDesc ? (
                <input
                  type="text"
                  value={weather.current.condition.text}
                  onChange={(e) => updateDescription(index, e.target.value)}
                  onBlur={() => toggleDescriptionEdit(index)}
                  className="border p-1 w-full"
                />
              ) : (
                <span onClick={() => toggleDescriptionEdit(index)}>
                  {weather.current.condition.text}
                </span>
              )}
            </p>
            <p className="text-center">Temperature: {weather.current.temp_c}°C</p>
            <p className="text-center">Pressure: {weather.current.pressure_mb} mb</p>
            <p className="text-center">Visibility: {weather.current.vis_miles} miles</p>
            <button
              onClick={() => removeCity(index)}
              className="mt-4 bg-red-500 text-white py-1 px-3 rounded-md w-full"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherApp;
