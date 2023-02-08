import React from "react";
import SearchBar from "../Components/SearchBar";
import TopSearch from "../Components/TopSearch";
import WeatherNow from "../Components/WeatherNow";
import HomePage from "../Data/Images/HomePage.gif"
import "../Styles/Home.css"


function Home(){

    return(
        <div className="home" style={{background:`url(${process.env.PUBLIC_URL+HomePage}) center center/ cover no-repeat`, height:"100%", width:"100%"}}>
                <WeatherNow />
                <div className="wrapper2">
                    <TopSearch />
                    <SearchBar />
                </div>
        </div>
    );
}
export default Home;