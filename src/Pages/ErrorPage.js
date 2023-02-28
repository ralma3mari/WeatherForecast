import React from "react";
import "../Styles/ErrorPage.css";
import Background from "../Data/Images/ErrorPage.jpg"

const ErrorPage = ({ message }) => {
  return (
    <div className="outer" style={{background:`url(${Background})center center / cover no-repeat`}}>
      <div className="inner">{message}</div>
    </div>
  );
};
export default ErrorPage;
