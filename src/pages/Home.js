import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import '../styles/Home.scss';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import citiesDB from '../data/city.list.json';

const CITY_URL = 'http://localhost:3001/city/';

const Home = () => {
  const [citySearch, setCitySearch] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (citySearch.length > 1) {
      setLoading(true);

      const response = await fetch(CITY_URL + citySearch);
      const data = await response.json();

      console.log(data);
      setCitySuggestions(data);

      setLoading(false);
    }
  };

  return (
    <main className="grid">
      <section id="grid-1">
        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            name="city"
            id="city"
            placeholder="Enter city name"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
          />
          {/* {loading && <h2>loading...</h2>} */}
          {loading && (
            <button onClick={() => searchCities()}>
              <FontAwesomeIcon
                icon={faSpinner}
                className="search-icon spin-animation"
              />
            </button>
          )}
          {!loading && (
            <button onClick={() => searchCities()}>
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </button>
          )}
        </div>
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
