import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import '../styles/Home.scss';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import citiesDB from '../data/city.list.json';
import SearchBar from '../components/SearchBar';

const CITY_URL = 'http://localhost:3001/city/';

const Home = () => {
  const [citySearch, setCitySearch] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [numberOfSearchResults, setNumberOfSearchResults] = useState(undefined);

  // async function filter(arr, callback) {
  //   const fail = Symbol();
  //   return (
  //     await Promise.all(
  //       arr.map(async (item) => ((await callback(item)) ? item : fail))
  //     )
  //   ).filter((i) => i !== fail);
  // }

  // function doAsyncStuff() {
  //   return Promise.resolve();
  // }

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
        />
        {citySuggestions.length > 0 &&
          citySuggestions.map((citySuggestion, index) => (
            <div key={index}>{citySuggestion.name}</div>
          ))}
      </section>
      <div id="grid-2"></div>
    </main>
  );
};

export default Home;
