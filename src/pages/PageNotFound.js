import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context';

const PageNotFound = () => {
  const { location } = useGlobalContext();
  return (
    <div className="page-not-found">
      <h1>error 404, page not found</h1>
      <Link to={'/GB/London'}>Back to home</Link>
    </div>
  );
};

export default PageNotFound;
