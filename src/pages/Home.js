import React, { useEffect, useState } from 'react';
import '../styles/Home.scss';
import SearchBar from '../components/SearchBar';
import { useGlobalContext } from '../context';
import { useRouteMatch } from 'react-router-dom';
import Slider from '../components/Slider';

const LOCATION_URL = 'http://localhost:3001/city/';

/**
 *
 * @param  lat location lat
 * @param  lon location lon
 * @param  units For temperature in Fahrenheit and wind speed in miles/hour, use units=imperial
                For temperature in Celsius and wind speed in meter/sec, use units=metric
 * @returns url for http get request
 */
const getWeatherUrl = (lat, lon, units) => {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=1e48af3b8791122ae401407d6206d2c9&units=${units}`;
};

// const slidesDataWeek = [];
// for (let i = 0; i < 7; i++) {
//   slidesDataWeek.push({
//     header: 'Mon',
//     icon: '01d',
//     footer: ['8', '-8'],
//   });
// }

// const slidesDataHourly = [];
// for (let i = 0; i < 25; i++) {
//   slidesDataHourly.push({
//     header: '12',
//     icon: '02d',
//     footer: ['12'],
//   });
// }

const Home = () => {
  // url params
  const { params } = useRouteMatch();
  const [urlParams, setUrlParams] = useState({ ...params });

  // slides
  const [slidesData, setSlidesData] = useState([]);

  const [weatherTimeSpan, setWeatherTimeSpan] = useState('today');
  const { location, setLocation, metrics, setMetrics } = useGlobalContext();

  const getWeatherUnits = () => {
    return metrics === 'C' ? 'metric' : 'imperial';
  };

  const fetchWeatherData = async (lat, lon, units) => {
    const response = await fetch(getWeatherUrl(lat, lon, units));
    const data = await response.json();
    return data;
  };

  const fetchLocations = async (locationSearchValue) => {
    const response = await fetch(LOCATION_URL + locationSearchValue);
    const data = await response.json();

    return data;
  };

  return (
    <main className="grid">
      <section id="grid-1">
        <div className="wrapper">
          <SearchBar
            placeholder="Enter city name"
            fetchCallback={fetchLocations}
            onSelectSuggestion={setLocation}
            // setUrlParams={setUrlParams}
          />
          {Object.keys(location) > 0 && (
            <div className="city">Selected location {location.name}</div>
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
          <main className="weather-expanded-info">
            <Slider slidesData={slidesData} />
          </main>
        </div>
      </div>
    </main>
  );
};

export default Home;
