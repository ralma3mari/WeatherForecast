import React from "react";
import "../Styles/WeatherNow.css";
import { useGetGeoLocation, useGetLocationNameFromCoords, useGetWeatherFromCoords } from "../Utility/LocationHelper";

const WeatherNow = () => {
  const coords = useGetGeoLocation();
  const weather = useGetWeatherFromCoords(coords);
  const name = useGetLocationNameFromCoords(coords);

  return (
    <>
      {JSON.stringify(weather) !== "{}" ? (
        <div className="weatherNow">
          Your Location:
          <div className="wrapper">
            <span className="currentLocation">{name.city}</span>

            <div className="wrapper">
              <span className="currentTemp">{weather.main.temp} °C</span>

              <img className="currentTempIcon"
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default WeatherNow;
