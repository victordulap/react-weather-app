import React, { useContext, useReducer } from 'react';
import reducer from './reducer';

const AppContext = React.createContext();

const initialState = {
  city: {},
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setCity = (newCity) => {
    dispatch({ type: 'SET_CITY', payload: newCity });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setCity,
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
