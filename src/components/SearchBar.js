import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SearchBar.scss';

const SearchBar = ({ placeholder, fetchCallback }) => {
  const [searchValue, setSearchValue] = useState('');
  const [oldSearchValue, setOldSearchValue] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [showResultsNumberLabel, setShowResultsNumberLabel] = useState(false);
  const [isSearchValueShort, setIsSearchValueShort] = useState(false);
  const inputRef = useRef('inputRef');

  const handleSearch = async () => {
    setSearchSuggestions([]);
    setIsSearchValueShort(false);
    setIsSearchLoading(true);

    let showResNumLabel = true;
    if (searchValue.length > 2) {
      setSearchSuggestions(await fetchCallback(searchValue));
      setOldSearchValue(searchValue);
    } else {
      setIsSearchValueShort(true);
      setShowResultsNumberLabel(false);
      showResNumLabel = false;
    }
    setIsSearchLoading(false);
    if (showResNumLabel) setShowResultsNumberLabel(true);
    inputRef.current.focus();
  };

  const handleSelectSuggestion = () => {
    setSearchValue('');
    resetSearchSuggestions();
  };

  const handleUnFocus = () => {
    // hide suggestions and results number
    resetSearchSuggestions();
  };

  const resetSearchSuggestions = () => {
    setSearchSuggestions([]);
    setShowResultsNumberLabel(false);
  };

  return (
    <div
      className={`search-bar ${
        searchSuggestions.length > 0 ? 'search-bar-suggestions' : ''
      }`}
    >
      {isSearchValueShort ? (
        <div className="number-of-results" style={{ color: '#e07e7e' }}>
          Enter at least 3 letters
        </div>
      ) : !showResultsNumberLabel || isSearchLoading ? (
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
        ref={inputRef}
        onChange={(e) => setSearchValue(e.target.value)}
        onBlur={(e) => {
          // if clicked on suggestion, dont trigger unFocus
          if (
            e.relatedTarget !== null &&
            e.relatedTarget.classList.contains('search-suggestion')
          ) {
            // console.log('clicked on suggestion');
          } else {
            handleUnFocus();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
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
                  {
                    <span>
                      {suggestion.name.slice(0, oldSearchValue.length)}
                    </span>
                  }
                  {suggestion.name.slice(
                    oldSearchValue.length,
                    suggestion.name.length
                  )}
                  , {suggestion.country}
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
