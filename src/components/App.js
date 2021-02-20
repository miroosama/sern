import React, { useState, useEffect } from 'react'
import {
  Grid,
  Button,
  Typography
} from '@material-ui/core';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Web3 from 'web3';
import { MuiThemeProvider } from '@material-ui/core/styles';

import InvestmentFundContainer from './InvestmentFund/InvestmentFundContainer';
import PortfolioContainer from './Portfolio/PortfolioContainer';
import ProtectedRoute from './ProtectedRoute';
import Web3Wrapper from './Web3Wrapper';
import './App.css'
import { muiTheme } from '../styles/MuiTheme';

export default function App() {
  return (
    <div className="app">
      <MuiThemeProvider theme={muiTheme}>
        <Web3Wrapper />
        <div className="home">
          <Switch>
            <Route exact path="/portfolio">
              <PortfolioContainer />
            </Route>
            <ProtectedRoute
              exact
              path="/fund"
              component={InvestmentFundContainer}
            />
            <Route exact path="*">
              <Redirect to="/portfolio" />
            </Route>
          </Switch>
        </div>
      </MuiThemeProvider>
    </div>
  );
}
