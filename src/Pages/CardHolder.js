import React, { useEffect, useState } from "react";
import ErrorPage from "./ErrorPage";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DisplayCard from "../Components/DisplayCard";
import Pagination from "../Components/Pagination";
import '../Styles/CardHolder.css'
import { ReactComponent as Back } from '../Data/Images/Back.svg';
import { getPlacesBasedOnWeather } from "../Utility/LocationHelper";

const CardHolder = () => {
    let { index } = useParams();
    index = Number(index);
    const dataPassed = useLocation().state;
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [places, setPlaces] = useState([]);
    const [mapping, setMapping] = useState([]);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    let navigate = useNavigate();
    useEffect(() => {
        const readyCards = async () => {
            if (dataPassed) {
                const placesFetched = await getPlacesBasedOnWeather(dataPassed.coord, dataPassed.weather.data[index].weather[0].icon);
                if(!placesFetched.error){
                    setMapping(placesFetched.mapping);
                    setPlaces(placesFetched.data);
                    setIsReady(true);
                    const newObj = placesFetched.mapping.reduce((acc, cur) => {
                        const caps = cur.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                        acc[caps] = true;
                        return acc;
                    }, {});
                    setSelectedFilters(newObj);
                    const filteredData2 = placesFetched.data.filter((item) => {
                        return placesFetched.mapping.some(key => {
                            const kinds = item.properties.kinds.split(',');
                            return kinds.includes(key)
                        })

                    });
                    setFilteredData(filteredData2);
                }
            }
        }
        readyCards();
    }, [dataPassed,index]);
    if(index>10){
        return (
            <ErrorPage message={"Error in index"} />
        );
    }
    if (!dataPassed) {
        return (
            <ErrorPage message={"Please do a search before navigating to this page"} />
        );
    }

    const { weather, location, isMyLocation } = dataPassed;

    // filter buttons
    const clearFilter = () => {
        const clearedFilters = Object.fromEntries(
            Object.entries(selectedFilters).map(([key]) => [key, false])
        );
        setSelectedFilters(clearedFilters);
    }
    const selectAll = () => {
        const selectedAll = Object.fromEntries(
            Object.entries(selectedFilters).map(([key]) => [key, true])
        );
        setSelectedFilters(selectedAll);
    }
    const handleFilterChange = (e) => {
        const filter = e.target.name;
        setSelectedFilters({
            ...selectedFilters,
            [filter]: e.target.checked,
        });
    };
    const applyFilter = () => {
        if (places) {
            const filteredData2 = places.filter((item) => {
                return Object.keys(selectedFilters).some(key => {
                    const kinds = item.properties.kinds.split(',')
                    for (let i = 0; i < kinds.length; i++) {
                        kinds[i] = kinds[i].split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    }
                    return selectedFilters[key] === true && kinds.includes(key)
                })

            });
            setFilteredData(filteredData2);
        }
    }


    const onPageChange = (pageNumber) => setCurrentPage(pageNumber);
    const fetchDateFromTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const humanReadableDate = date.toLocaleString();
        return humanReadableDate;
    }
    const clickedOnForecast = (date,index) => {
        navigate(`/data/${index}`, { state: { coord: dataPassed.coord, location: location, isMyLocation: isMyLocation, weather: weather,date:date } });
    }

    return (
        <div className="col" style={{alignItems:'center',backgroundColor:'grey',height:"100%",overflow:"auto"}}>

            {isReady ? (<>
                <div className="row" style={{gap:'20px'}}>
                    <button className="go-back-btn" onClick={() => navigate("/")}><Back width={50} height={50}/></button>
                    <h1 style={{ color: 'white' }}>Weather {index === 0 ? "now" : `on ${dataPassed.date}`} in {location.city}, {location.country} {index===0?"is":"will be"} {weather.data[index].weather[0].main} with temperature of {weather.data[index].main.temp}°C</h1>
                </div>
                <div className="container">
                    <section className="filter-section">
                        <div className="filter-list">
                            <h2>Filters</h2>
                            <button className="apply-filter-btn" onClick={applyFilter}>Apply Filter</button>
                            <button className="const-btn" onClick={selectAll}>Select All</button>
                            <button className="clear-all-btn" onClick={clearFilter}>Clear All</button>
                            <br/>
                            <form>
                                {Object.keys(selectedFilters).map((key) => (
                                    <div className="filter-group" key={key}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name={key}
                                                checked={selectedFilters[key]}
                                                onChange={handleFilterChange}
                                            />
                                            {key}
                                        </label>
                                    </div>
                                ))}
                            </form>
                        </div>
                    </section>
                    <section className="item-list-section">
                        <div className="item-list">
                            {currentItems.map((info) => (
                                <DisplayCard key={info.id} data={info} mapping={mapping} myLocation={isMyLocation} />
                            ))}
                        </div>
                        <div className="item-count">
                            Total: {filteredData.length}
                            <hr></hr>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredData.length}
                            onPageChange={onPageChange}
                        />
                    </section>
                    { !weather.error && weather.data.length>1 && (
                        <section className="weather-forecast-section">
                            {index!==0 && (
                                <div className="weather-forecast-item" onClick={() => clickedOnForecast("now", 0)}>
                                    Go back to Weather Now
                                </div>
                            )}
                            <h4 style={{ color: "white" }}>Weather forecast in {location.city}, {location.country}</h4>
                            {weather.data.map((key, index) => {
                                if (index !== 0)
                                    return (
                                        <div key={`forecast-${index}`} className="weather-forecast-item" onClick={() => clickedOnForecast(fetchDateFromTimestamp(key.dt) ,index)}>
                                            {fetchDateFromTimestamp(key.dt)}
                                            <img
                                                src={`http://openweathermap.org/img/wn/${key.weather[0].icon}@2x.png`}
                                                alt="weather icon"
                                                width={50}
                                                height={50}
                                            />
                                            {key.main.temp}°C
                                        </div>
                                    )
                                else return (<React.Fragment key={index}></React.Fragment>)
                            })}
                        </section>
                    )}
                </div>
            </>) : (<>Fetching Data</>)}
        </div>

    );
};

export default CardHolder;
