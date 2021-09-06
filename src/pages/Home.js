import React, { useEffect, useState } from 'react';
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

const Home = () => {
  // url params
  const { params } = useRouteMatch();

  // fetching error
  const [fetchingError, setFetchingError] = useState(false);

  // weatherData
  const [weatherData, setWeatherData] = useState({});
  const [currentWeather, setCurrentWeather] = useState({});
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // slides
  const [slidesDataToday, setSlidesDataToday] = useState([]);
  const [slidesDataWeek, setSlidesDataWeek] = useState([]);

  const [weatherTimeSpan, setWeatherTimeSpan] = useState('today');
  const { location, setLocation, metrics, setMetrics } = useGlobalContext();

  const resetCurrentWeather = () => {
    setCurrentWeather({});
  };

  const resetSlides = () => {
    setSlidesDataToday([]);
    setSlidesDataWeek([]);
  };

  const resetWeatherData = () => {
    setWeatherData({});
    resetSlides();
    resetCurrentWeather();
  };

  const fetchWeatherData = async (lat, lon) => {
    const response = await fetch(getWeatherUrl(lat, lon, metrics));
    console.log(response.status);
    if (response.status === 429) {
      setFetchingError(true);
    }
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
    // reset WeatherData, start loading state
    resetWeatherData();
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
      setMetrics('metric');
    }
  }, [params.country, params.state_name, params.location_name]);

  // if new location is set, get new weather data
  useEffect(() => {
    if (location.name !== undefined) {
      resetWeatherData();
      const { coord } = location;
      // get weather data by coordinates
      setWeatherDataAsync(coord.lat, coord.lon);
    }
  }, [location, metrics]);

  // if new weather data is set
  useEffect(() => {
    if (weatherData.current !== undefined) {
      setCurrentWeather(weatherData.current);

      // set slides
      const dataForTodaySlides = weatherData.hourly.slice(0, 24).map((hour) => {
        return {
          header: getHoursFromUnix(hour.dt + weatherData.timezone_offset),
          icon: hour.weather[0].icon,
          main: [`${Math.round(hour.temp)}°`],
          footer: `${hour.wind_speed.toFixed(1)} ${
            metrics === 'metric' ? 'm/s' : 'mph'
          }`,
        };
      });
      setSlidesDataToday(dataForTodaySlides);

      const dataForWeekSlides = weatherData.daily.map((day) => {
        return {
          header: getDayFromUnix(day.dt + weatherData.timezone_offset),
          icon: day.weather[0].icon,
          main: [
            `${Math.round(day.temp.max)}°`,
            `${Math.round(day.temp.min)}°`,
          ],
          footer: `${Math.round(day.temp.max)} ${
            metrics === 'metric' ? 'm/s' : 'mph'
          }`,
        };
      });
      setSlidesDataWeek(dataForWeekSlides);
    }
  }, [weatherData, metrics]); // added metrics

  if (fetchingError) {
    return (
      <main className="grid grid-error">
        <h2>ERROR: Too many API calls</h2>
      </main>
    );
  }

  return (
    <main className="grid">
      <section id="grid-1" className="wrapper">
        {/* <div className="wrapper"> */}
        <SearchBar
          placeholder="Enter city name"
          fetchCallback={fetchLocations}
        />
        <div className="current-weather-data">
          <div className="selected-location">
            Selected location {location.name}
            {', '}
            {location.state ? `${location.state},` : ''} {location.country}
          </div>
        </div>
        {/* </div> */}
      </section>
      <div id="grid-2" className="wrapper">
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
                metrics === 'metric' ? 'active' : ''
              }`}
              onClick={() => setMetrics('metric')}
            >
              °C
            </button>
            <button
              className={`btn weather-metrics-btn ${
                metrics === 'imperial' ? 'active' : ''
              }`}
              onClick={() => setMetrics('imperial')}
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
    </main>
  );
};

export default Home;
