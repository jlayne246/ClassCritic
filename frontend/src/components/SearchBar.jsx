//https://www.youtube.com/watch?v=x7niho285qs
import React from "react";
import { useState } from "react";
//import "./SearchBar.css";
//npm install @mui/icons-material   //https://mui.com/material-ui/material-icons/ //to view more incons
import Search from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";

export default function SearchBar({ placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  {
    /**/
  }
  const handleFilter = (event) => {
    {
      /*the current text inside of the search bar is saved inside searchWord
      setWordEntered(searchWord); is used to help determine to show search/close icon
      */
    }
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    {
      /*below, we use filter() to return each result that matches the searchWord within the CourseNames.json*/
    }
    const newFilter = data.filter((value) => {
      return value.title.toLowerCase().includes(searchWord.toLowerCase());
    });

    {
      /*If searchWord is empty, we must set array to empty, to prevent the return of " "
        which would match all items*/
    }
    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };
  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };
  return (
    <div className="search">
      <h1>Class Critic</h1>
      <div className="searchInputs">
        {/*Each time a char is entered, call handleFilter()*/}
        <input
          className="searchBarInput"
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className="searchIcon">
          {/*If there is no text in search bar, show search icon, otherwise show close icon */}
          {filteredData.length === 0 ? (
            <Search />
          ) : (
            <Close id="clearBtn" onClick={clearInput} />
          )}
        </div>
      </div>
      {/*below will return the search results*/}
      {filteredData.length != 0 && (
        <div className="dataResult">
          {/*Only return 5 matches*/}
          {filteredData.slice(0, 5).map((value) => {
            return (
              <div key={value.coursecode}>
                <a className="dataItem" href={window.location.origin+"/review?course="+value.coursecode}>
                  <p>{value.title}</p>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
