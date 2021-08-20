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

// app.get('/t-shirt', (req, res) => {
//   res.status(200).send({
//     t: 'vetements',
//   });
// });

// app.get('/t-shirt/:id', (req, res) => {
//   const { id } = req.params;

//   res.status(200).send({
//     id,
//     t: 'vetements',
//   });
// });

const getCitiesByName = (name) => {
  return citiesDB.filter(
    (city) => city.name.toUpperCase() === name.toUpperCase()
  );
};

app.get('/city/:name', (req, res) => {
  const { name } = req.params;

  console.log(name);
  console.log(citiesDB.length);
  console.log(getCitiesByName(name));

  res.status(200).send(getCitiesByName(name));
});
