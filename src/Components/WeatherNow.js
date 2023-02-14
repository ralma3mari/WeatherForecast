import React, { useEffect, useState } from "react";
import "../Styles/WeatherNow.css";
import { getLocationNameFromCoords, getWeatherFromCoords } from "../Utility/LocationHelper";

const WeatherNow = ({myLocation}) => {
  const[weather,setWeather] = useState({
    error:true,
    data:{}
  });
  const[name,setName] = useState({
    error:false,
    city:"",
    country:""
  });

  useEffect(()=>{
    const fetchData = async () => {
      setWeather(await getWeatherFromCoords(myLocation));
      setName(await getLocationNameFromCoords(myLocation));
    }
    if(myLocation){
      fetchData();
    }
  },[myLocation])
  return (
    <>
      {!weather.error ? (
        <div className="weatherNow">
          Your Location:
          <div className="wrapper">
            <span className="currentLocation">{name.city}</span>

            <div className="wrapper">
              <span className="currentTemp">{weather.data.main.temp} °C</span>

              <img className="currentTempIcon"
                src={`http://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
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
