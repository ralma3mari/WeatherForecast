import React from "react";
import "../styles/ErrorPage.css"
const ErrorPage = ({message}) => {
    return(
        <div className="outer">
            <div className="inner">
            {message}
            </div>
        </div>
    )
}
export default ErrorPage;