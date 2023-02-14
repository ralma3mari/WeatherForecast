import { useState, useEffect } from 'react';
import { useGeolocated } from 'react-geolocated';

const useGetGeoLocation = () => {
    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
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
    } else{
        console.log(coords)
    }
    return coords;
};

const useGetWeatherFromCoords = (coords) => {
    const [weatherData, setWeatherData] = useState({});

    useEffect(() => {
        const fetchWeather = async () => {
            const weatherNowAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${process.env.REACT_APP_WEATHERMAP_KEY}`;
            console.log(weatherNowAPI);
            const result = await fetch(weatherNowAPI);
            if (result.ok) {
                const data = await result.json();
                setWeatherData(data);
            } else {
                throw result;
            }
        }
        if (coords) {
            fetchWeather();
        }
    }, [coords]);

    return weatherData;
};
const fetchProperCity = (data) => {
    let city = ""
     if (data.address.town) {
        city= data.address.town
    } else if (data.address.city) {
        city = data.address.city
    } else if (data.address.state) {
        city = data.address.state
    } else if (data.address.village) {
        city = data.address.village
    } else if (data.address.place) {
        city = data.address.place
    } else if (data.address.hamlet) {
        city = data.address.hamlet
    }
    return city;
    
}
const useGetLocationNameFromCoords = (coords) => {
    const [name, setName] = useState({
        error:true,
        city:"",
        country:""
    });

    useEffect(() => {
        const fetchAddress = async () => {
            const addressAPI = `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=jsonv2&accept-language=en`;
            const result = await fetch(addressAPI);
            if (result.ok) {
                const data = await result.json();
                if(!data.error && data.address.country){
                    
                    setName({
                        error: false,
                        city:fetchProperCity(data),
                        country:data.address.country
                    })
                   
                }
            } else {
                throw result;
            }
        }
        if (coords) {
            fetchAddress();
        }
    }, [coords]);

    return name;
}

export { useGetGeoLocation, useGetWeatherFromCoords, useGetLocationNameFromCoords, fetchProperCity };