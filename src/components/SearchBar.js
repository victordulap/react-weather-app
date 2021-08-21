import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import '../styles/SearchBar.scss';

const SearchBar = ({
  numberOfResults,
  placeholder,
  searchCallback,
  searchValue,
  setSearchValue,
  searchLoading,
}) => {
  return (
    <div className="search-bar">
      {numberOfResults == undefined ? (
        ''
      ) : !isNaN(numberOfResults) && numberOfResults > 0 ? (
        <div className="number-of-results">
          {numberOfResults} result{numberOfResults > 1 && 's'} found
        </div>
      ) : (
        <div className="number-of-results">No results found</div>
      )}
      <input
        className="search-input"
        type="text"
        name="search-bar"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchLoading && (
        <button onClick={() => searchCallback()}>
          <FontAwesomeIcon
            icon={faSpinner}
            className="search-icon spin-animation"
          />
        </button>
      )}
      {!searchLoading && (
        <button onClick={() => searchCallback()}>
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
