import React, { useState } from "react";
import "../Styles/SearchBar.css";
import { ReactComponent as Logo } from '../Data/Images/SearchIcon.svg';
import { fetchProperCity } from "../Utility/LocationHelper";

const SearchBar = () => {
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

  const fetchCoordsByName= async () => {
    const addressAPI = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&accept-language=en&city=${city}&country=${country}`;
    try{
      const result = await fetch(addressAPI);
      if(result.ok){
        const data = await result.json();
        if(data.length === 0){
          return{
            error:true,
            message:"Unable to fetch location",
            coords:{
              latitude:"",
              longitude:""
            },
            fetched:{
              city:"",
              country:""
            },
          }
        } else{
          return{
            error:false,
            message:"",
            coords:{
              latitude:data[0].lat,
              longitude:data[0].lon
            },
            fetched:{
              city:fetchProperCity(data[0]),
              country:data[0].address.country
            },
          }
        }
      } 
    } catch(error){
      console.error(error);
      return{
        error:true,
        message:"Internal Error",
        coords:{
          latitude:"",
          longitude:""
        },
        fetched:{
          city:"",
          country:""
        },
      }
    }
    
  }
  const handleSubmit= async (event) => {
    event.preventDefault();
    const fetched = await fetchCoordsByName();
    setResult(fetched);
    console.log(fetched);
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
