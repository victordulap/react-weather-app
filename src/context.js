import React, { useContext, useReducer } from 'react';
import reducer from './reducer';

const AppContext = React.createContext();

const initialState = {
  location: {},
  metrics: '',
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
