import React from "react";
import "../Styles/SearchBar.css";
import { ReactComponent as Logo } from '../Data/Images/SearchIcon.svg';

const SearchBar = () => {
  return (
    <div className="searchBar">
      <div className="full">
        <form className="firstRow">
          <div className="inputHolder">
            <input id="country" type="text" placeholder="Country" />
            <label htmlFor="country">Country</label>
          </div>
          <div className="inputHolder">
            <input id="city" type="text" placeholder="City" />
            <label htmlFor="city">City</label>
          </div>
          <button type="submit">
            <Logo className="searchIcon" />
          </button>
          
        </form>
        <span className="errorMsg">Error Fetching Location</span>
        <input type="button" value="Activiteis Around Me" />
      </div>
    </div>
  );
};
export default SearchBar;
