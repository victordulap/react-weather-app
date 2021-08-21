import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import '../styles/Home.scss';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import citiesDB from '../data/city.list.json';
import SearchBar from '../components/SearchBar';
import { useGlobalContext } from '../context';
import { useParams, useRouteMatch } from 'react-router-dom';

const CITY_URL = 'http://localhost:3001/city/';

const Home = () => {
  const { params } = useRouteMatch();
  const [urlParams, setUrlParams] = useState({ ...params });
  // setUrlParams(params);

  // search states
  const [citySearch, setCitySearch] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [numberOfSearchResults, setNumberOfSearchResults] = useState(undefined);

  const [weatherTimeSpan, setWeatherTimeSpan] = useState('today');

  const { city, setCity, metrics, setMetrics } = useGlobalContext();

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

  useEffect(() => {
    console.log(urlParams);
    // if (
    //   state_name != undefined &&
    //   country != undefined &&
    //   location_name != undefined
    // ) {
    //   const response = await fetch(
    //     CITY_URL + `${country}/${state_name}/${location_name}`
    //   );
    //   const data = await response.json();
    //   console.log(data);
    //   setCity(data);
    // } else if (country != undefined && location_name != undefined) {
    // }
  }, [urlParams]);

  return (
    <main className="grid">
      <section id="grid-1">
        <div className="wrapper">
          <SearchBar
            placeholder="Enter city name"
            searchCallback={searchCities}
            searchValue={citySearch}
            setSearchValue={setCitySearch}
            searchLoading={isSearchLoading}
            numberOfResults={numberOfSearchResults}
            searchSuggestions={citySuggestions}
            selectSuggestion={selectCity}
            setUrlParams={setUrlParams}
          />
          {Object.keys(city) > 0 && (
            <div className="city">Selected city {city.name}</div>
          )}
        </div>
      </section>
      <div id="grid-2">
        <div className="wrapper">
          <header className="main-header">
            <div className="weather-timespan">
              <button
                className={`btn weather-timespan-btn ${
                  weatherTimeSpan === 'today' ? 'active' : ''
                }`}
                onClick={() => setWeatherTimeSpan('today')}
              >
                Today
              </button>
              <button
                className={`btn weather-timespan-btn ${
                  weatherTimeSpan === 'week' ? 'active' : ''
                }`}
                onClick={() => setWeatherTimeSpan('week')}
              >
                Week
              </button>
            </div>
            <div className="weather-metrics">
              <button
                className={`btn weather-metrics-btn ${
                  metrics === 'C' ? 'active' : ''
                }`}
                onClick={() => setMetrics('C')}
              >
                °C
              </button>
              <button
                className={`btn weather-metrics-btn ${
                  metrics === 'F' ? 'active' : ''
                }`}
                onClick={() => setMetrics('F')}
              >
                °F
              </button>
            </div>
          </header>
        </div>
      </div>
    </main>
  );
};

export default Home;
