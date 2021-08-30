import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SearchBar.scss';

const SearchBar = ({ placeholder, fetchCallback }) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isFirstSearch, setIsFirstSearch] = useState(true);

  const handleSearch = async () => {
    setSearchSuggestions([]);
    setIsSearchLoading(true);
    if (searchValue.length > 1) {
      setSearchSuggestions(await fetchCallback(searchValue));
    }
    setIsSearchLoading(false);
    setIsFirstSearch(false);
  };

  const handleSelectSuggestion = () => {
    setSearchValue('');
    setSearchSuggestions([]);
    setIsFirstSearch(true);
  };

  return (
    <div
      className={`search-bar ${
        searchSuggestions.length > 0 ? 'search-bar-suggestions' : ''
      }`}
    >
      {isFirstSearch ? (
        ''
      ) : !isNaN(searchSuggestions.length) && searchSuggestions.length > 0 ? (
        <div className="number-of-results">
          {searchSuggestions.length} result
          {searchSuggestions.length > 1 && 's'} found
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
      {isSearchLoading && (
        <button className="btn-icon" onClick={handleSearch}>
          <FontAwesomeIcon
            icon={faSpinner}
            className="search-icon spin-animation"
          />
        </button>
      )}
      {!isSearchLoading && (
        <button className="btn-icon" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </button>
      )}
      {searchSuggestions.length > 0 && (
        <section className="search-suggestions">
          <div className="search-suggestions-container">
            {searchSuggestions.map((suggestion, index) => (
              <Link
                onClick={() => handleSelectSuggestion()}
                key={`suggestion-${index}`}
                className="search-suggestion"
                to={`/${suggestion.country}/${
                  suggestion.state.length > 0 ? suggestion.state + '/' : ''
                }${suggestion.name}`}
              >
                <img
                  src={`https://www.countryflags.io/${suggestion.country}/flat/24.png`}
                  alt={suggestion.country}
                  className="flag"
                />
                <p>
                  {suggestion.name}, {suggestion.country}
                  {suggestion.state.length > 0 && ', ' + suggestion.state}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchBar;
