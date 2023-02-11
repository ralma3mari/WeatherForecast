import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import "../Styles/WeatherNow.css";

const WeatherNow = () => {
  const [data, setData] = useState(null);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    if (!isGeolocationAvailable) {
      console.log("device does not support geolocation");
    } else if (!isGeolocationEnabled) {
      console.log("user has diabled fetching current location");
    } else if (!coords) {
      console.log("fetching location");
    } else {
      const weatherNowAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${process.env.REACT_APP_WEATHERMAP_KEY}`;
      console.log(weatherNowAPI);
      const dataFetch = async () => {
        const result = await fetch(weatherNowAPI);
        if (result.ok) {
          const data = await result.json();
          console.log(data);
          setData(data);
        } else {
          throw result;
        }
      };

      dataFetch();
    }
  }, [isGeolocationAvailable, isGeolocationEnabled, coords]);

  return (
    <>
      {data ? (
        <div className="weatherNow">
          Your Location:
          <div className="wrapper">
            <span className="currentLocation">{data.name}</span>

            <div className="wrapper">
              <span className="currentTemp">{data.main.temp} °C</span>

              <img className="currentTempIcon"
                src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
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
