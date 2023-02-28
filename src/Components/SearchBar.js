import React, { useState } from "react";
import "../Styles/SearchBar.css";
import { ReactComponent as Logo } from '../Data/Images/SearchIcon.svg';
import { fetchCoordsByName, getWeatherFromCoords, getPlacesBasedOnWeather, getLocationNameFromCoords } from "../Utility/LocationHelper";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchBar = ({myLocation}) => {
  const [country,setCountry] = useState("");
  const [city,setCity] = useState("");
  const [result,setResult] = useState({
    error:false,
    toDisplay:false,
    message:""
  });
  const navigate = useNavigate();
  const fetchPlaces = async (coord, fetched) => {
    const weather = await getWeatherFromCoords(coord);
    if(weather.data.weather[0].icon){
      const places = await getPlacesBasedOnWeather(coord,weather.data.weather[0].icon);
      if(places.error){
        setResult({
          error:true,
          toDisplay:true,
          message:places.message
        });
      }else{
        setResult({
          error:false,
          toDisplay:false,
          message:""
        });
        try{
          const res = await axios.put(process.env.REACT_APP_MONGODB_API + "/update", {country:fetched.country,city:fetched.city});
            setResult({
              error: false,
              toDisplay: true,
              message: res.data.message
            })
            setTimeout(() => {
              setResult({
                error: false,
                toDisplay: false,
                message: ""
              })
              navigate('/data', { state: { places: places.data, mapping: places.mapping, location: fetched, weather: weather.data } });
            }, 1500)
        } catch (e){
          console.error(e);
          setResult({
            error: true,
            toDisplay: true,
            message: e.response.data.message
          })
          setTimeout(() => {
            setResult({
              error: false,
              toDisplay: false,
              message: ""
            })
          }, 1500)
        }
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fetchedLocation = await fetchCoordsByName(city, country);
    console.log(fetchedLocation);
    if (!fetchedLocation.error) {
      await fetchPlaces(fetchedLocation.coords, fetchedLocation.fetched);
    } else {
      setResult({
        error: true,
        toDisplay: true,
        message: fetchedLocation.message
      });
    }
  }
  const handleMyLocation = async () => {
    const fetchedLocation = await getLocationNameFromCoords(myLocation);
    console.log(fetchedLocation);
    if (!fetchedLocation.error) {
      await fetchPlaces(myLocation, fetchedLocation);
    } else {
      setResult({
        error: true,
        toDisplay: true,
        message: fetchedLocation.message
      });
    }
  }
  return (
    <div className="searchBar">
      <div className="full">
        <form className="firstRow" action="" onSubmit={handleSubmit}>
          <div className="inputHolder">
            <input 
              id="country" 
              type="text" 
              placeholder="Country" 
              minLength={3}
              required
              onChange={event => {
                setCountry(event.target.value)
                setResult((q) => ({...q,error:false,message:""}));
              }}
              onInvalid={event => {
                event.target.setCustomValidity("Please enter at least 3 characters")
              }}
              onInput={event => {
                event.target.setCustomValidity("")
              }}
            />

            <label htmlFor="country">Country</label>
          </div>
          <div className="inputHolder">
            <input 
              id="city" 
              type="text" 
              placeholder="City" 
              minLength={3}
              required
              onChange={event => {
                setCity(event.target.value)
                setResult((q) => ({...q,error:false,message:""}));
              }}
              onInvalid={event => {
                event.target.setCustomValidity("Please enter at least 3 characters")
              }}
              onInput={event => {
                event.target.setCustomValidity("")
              }}
            />
            <label htmlFor="city">City</label>
          </div>
          <button type="submit">
            <Logo className="searchIcon" />
          </button>
          
        </form>
        {result.toDisplay && (<span style={{ color: result.error ? 'red':'green', fontWeight: 'bold', fontSize: 'large'}}>{result.message!==""?result.message:"Internal Error"}</span>)}
        {myLocation && <input type="button" value="Activiteis Around Me" onClick={handleMyLocation}/>}
      </div>
    </div>
  );
};
export default SearchBar;
