import React, { useEffect, useState } from 'react';
import '../styles/Home.scss';
import SearchBar from '../components/SearchBar';
import { useGlobalContext } from '../context';
import { useRouteMatch } from 'react-router-dom';
import Slider from '../components/Slider';
import {
  getDayFromUnix,
  getFullDateTimeFromUnix,
  getHoursFromUnix,
} from '../components/utils/timeConverter';
import {
  faArrowDown,
  faArrowUp,
  faWind,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SemiCircleChart from '../components/SemiCircleChart';

const LOCATION_URL = 'https://my-api-for-weather-location.herokuapp.com/city/';

/**
 *
 * @param  lat location lat
 * @param  lon location lon
 * @param  units For temperature in Fahrenheit and wind speed in miles/hour, use units=imperial
                For temperature in Celsius and wind speed in meter/sec, use units=metric
 * @returns url for http get request
 */
const getWeatherUrl = (lat, lon, units) => {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=${units}`;
};

const getLocationUrlParams = (country, state, location) => {
  return `${country}${state !== undefined ? `/${state}` : ''}/${location}`;
};

const getDirectionByDegree = (degree, longName) => {
  if ((degree >= 0 && degree <= 30) || degree > 330) {
    return longName ? 'North' : 'N';
  } else if (degree > 30 && degree <= 60) {
    return longName ? 'North-East' : 'NE';
  } else if (degree > 60 && degree <= 120) {
    return longName ? 'East' : 'E';
  } else if (degree > 120 && degree <= 150) {
    return longName ? 'South-East' : 'SE';
  } else if (degree > 150 && degree <= 210) {
    return longName ? 'South' : 'S';
  } else if (degree > 210 && degree <= 240) {
    return longName ? 'South-West' : 'SW';
  } else if (degree > 240 && degree <= 300) {
    return longName ? 'West' : 'W';
  } else if (degree > 300 && degree <= 330) {
    return longName ? 'North-West' : 'NW';
  }
};

const getVisibilityByMetres = (visibility) => {
  if (visibility < 40) {
    return 'dense fog';
  } else if (visibility < 100) {
    return 'thick fog';
  } else if (visibility < 200) {
    return 'fog';
  } else if (visibility < 400) {
    return 'slight fog';
  } else if (visibility < 1000) {
    return 'below average';
  } else if (visibility < 2000) {
    return 'slightly below average';
  } else if (visibility < 7000) {
    return 'average';
  } else if (visibility < 10000) {
    return 'good';
  } else {
    return 'excelent';
  }
};

const getHumidityByPercent = (percent) => {
  if (percent < 25) {
    return 'poor low';
  } else if (percent < 30 || (percent >= 60 && percent < 70)) {
    return 'fair';
  } else if (percent < 60) {
    return 'good';
  } else {
    return 'poor high';
  }
};

const getPressureByhPa = (hPa) => {
  if (hPa <= 1009) {
    return 'low';
  } else if (hPa > 1009 && hPa <= 1022) {
    return 'normal';
  } else {
    return 'high';
  }
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
  const [currentDateTime, setCurrentDateTime] = useState({});
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
      setCurrentDateTime(
        getFullDateTimeFromUnix(
          weatherData.current.dt + weatherData.timezone_offset
        )
      );

      console.log(weatherData.current);

      // set slides
      const dataForTodaySlides = weatherData.hourly.slice(0, 24).map((hour) => {
        return {
          header: getHoursFromUnix(hour.dt + weatherData.timezone_offset),
          icon: `/assets/weather-icons/${hour.weather[0].icon}.png`,
          main: [`${Math.round(hour.temp)}°`],
          footer: (
            <>
              <FontAwesomeIcon icon={faWind} />
              {` ${hour.wind_speed.toFixed(1)} ${
                metrics === 'metric' ? 'm/s' : 'mph'
              }`}
            </>
          ),
        };
      });
      setSlidesDataToday(dataForTodaySlides);

      const dataForWeekSlides = weatherData.daily.map((day) => {
        return {
          header: getDayFromUnix(day.dt + weatherData.timezone_offset),
          icon: `/assets/weather-icons/${day.weather[0].icon}.png`,
          main: [
            `${Math.round(day.temp.max)}°`,
            `${Math.round(day.temp.min)}°`,
          ],
          footer: (
            <>
              <FontAwesomeIcon icon={faWind} />
              {` ${Math.round(day.temp.max)} ${
                metrics === 'metric' ? 'm/s' : 'mph'
              }`}
            </>
          ),
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

  if (currentWeather.dt === undefined) {
    return (
      <main className="grid grid-loading">
        <div class="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </main>
    );
  }

  return (
    <main className="grid">
      <section id="grid-1" className="wrapper">
        <SearchBar
          placeholder="Enter place name"
          fetchCallback={fetchLocations}
        />
        <div className="current-weather-data">
          {currentWeather.weather !== undefined && (
            <section className="weather-data">
              <div className="split">
                <img
                  // key={`current-weather-${
                  // currentWeather.weather[0].icon
                  // }-${Math.random()}`}
                  src={`/assets/weather-icons/${currentWeather.weather[0].icon}.png`}
                  alt={currentWeather.weather[0].main}
                  className={`weather-icon ${
                    currentWeather.dt === undefined ? 'skeleton' : ''
                  }`}
                />
                <p className="weather-data-description">
                  {currentWeather.weather[0].description}
                </p>
              </div>
              <div className="weather-temperature">
                <h2 className="weather-temperature-number">
                  {Math.round(currentWeather.temp)}°
                  {metrics === 'metric' ? 'C' : 'F'}
                </h2>
                <p className="weather-temperature-feels-like">
                  feels like {Math.round(currentWeather.feels_like)}°
                  {metrics === 'metric' ? 'C' : 'F'}
                </p>
              </div>
              <div className="weather-current-date">
                <p>
                  {currentDateTime.date} of {currentDateTime.month}
                </p>
                <p>
                  {currentDateTime.weekDay},{' '}
                  <strong>{currentDateTime.time}</strong>
                </p>
              </div>
              <hr className="full-width-line" />
              <div className="current-weather-states">
                {/* clouds */}
                <article className="current-weather-state">
                  <img src="/assets/weather-icons/03d.png" alt="cloud img" />
                  <p>clouds - {currentWeather.clouds}%</p>
                </article>

                {/* rain */}
                {currentWeather.rain !== undefined && (
                  <article className="current-weather-state">
                    <img src="/assets/weather-icons/09d.png" alt="cloud img" />
                    <p>rain - {currentWeather.rain['1h'] * 100}%</p>
                  </article>
                )}
                {/* snow */}
                {currentWeather.snow !== undefined && (
                  <article className="current-weather-state">
                    <img src="/assets/weather-icons/13d.png" alt="cloud img" />
                    <p>rain - {currentWeather.snow['1h'] * 100}%</p>
                  </article>
                )}
              </div>
            </section>
          )}

          <div className="selected-location">
            <p>
              {location.name}
              {location.state ? `, ${location.state}` : ''}
            </p>
            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p>{location.country}</p>
              {location.country !== undefined && (
                <img
                  src={`https://www.countryflags.io/${location.country}/flat/24.png`}
                  alt={`${location.country} flag`}
                  style={{
                    marginLeft: '.6rem',
                    // verticalAlign: 'middle',
                    // display: 'inline-block',
                    // height: '100%',
                    // transform: 'translateY(3px)',
                  }}
                />
              )}
            </p>
          </div>
        </div>
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
          <div style={{ maxWidth: '100%', width: '100%' }}>
            <Slider
              slidesData={
                weatherTimeSpan === 'today' ? slidesDataToday : slidesDataWeek
              }
            />
          </div>
          <section className="today-highlights">
            <h2>Today's Highlights</h2>

            {currentWeather.weather !== undefined && (
              <div className="today-highlights-cards">
                <div className="today-highlights-card">
                  <header className="today-highlights-card-title">
                    UV Index
                  </header>
                  <main className="today-highlights-card-main full-height-center">
                    <SemiCircleChart
                      mainText={Math.round(currentWeather.uvi)}
                      // list={[0, 3, 6, 9, 12, 15]}
                      list={[0, 15]}
                      percent={((currentWeather.uvi / 15) * 100).toFixed(1)}
                    />
                  </main>
                </div>
                <div className="today-highlights-card">
                  <header className="today-highlights-card-title">
                    Wind Status
                  </header>
                  <main className="today-highlights-card-main">
                    <h4 className="today-highlights-card-main-text">
                      <strong>{currentWeather.wind_speed.toFixed(1)}</strong>{' '}
                      {metrics === 'metric' ? 'm/s' : 'mph'}
                    </h4>
                  </main>
                  <footer className="today-highlights-card-footer">
                    <div className="compass">
                      <div
                        className="compass-line"
                        style={{
                          transform: `rotate(${currentWeather.wind_deg}deg)`,
                        }}
                      ></div>
                    </div>
                    <p>{getDirectionByDegree(currentWeather.wind_deg)}</p>
                  </footer>
                </div>
                <div className="today-highlights-card">
                  <h3 className="today-highlights-card-title">
                    Sunrise & Sunset
                  </h3>
                  <main className="today-highlights-card-main full-height-center">
                    <div className="sun-time">
                      <div className="sun-time-sun">
                        <FontAwesomeIcon
                          className="sun-time-icon"
                          icon={faArrowUp}
                        />
                      </div>
                      <p>
                        {
                          getFullDateTimeFromUnix(
                            currentWeather.sunrise + weatherData.timezone_offset
                          ).time
                        }
                      </p>
                    </div>
                    <div className="sun-time">
                      <div className="sun-time-sun">
                        <FontAwesomeIcon
                          className="sun-time-icon"
                          icon={faArrowDown}
                        />
                      </div>
                      <p>
                        {
                          getFullDateTimeFromUnix(
                            currentWeather.sunset + weatherData.timezone_offset
                          ).time
                        }
                      </p>
                    </div>
                  </main>
                </div>
                <div className="today-highlights-card">
                  <header className="today-highlights-card-title">
                    Humidity
                  </header>
                  <main className="today-highlights-card-main">
                    <h4 className="today-highlights-card-main-text">
                      <strong>{currentWeather.humidity}</strong>
                      <span className="align-top">%</span>
                    </h4>
                  </main>
                  <footer className="today-highlights-card-footer">
                    <p>{getHumidityByPercent(currentWeather.humidity)}</p>
                  </footer>
                </div>
                <div className="today-highlights-card">
                  <header className="today-highlights-card-title">
                    Visibility
                  </header>
                  <main className="today-highlights-card-main">
                    <h4 className="today-highlights-card-main-text">
                      <strong>
                        {metrics === 'metric'
                          ? Math.round(currentWeather.visibility / 1000)
                          : Math.round(currentWeather.visibility / 1609)}
                      </strong>{' '}
                      {metrics === 'metric' ? 'km' : 'miles'}
                    </h4>
                  </main>
                  <footer className="today-highlights-card-footer">
                    <p>{getVisibilityByMetres(currentWeather.visibility)}</p>
                  </footer>
                </div>
                <div className="today-highlights-card">
                  <header className="today-highlights-card-title">
                    Pressure
                  </header>
                  <main className="today-highlights-card-main">
                    <h4 className="today-highlights-card-main-text">
                      <strong>{currentWeather.pressure}</strong> hPa
                    </h4>
                  </main>
                  <footer className="today-highlights-card-footer">
                    <p>{getPressureByhPa(currentWeather.pressure)}</p>
                  </footer>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </main>
  );
};

export default Home;
