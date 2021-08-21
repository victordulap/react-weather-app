import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import '../styles/Home.scss';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import citiesDB from '../data/city.list.json';
import SearchBar from '../components/SearchBar';
import { useGlobalContext } from '../context';

const CITY_URL = 'http://localhost:3001/city/';

const Home = () => {
  const [citySearch, setCitySearch] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [numberOfSearchResults, setNumberOfSearchResults] = useState(undefined);
  const { city, setCity } = useGlobalContext();

  const selectCity = (newCity) => {
    setCity(newCity);
    setCitySearch('');
    setCitySuggestions((searchSuggestions) => (searchSuggestions.length = 0));
    setNumberOfSearchResults(undefined);
  };

  const searchCities = async () => {
    setCitySuggestions([]);
    setNumberOfSearchResults(undefined);
    setIsSearchLoading(true);
    if (citySearch.length > 1) {
      const response = await fetch(CITY_URL + citySearch);
      const data = await response.json();

      setCitySuggestions(data);
      setNumberOfSearchResults(data.length);
    }
    setIsSearchLoading(false);
  };

  return (
    <main className="grid">
      <section id="grid-1">
        <SearchBar
          placeholder="Enter city name"
          searchCallback={searchCities}
          searchValue={citySearch}
          setSearchValue={setCitySearch}
          searchLoading={isSearchLoading}
          numberOfResults={numberOfSearchResults}
          searchSuggestions={citySuggestions}
          selectSuggestion={selectCity}
        />
        {Object.keys(city) > 0 && (
          <div className="city">Selected city {city.name}</div>
        )}
      </section>
      <div id="grid-2"></div>
    </main>
  );
};

export default Home;
