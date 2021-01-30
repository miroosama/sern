import React, { useState, useEffect } from 'react'
import Web3 from 'web3';

import CompoundWallet from '../abis/CompoundWallet.json';
import InvestmentFund from '../abis/InvestmentFund.json';
import Portfolio from '../abis/Portfolio.json';
import Navbar from './Navbar';

const compoundCEthContractAddress = '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5';

export default function Web3Wrapper({ web3 }) {
  const [account, setAccount] = useState();
  const [web3Instance, setWeb3Instance] = useState();
  const [portfolio, setPortfolio] = useState();
  const [investmentFundInstance, setinvestmentFundInstance] = useState();
  const [investmentFunds, setInvestmentFunds] = useState();
  useEffect(() => {
    const loadWeb3 = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      setAccount(accounts[0]);
      setWeb3Instance(web3);
      const portfolioNetwork = Portfolio.networks[networkId];
      const investmentFundNetwork = InvestmentFund.networks[networkId];

     if (portfolioNetwork) {
       const portfolioContract = new web3.eth.Contract(Portfolio.abi, portfolioNetwork.address);
       console.log(portfolioContract)
       // const newFund = await portfolioContract.methods.startFund('new fund', 'moon').send({
       //   from: accounts[0]
       // });
       // console.log(newFund)
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
    setInvestmentFunds(fundList)
  }

  const getInvestmentContract = async () => {
    const investmentFundContract = new web3Instance.eth.Contract(InvestmentFund.abi, investmentFunds[0]);
    setinvestmentFundInstance(investmentFundContract)
    const n = await investmentFundContract.methods.currentBalance().call()
    const inv = await investmentFundContract.methods.contribute().send({
      from: account,
      value: web3Instance.utils.toWei('1', 'ether')
    })
    const n2 = await investmentFundContract.methods.currentBalance().call()
    console.log(inv)
    console.log(n)
    console.log(n2)

    console.log(investmentFundContract)
  }

  const vote = async () => {
    //make msg.sender
    const vote = await investmentFundInstance.methods.vote(account).call();
    console.log(vote)
  }

  const invest = async () => {
    const n2 = await investmentFundInstance.methods.currentBalance().call()
    const invest = await investmentFundInstance.methods.invest(compoundCEthContractAddress, n2).call();
    console.log(invest)
  }

  const getVoters = async () => {
    const invest = await investmentFundInstance.methods.voters().call();
    console.log(invest)
  }

  return (
    <div>
      <Navbar account={account} />
        <button onClick={getFundList}>
          getFundList
        </button>
        <button onClick={getInvestmentContract}>
          getContract and contribute
        </button>
        <button onClick={vote}>
          vote
        </button>
        <button onClick={invest}>
          invest
        </button>
        <button onClick={getVoters}>
          getVoters
        </button>
    </div>
  );
}
