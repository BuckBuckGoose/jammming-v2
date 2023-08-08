import React, { useCallback, useState } from "react";
import "./SearchBar.css";

const SearchBar = ({onSearch}) => {
    
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const search = useCallback(() => {
    onSearch(searchTerm);
  }, [onSearch, searchTerm]);

  return (
    <div className="SearchBar">
      <input
        placeholder="Enter your search term"
        onChange={handleSearchTermChange}
      />
      <button className="SearchButton" onClick={search}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;