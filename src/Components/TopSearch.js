import React from "react";
import "../Styles/TopSearch.css";

const TopSearch = () => {
  return (
    <div className="topSearch">
      <h1>Top Three Visited Cities</h1>
      <div className="wrapper3">
        <div className="first">
          <div className="wrapper4">
            <div className="rank">
              1<sup>st</sup>
            </div>
            <div className="city">Dubai, United Arab Emirates</div>
          </div>
        </div>

        <div className="second">
          <div className="wrapper4">
            <div className="rank">
              2<sup>nd</sup>
            </div>
            <div className="city">Beirut, Lebanon</div>
          </div>
        </div>

        <div className="third">
          <div className="wrapper4">
            <div className="rank">
              3<sup>rd</sup>
            </div>
            <div className="city">Los Angeles, United States</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopSearch;
