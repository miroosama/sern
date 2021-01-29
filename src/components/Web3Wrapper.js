import React, { useState, useEffect } from 'react'
import Web3 from 'web3';

import CompoundWallet from '../abis/CompoundWallet.json';
import InvestmentFund from '../abis/InvestmentFund.json';
import Portfolio from '../abis/Portfolio.json';
import Navbar from './Navbar';

export default function Web3Wrapper({ web3 }) {
  const [account, setAccount] = useState();
  const [portfolio, setPortfolio] = useState();
  useEffect(() => {
    const loadWeb3 = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      setAccount(accounts[0]);
      const portfolioNetwork = Portfolio.networks[networkId];
      const investmentFundNetwork = InvestmentFund.networks[networkId];

     if (portfolioNetwork) {
       const portfolioContract = new web3.eth.Contract(Portfolio.abi, portfolioNetwork.address);
       console.log(portfolioContract)
       const newFund = await portfolioContract.methods.startFund('new fund', 'moon').send({
         from: accounts[0]
       });
       console.log(newFund)
       setPortfolio(portfolioContract)
       // const fundList = await portfolioContract.methods.returnAllProjects().call();
       // console.log(fundList)
       // const investmentFundContract = new web3.eth.Contract(InvestmentFund.abi, fundList[0]);
       // const investmentFund = await investmentFundContract.methods.title().call()

       // console.log(investmentFundContract)
       // console.log(investmentFund)

       // const contribution = await investmentFundContract.methods.contribute().send({
       //   from: accounts[0],
       //   value: web3.utils.toWei('10', 'ether')
       // });

       // const newBalance = await investmentFundContract.methods.currentBalance().call();
       // console.log(newBalance)

       // const daiTokenBalance = await daiToken.methods.balanceOf(accounts[0]).call();
       // setSmartContract({
       //   ...smartContract,
       //   daiToken
       // });
       // setDaiTokenBalance(daiTokenBalance.toString());
     } else {
       window.alert('dai token contract not detected');
     }
    };
    loadWeb3();
  }, []);

  const getFundList = async () => {
    const fundList = await portfolio.methods.returnAllProjects().call();
    console.log(fundList)
  }

  return (
    <div>
      <Navbar account={account} />
        <button onClick={getFundList}>
          getFundList
        </button>
    </div>
  );
}
