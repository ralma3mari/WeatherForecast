import React, { useState } from "react";
import "../Styles/SearchBar.css";
import { ReactComponent as Logo } from '../Data/Images/SearchIcon.svg';
import { fetchCoordsByName, getWeatherFromCoords } from "../Utility/LocationHelper";

const SearchBar = ({myLocation}) => {
  const [country,setCountry] = useState("");
  const [city,setCity] = useState("");
  const [result,setResult] = useState({
    error:false,
    message:"",
    coords:{
      latitude:"",
      longitude:""
    },
    fetched:{
      city:"",
      country:""
    },
  });

  const handleSubmit= async (event) => {
    event.preventDefault();
    const fetchedLocation = await fetchCoordsByName(city, country);
    if(!fetchedLocation.error){
      const weather = await getWeatherFromCoords(fetchedLocation.coords);
      console.log(weather);
    }
    setResult(fetchedLocation);
    console.log(fetchedLocation);
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
        {result.error && (<span className="errorMsg">{result.message!==""?result.message:"Internal Error"}</span>)}
        <input type="button" value="Activiteis Around Me" />
      </div>
    </div>
  );
};
export default SearchBar;
