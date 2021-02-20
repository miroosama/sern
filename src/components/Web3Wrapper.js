import React, {
  useState,
  useEffect,
  useMemo
} from 'react'
import { useDispatch } from 'react-redux';
import Web3 from 'web3';
import axios from 'axios';
import {
  Grid,
  Button,
  Typography
} from '@material-ui/core';

import CompoundWallet from '../abis/CompoundWallet.json';
import Portfolio from '../abis/Portfolio.json';
import Navbar from './Navbar';
import {
  setWeb3,
  setAccount,
  setPortfolioInstance
} from '../actions/chainActions';

export default function Web3Wrapper({ web3 }) {
  const dispatch = useDispatch();
  const [supplyRate, setSupplyRate] = useState();

  useEffect(() => {
    const loadWeb3 = async () => {
      let accounts;
      if (window.ethereum) {
        try {
          const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
          // setAccounts(accounts);
          accounts = accs;
          dispatch(setAccount(accs[0]));
        } catch (error) {
          if (error.code === 4001) {
            // User rejected request
          }

          // setError(error);
        }
      }
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
      dispatch(setWeb3(web3));
      const networkId = await web3.eth.net.getId();
      const portfolioNetwork = Portfolio.networks[networkId];
     if (portfolioNetwork) {
       const portfolioContract = new web3.eth.Contract(Portfolio.abi, portfolioNetwork.address);
       dispatch(setPortfolioInstance(portfolioContract));
     } else {
       window.alert('contracts not detected');
     }
    };

    const loadSupplyRate = async () => {
      try {
        const resp = await axios.get(`https://api.compound.finance/api/v2/ctoken`);
        if (resp.data) {
          const ethRate = resp.data.cToken.find((token) => token.underlying_symbol === 'ETH');
          console.log(parseFloat(ethRate.supply_rate.value))
          setSupplyRate(parseFloat(ethRate.supply_rate.value));
        }
      } catch (err) {
          // Handle Error Here
          console.error(err);
      }
    }
    loadSupplyRate();
    loadWeb3();
  }, []);

  const ethSupply = useMemo(() => (
    supplyRate
    ? ` ${(supplyRate * 100).toFixed(2)}%`
    : '-'
  ), [supplyRate]);

  return (
    <div>
      <Navbar />
      <div className="home">
        <Typography variant="h2" gutterBottom>
          ETH Supply APY:
          { ethSupply }
        </Typography>
      </div>
    </div>
  );
}
