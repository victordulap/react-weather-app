const fetch = require('node-fetch');
// import fetch from 'node-fetch';
globalThis.fetch = fetch;

exports.handler = async (event, context) => {
  console.log(event);
  const { lat, lon, units } = event.queryStringParameters;
  const url = `${process.env.REACT_APP_WEATHER_URL}appid=${process.env.REACT_APP_WEATHER_API_KEY}&exclude=minutely&lat=${lat}&lon=${lon}&units=${units}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    console.log(message);
  }

  if (response.status === 429) {
    return response;
  }
  const data = await response.json();
  return data;
  // try {
  //   const { data } = await axios.get(url);

  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify(data);
  //   }
  // } catch (error) {
  //   const {status, statusText, headers, data} = error.response;
  //   return {
  //     statusCode: status,
  //     body: JSON.stringify({status, statusText, headers, data })
  //   }
  // }
};
