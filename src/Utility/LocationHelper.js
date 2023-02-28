import { useGeolocated } from "react-geolocated";
import mapping from "../Data/Jsons/Mapping.json";

const useGetGeoLocation = () => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });
  if (!isGeolocationAvailable) {
    console.log("device does not support geolocation");
  } else if (!isGeolocationEnabled) {
    console.log("user has diabled fetching current location");
  } else if (!coords) {
    console.log("fetching location");
  } else {
    console.log(coords);
  }
  return coords;
};

const getWeatherFromCoords = async (coords) => {
  const weatherNowAPI = new URL('https://api.openweathermap.org/data/2.5/weather');
  weatherNowAPI.searchParams.append('lat', coords.latitude);
  weatherNowAPI.searchParams.append('lon', coords.longitude);
  weatherNowAPI.searchParams.append('units', 'metric');
  weatherNowAPI.searchParams.append('appid', process.env.REACT_APP_WEATHERMAP_KEY);
  const result = await fetch(weatherNowAPI)
  if (result.ok) {
    const data = await result.json();
    return {
      error: false,
      data: data,
    };
  } else {
    return {
      error: true,
      data: {},
    };
  }
};
const fetchProperCity = (data) => {
  let city = "";
  if (data.address.town) {
    city = data.address.town;
  } else if (data.address.city) {
    city = data.address.city;
  } else if (data.address.state) {
    city = data.address.state;
  } else if (data.address.village) {
    city = data.address.village;
  } else if (data.address.place) {
    city = data.address.place;
  } else if (data.address.hamlet) {
    city = data.address.hamlet;
  }
  return city;
};
const getLocationNameFromCoords = async (coords) => {
  const addressAPI = new URL('https://nominatim.openstreetmap.org/reverse');
  addressAPI.searchParams.append('lat', coords.latitude);
  addressAPI.searchParams.append('lon', coords.longitude);
  addressAPI.searchParams.append('format', 'jsonv2');
  addressAPI.searchParams.append('accept-language', 'en');
  const result = await fetch(addressAPI);
  if (result.ok) {
    const data = await result.json();
    if (!data.error && data.address.country) {
      return{
        error: false,
        city: fetchProperCity(data),
        country: data.address.country,
      };
    }else {
        return{
            error:true,
            city:"",
            country:""
        }
    }
  } else {
    return{
        error:true,
        city:"",
        country:""
    };
  }
};
const fetchCoordsByName= async (city, country) => {
  const addressAPI = new URL('https://nominatim.openstreetmap.org/search');
  addressAPI.searchParams.append('format', 'jsonv2');
  addressAPI.searchParams.append('limit', '1');
  addressAPI.searchParams.append('addressdetails', '1');
  addressAPI.searchParams.append('accept-language', 'en');
  addressAPI.searchParams.append('city', city);
  addressAPI.searchParams.append('country', country);
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
const getPlacesBasedOnWeather = async (coord,icon)=>{
    const radius = 5000; // in meters
    const openTripAPI = new URL('https://api.opentripmap.com/0.1/en/places/radius');
    openTripAPI.searchParams.append('radius', radius);
    openTripAPI.searchParams.append('lon', coord.longitude);
    openTripAPI.searchParams.append('lat', coord.latitude);
    openTripAPI.searchParams.append('kinds', mapping[icon].join(','));
    openTripAPI.searchParams.append('apikey', process.env.REACT_APP_OPENTRIP_KEY);
    const result = await fetch(openTripAPI)
    if(result.ok){
      const data = await result.json();
      if(data.features.length === 0){
        return {
          error:true,
          message:"Cannot find any places for destination"
        }
      }
      return {
        error:false,
        data:data.features,
        mapping:mapping[icon]
      }
    } else {
      return {
        error:true,
        message:"Error Fetching Recommended Places"
      }
    }
  }
export {
  useGetGeoLocation,
  getWeatherFromCoords,
  getLocationNameFromCoords,
  fetchProperCity,
  fetchCoordsByName,
  getPlacesBasedOnWeather
};
