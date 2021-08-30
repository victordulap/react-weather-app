import React, { useEffect, useRef, useState } from 'react';
import '../styles/Home.scss';
import SearchBar from '../components/SearchBar';
import { useGlobalContext } from '../context';
import { useRouteMatch } from 'react-router-dom';
import Slider from '../components/Slider';
import {
  getDayFromUnix,
  getHoursFromUnix,
} from '../components/utils/timeConverter';

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

const getLocationUrlParams = (country, state, location) => {
  return `${country}${state !== undefined ? `/${state}` : ''}/${location}`;
};

const defaultLocation = {
  id: 2643743,
  name: 'London',
  state: '',
  country: 'GB',
  coord: { lat: 51.50853, lon: -0.12574 },
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
  // const [urlParams, setUrlParams] = useState({});

  // weatherData
  const [weatherData, setWeatherData] = useState({});
  // const currentWeather = useRef({});
  const [currentWeather, setCurrentWeather] = useState({});

  // slides
  const [slidesDataToday, setSlidesDataToday] = useState([]);
  const [slidesDataWeek, setSlidesDataWeek] = useState([]);

  const [weatherTimeSpan, setWeatherTimeSpan] = useState('today');
  const { location, setLocation, metrics, setMetrics } = useGlobalContext();

  const getWeatherUnits = () => {
    return metrics === 'C' ? 'metric' : 'imperial';
  };

  const resetCurrentWeather = () => {
    setCurrentWeather({});
  };

  const resetWeatherData = () => {
    setWeatherData({});
    resetSlides();
    resetCurrentWeather();
  };

  const resetSlides = () => {
    setSlidesDataToday([]);
    setSlidesDataWeek([]);
  };

  const fetchWeatherData = async (lat, lon) => {
    const response = await fetch(getWeatherUrl(lat, lon, getWeatherUnits()));
    const data = await response.json();
    return data;
  };

  const fetchLocations = async (locationSearchValue) => {
    const response = await fetch(LOCATION_URL + locationSearchValue);
    const data = await response.json();
    return data;
  };

  // async functions
  const setLocationAsync = async (url) => {
    setLocation(await fetchLocations(url));
  };

  const setWeatherDataAsync = async (lat, lon) => {
    setWeatherData(await fetchWeatherData(lat, lon));
  };

  // get url params and set location (if accessed directly from link)
  useEffect(() => {
    // if params are given, otherwise default location is London
    if (params.location_name !== undefined) {
      // set location by url params
      const url = getLocationUrlParams(
        params.country,
        params.state_name,
        params.location_name
      );
      setLocationAsync(url);
    } else {
      setLocation(defaultLocation);
    }
  }, [params.country, params.state_name, params.location_name]);

  // if new location is set, get new weather data
  useEffect(() => {
    if (location.name !== undefined) {
      resetWeatherData();

      const { coord } = location;
      // get weather data by coordinates
      setWeatherDataAsync(coord.lat, coord.lon);

      // slides data
    }
  }, [location, metrics]);

  // if new weather data is set
  useEffect(() => {
    if (weatherData.current !== undefined) {
      // currentWeather.current = weatherData.current;
      setCurrentWeather(weatherData.current);

      // set slides
      const dataForTodaySlides = weatherData.hourly.slice(0, 24).map((hour) => {
        return {
          header: getHoursFromUnix(hour.dt + weatherData.timezone_offset),
          icon: hour.weather[0].icon,
          footer: [Math.round(hour.temp)],
        };
      });
      setSlidesDataToday(dataForTodaySlides);

      const dataForWeekSlides = weatherData.daily.map((day) => {
        return {
          header: getDayFromUnix(day.dt + weatherData.timezone_offset),
          icon: day.weather[0].icon,
          footer: [Math.round(day.temp.max), Math.round(day.temp.min)],
        };
      });
      setSlidesDataWeek(dataForWeekSlides);
    }
  }, [weatherData]);

  return (
    <main className="grid">
      <section id="grid-1">
        <div className="wrapper">
          <SearchBar
            placeholder="Enter city name"
            fetchCallback={fetchLocations}
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
            <Slider
              slidesData={
                weatherTimeSpan === 'today' ? slidesDataToday : slidesDataWeek
              }
            />
            <div>
              <p style={{ fontSize: '16px', wordBreak: 'break-word' }}>
                {JSON.stringify(currentWeather)}
              </p>
            </div>
          </main>
        </div>
      </div>
    </main>
  );
};

export default Home;
