import React, { useEffect, useState } from "react";
import "../Styles/TopSearch.css";

const TopSearch = () => {
  const [highScores, setHighScores] = useState([]);
  const [error, setError] = useState(false);
    useEffect(() => {
        fetch(process.env.REACT_APP_MONGODB_API + "/top3")
        .then(response => {
                      if (response.ok) {
                        return response.json();
                      }
                      throw new Error('Something went wrong');
                    })
            .then(data => setHighScores(data.data))
            .catch(e => setError(true));
    }, []);

  if(error)
    return (<></>)
  else
  return (
    <div className="topSearch">
     { highScores.length>0 ? 
      <>
        <h1>Top Three Visited Cities</h1>
        <div className="wrapper3">
          {highScores[0] && (
            <div className="first">
              <div className="wrapper4">
                <div className="rank">
                  1<sup>st</sup>
                </div>
                <div className="city">{highScores[0].city}, {highScores[0].country}</div>
              </div>
            </div>
          )}
          
          {highScores[1] && (
            <div className="second">
              <div className="wrapper4">
                <div className="rank">
                  2<sup>nd</sup>
                </div>
                <div className="city">{highScores[1].city}, {highScores[1].country}</div>
              </div>
            </div>
          )}
          
            {highScores[2] && (
              <div className="third">
                <div className="wrapper4">
                  <div className="rank">
                    3<sup>rd</sup>
                  </div>
                  <div className="city">{highScores[2].city}, {highScores[2].country}</div>
                </div>
              </div>
            )}
          
        </div>
      </>:
      <>
        <h1>Fetching Top Three Cities...</h1>
      </>

     }
      
    </div>
  );
};
export default TopSearch;
