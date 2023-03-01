import React, { useEffect, useState } from "react";
import ErrorPage from "./ErrorPage";
import { useLocation, useNavigate } from "react-router-dom";
import DisplayCard from "../Components/DisplayCard";
import Pagination from "../Components/Pagination";
import '../Styles/CardHolder.css'
import { ReactComponent as Back } from '../Data/Images/Back.svg';

const CardHolder = () => {
    const location = useLocation();
    const dataPassed = location.state;
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [filteredData, setFilteredData] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        if (dataPassed) {
            const { mapping, places } = dataPassed;
            const newObj = mapping.reduce((acc, cur) => {
                const caps = cur.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                acc[caps] = true;
                return acc;
            }, {});
            setSelectedFilters(newObj);
            if (places) {
                const filteredData2 = places.filter((item) => {
                    return mapping.some(key => {
                        const kinds = item.properties.kinds.split(',');
                        return kinds.includes(key)
                    })

                });
                setFilteredData(filteredData2);
            }
        }
    }, [dataPassed]);

    const applyFilter = () => {
        if (dataPassed.places) {
            const filteredData2 = dataPassed.places.filter((item) => {
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

    if (!dataPassed) {
        return (
            <ErrorPage message={"Please do a search before navigating to this page"} />
        );
    }
    const { mapping, myLocation, weatherForecast } = dataPassed;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const onPageChange = (pageNumber) => setCurrentPage(pageNumber);
    const fetchDateFromTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const humanReadableDate = date.toLocaleString();
        return humanReadableDate;
    }

    return (
        <div className="col" style={{alignItems:'center',backgroundColor:'purple'}}>
            <div className="row" style={{gap:'20px'}}>
                <button className="go-back-btn" onClick={() => navigate("/")}><Back width={50} height={50}/></button>
                <h1 style={{ color: 'white' }}>Weather now in {dataPassed.location.city}, {dataPassed.location.country} is {dataPassed.weather.weather[0].main} with a temperature of {dataPassed.weather.main.temp}°C</h1>
            </div>
            <div className="container">
                <section className="filter-section">
                    <div className="filter-list">
                        <h2>Filters</h2>
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
                        <button className="apply-filter-btn" onClick={applyFilter}>Apply Filter</button>
                        <button className="const-btn" onClick={selectAll}>Select All</button>
                        <button className="clear-all-btn" onClick={clearFilter}>Clear All</button>
                    </div>
                </section>
                <section className="item-list-section">
                    <div className="item-list">
                        {currentItems.map((info, index) => (
                            <DisplayCard key={index} data={info} mapping={mapping} myLocation={myLocation} />
                        ))}
                    </div>
                    <div className="item-count">
                        Total: {filteredData.length}
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={filteredData.length}
                        onPageChange={onPageChange}
                    />
                </section>
                { !weatherForecast.error && weatherForecast.data.list.length>0 && (
                    <section className="weather-forecast-section">
                        <h4 style={{color:"white"}}>Weather forecast in {dataPassed.location.city}, {dataPassed.location.country}</h4>
                        {weatherForecast.data.list.map((key,index)=>{
                            if(index%4===0)
                                return(
                                    <div key={index} className="weather-forecast-item">
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
                            else return (<></>)
                        })}
                    </section>
                )}
            </div>
        </div>

    );
};

export default CardHolder;
