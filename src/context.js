import React, { useContext, useReducer } from 'react';
import reducer from './reducer';

const AppContext = React.createContext();

const initialState = {
  city: {},
  metrics: 'C',
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setCity = (newCity) => {
    dispatch({ type: 'SET_CITY', payload: newCity });
  };

  const setMetrics = (metrics) => {
    dispatch({ type: 'SET_METRICS', payload: metrics });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setCity,
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
