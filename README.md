# Weather-App

## Check out website!

https://vd-weather-app-react.netlify.app/
(Consider waiting ~15 seconds for first location search as the API is hosted on Heroku)

## Screen shots

### Desktop view

![Desktop-Version](./readme-images/desktop-version.png 'Optional Title')

### Mobile view

![Mobile-Version-1](./readme-images/mobile-version-1.png 'Optional Title')
![Mobile-Version-1](./readme-images/mobile-version-2.png 'Optional Title')

## Installation and Setup Instructions

Clone down this repository. You will need `node` and `npm` installed globally on your machine.

Installation:

`npm install`

To Start Server:

`npm start-netlify`

To Visit App:

`localhost:8888`

## Reflection

- The main idea of this project was to build a weather web-application with modern UI, using learned technologies and learning more in process.
- Originally I wanted to build a modern-looking weather web-application that allowed users to pull data from the OpenWeather API based on the selected location. I started this process by using the `create-react-app` boilerplate, then adding `react-router-dom` and `node-sass`.
- This project includes many parts of a modern website needs like responsivness, modern UI, pleasurable UX, usage of an API, hiding stuff like API keys and using them from a server
- Some problems I had in development process
  - First obstacle I occured was that I had the design only for Desktop so I made the Desktop version first which made it a little more challanging to adapt to mobile, but in the end managed to do it.
  - The second thing I realised was that I had to create an API to fetch data from, a Location API (github: https://github.com/victordulap/GetLocationRestAPI), to fetch data from a 40 MB json provided file, because if I did that in the Front-end part, it would load a lot.
  - Also one task that took me some days was to host the API on Heroku and the Front-end on netlify, because that was my first time doing it, so I ran in problems with CORS, using API keys from `.env` file and setting up netlify functions.
- At the end of the day, the technologies implemented in this project are React, React-Router-Dom, Sass, Netlify-functions and of course JSX. I chose to use the `create-react-app` boilerplate to initialize the setup.
