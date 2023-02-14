import React from "react";
import SearchBar from "../Components/SearchBar";
import TopSearch from "../Components/TopSearch";
import WeatherNow from "../Components/WeatherNow";
import HomePage from "../Data/Images/HomePage.gif";
import "../Styles/Home.css";
import { useGetGeoLocation } from "../Utility/LocationHelper";

function Home() {
  const coords = useGetGeoLocation();
  return (
    <div
      className="home"
      style={{
        background: `url(${
          process.env.PUBLIC_URL + HomePage
        }) center center/ cover no-repeat`,
      }}
    >
      <WeatherNow myLocation={coords}/>
      <div className="wrapper2">
        <TopSearch />
        <SearchBar myLocation={coords}/>
      </div>
    </div>
  );
}
export default Home;
