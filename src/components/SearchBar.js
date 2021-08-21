import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context';
import '../styles/SearchBar.scss';

const SearchBar = ({
  numberOfResults,
  placeholder,
  searchCallback,
  searchValue,
  setSearchValue,
  searchLoading,
  searchSuggestions,
  selectSuggestion,
  setUrlParams,
}) => {
  const [searchSuggestionsAvailable, setSearchSuggestionsAvailable] = useState(
    searchSuggestions.length > 0
  );

  useEffect(() => {
    setSearchSuggestionsAvailable(numberOfResults > 0);
    if (numberOfResults === undefined) setSearchSuggestionsAvailable(undefined);
  }, [numberOfResults]);

  return (
    <div
      className={`search-bar ${
        searchSuggestionsAvailable ? 'search-bar-suggestions' : ''
      }`}
    >
      {searchSuggestionsAvailable === undefined ? (
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
        <button className="btn-icon" onClick={() => searchCallback()}>
          <FontAwesomeIcon
            icon={faSpinner}
            className="search-icon spin-animation"
          />
        </button>
      )}
      {!searchLoading && (
        <button className="btn-icon" onClick={() => searchCallback()}>
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </button>
      )}
      {searchSuggestionsAvailable && (
        <section className="search-suggestions">
          <div className="search-suggestions-container">
            {searchSuggestions.map((suggestion, index) => (
              <Link
                onClick={() => {
                  selectSuggestion(suggestion);
                  setSearchSuggestionsAvailable(false);
                  setUrlParams({
                    country: suggestion.country,
                    state_name: suggestion.state,
                    location_name: suggestion.name,
                  });
                }}
                key={index}
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
