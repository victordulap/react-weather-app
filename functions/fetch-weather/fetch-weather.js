const fetch = require('node-fetch');

const handler = async function (event) {
  try {
    const { lat, lon, units } = event.queryStringParameters;
    const url = `${process.env.WEATHER_URL}?appid=${process.env.WEATHER_API_KEY}&exclude=minutely&lat=${lat}&lon=${lon}&units=${units}`;
    // const REACT_APP_WEATHER_API_KEY = '1e48af3b8791122ae401407d6206d2c9';
    // const REACT_APP_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/onecall';
    // const url = `${REACT_APP_WEATHER_URL}?appid=${REACT_APP_WEATHER_API_KEY}&exclude=minutely&lat=${lat}&lon=${lon}&units=${units}`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    // output to netlify function log
    console.log(error);
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    };
  }
};

module.exports = { handler };
