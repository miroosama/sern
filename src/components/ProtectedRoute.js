import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const investmentFundInstance = useSelector((state) => state.investmentFund.investmentFundInstance);
  console.log(investmentFundInstance)
  return (
    <Route
      {...rest}
      render={
      (props) => {
        if (investmentFundInstance) {
          return <Component {...rest} {...props} />;
        }
        return <Redirect to={{ pathname: '/portfolio' }} />;
      }
    } />
  );
};

export default ProtectedRoute;
