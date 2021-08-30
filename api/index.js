const express = require('express');
const app = express();
const PORT = 3001;

require('@babel/core').transform('code', {
  presets: ['@babel/preset-env'],
});

import citiesDB from './data/city.list.json';

app.use(express.json());

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.listen(PORT, () => console.log(`api is alive on http://localhost:${PORT}`));

// Utilities
const getCitiesByName = (name) => {
  return citiesDB.filter(
    (city) => city.name.toUpperCase() === name.toUpperCase()
  );
};

const getCityByCountryAndName = (country, name) => {
  return citiesDB.filter(
    (location) =>
      location.country.toUpperCase() === country.toUpperCase() &&
      location.name.toUpperCase() === name.toUpperCase()
  );
};

const getCityByCountryStateAndName = (country, state, name) => {
  return citiesDB.filter(
    (location) =>
      location.country.toUpperCase() === country.toUpperCase() &&
      location.state.toUpperCase() === state.toUpperCase() &&
      location.name.toUpperCase() === name.toUpperCase()
  );
};

// GET
app.get('/city/:name', (req, res) => {
  const { name } = req.params;

  res.status(200).send(getCitiesByName(name));
});

app.get('/city/:country/:name', (req, res) => {
  const { name, country } = req.params;

  res.status(200).send(getCityByCountryAndName(country, name)[0]);
});

app.get('/city/:country/:state/:name', (req, res) => {
  const { name, country, state } = req.params;

  res.status(200).send(getCityByCountryStateAndName(country, state, name)[0]);
});
