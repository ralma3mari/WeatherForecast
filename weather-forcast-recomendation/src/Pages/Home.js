import React from "react";
import WeatherNow from "../Componets/WeatherNow";
import HomePage from"../Data/Images/Home.gif"
function Home(){

    return (
        <div className="home" style={{background:`url(${process.env.PUBLIC_URL+HomePage}) center center/cover no-repeat`, height:"100%", width:"100%"}}>
            <WeatherNow />
        </div>
    )

}
export default Home;