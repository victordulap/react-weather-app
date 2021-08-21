const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, city: action.payload };
    case 'SET_METRICS':
      return { ...state, metrics: action.payload };
    default:
      throw new Error('No matching action found');
  }
};

export default reducer;
