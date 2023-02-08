import React from "react";
import "../Styles/SearchBar.css"
import SearchIcon from "../Data/Images/SearchIcon.png"

const SearchBar = ()=> {
    return(
        <div className="searchBar">

            <div className="full">
                <div className="firstRow">
                    <img src={SearchIcon} alt="search" />
                    <input type="text" placeholder="Enter Desired Destination" />
                </div>


                <input type="button" value="Locate Me" />
            </div>
            
        </div>

    )
}
export default SearchBar;