import React, { useState, useEffect } from 'react'
import Web3 from 'web3';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import CompoundWallet from '../abis/CompoundWallet.json';
import Portfolio from '../abis/Portfolio.json';
import Navbar from './Navbar';
import InvestmentFundContainer from './InvestmentFund/InvestmentFundContainer';
import PortfolioContainer from './Portfolio/PortfolioContainer';

export default function Web3Wrapper({ web3 }) {
  const [account, setAccount] = useState();
  const [web3Instance, setWeb3Instance] = useState();
  const [portfolio, setPortfolio] = useState();
  const [investmentFundInstance, setinvestmentFundInstance] = useState();
  // const [compoundWalletInstance, setCompoundWalletInstance] = useState();
  const [investmentFunds, setInvestmentFunds] = useState();
  useEffect(() => {
    const loadWeb3 = async () => {
      let accounts;
      if (window.ethereum) {
        try {
          const accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
          // setAccounts(accounts);
          accounts = accs;
          setAccount(accs[0]);
        } catch (error) {
          if (error.code === 4001) {
            // User rejected request
          }

          // setError(error);
        }
      }
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
      // const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();

      // setAccount(accounts[0]);
      setWeb3Instance(web3);
      const portfolioNetwork = Portfolio.networks[networkId];
      // const investmentFundNetwork = InvestmentFund.networks[networkId];
      // const compoundWalletNetwork = CompoundWallet.networks[networkId];
     if (portfolioNetwork) {
       const portfolioContract = new web3.eth.Contract(Portfolio.abi, portfolioNetwork.address);
       setPortfolio(portfolioContract)
     } else {
       window.alert('contracts not detected');
     }
    };
    loadWeb3();
  }, []);

  const getMarketInfo = async() => {
    const start = Math.floor((Date.now() / 1000) - 3600)
    const end = Math.floor(Date.now() / 1000)
    //display cEth value from cTOken... look into supplying to DAI or ETH
    try {
        const resp = await axios.get(`https://api.compound.finance/api/v2//ctoken`);
        console.log(resp);
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
  };

  return (
    <div>
      <Navbar account={account} />
      <Button onClick={getMarketInfo}>
        getMarketInfo
      </Button>
      <PortfolioContainer
        account={account}
        portfolioInstance={portfolio}
        web3Instance={web3Instance}
      />
      <InvestmentFundContainer
        account={account}
        investmentFundInstance={investmentFundInstance}
        web3Instance={web3Instance}
      />
    </div>
  );
}
