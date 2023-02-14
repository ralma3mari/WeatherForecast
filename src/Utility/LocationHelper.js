import { useGeolocated } from "react-geolocated";

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
  const weatherNowAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${process.env.REACT_APP_WEATHERMAP_KEY}`;
  console.log(weatherNowAPI);
  const result = await fetch(weatherNowAPI);
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
  const addressAPI = `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=jsonv2&accept-language=en`;
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
export {
  useGetGeoLocation,
  getWeatherFromCoords,
  getLocationNameFromCoords,
  fetchProperCity,
  fetchCoordsByName
};
