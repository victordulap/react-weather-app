import React, { useContext, useReducer } from 'react';
import reducer from './reducer';

const AppContext = React.createContext();

const initialState = {
  location: {
    id: 2643743,
    name: 'London',
    state: '',
    country: 'GB',
    coord: { lat: 51.50853, lon: -0.12574 },
  },
  metrics: 'C',
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLocation = (newLocation) => {
    dispatch({ type: 'SET_LOCATION', payload: newLocation });
  };

  const setMetrics = (metrics) => {
    dispatch({ type: 'SET_METRICS', payload: metrics });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setLocation,
        setMetrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
