import React, { useEffect, useRef, useState } from 'react';
import '../styles/Home.scss';
import SearchBar from '../components/SearchBar';
import { useGlobalContext } from '../context';
import { useRouteMatch } from 'react-router-dom';
import Slider from '../components/Slider';

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

  const gridTwoWrapperRef = useRef();

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

  useEffect(async () => {
    const { state_name, country, location_name } = urlParams;
    if (location_name != undefined) {
      let fetchURL = CITY_URL;
      if (state_name != '' && country != '' && location_name != '') {
        fetchURL += `${country}/${state_name}/${location_name}`;
      } else if (country != '' && location_name != '') {
        fetchURL += `${country}/${location_name}`;
      }
      const response = await fetch(fetchURL);
      const data = await response.json();
      setCity(data);
    }
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
        <div className="wrapper" ref={gridTwoWrapperRef}>
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
          <main className="weather-expanded-info">
            <Slider />
          </main>
        </div>
      </div>
    </main>
  );
};

export default Home;
