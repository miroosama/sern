import React, { useState, useEffect } from 'react'
import Web3 from 'web3';

import { compoundCEthContractAbi } from '../abis/CompoundCEthMainnetAbi';
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
      const investmentFundNetwork = InvestmentFund.networks[networkId];
      // const compoundWalletNetwork = CompoundWallet.networks[networkId];
     if (portfolioNetwork) {
       const portfolioContract = new web3.eth.Contract(Portfolio.abi, portfolioNetwork.address);
       // const compoundWalletContract = new web3.eth.Contract(CompoundWallet.abi, compoundWalletNetwork.address);
       // setCompoundWalletInstance(compoundWalletContract);

       // create a new fund first
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
       window.alert('contracts not detected');
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
    const vote = await investmentFundInstance.methods.vote().send({
      from: account
    });
    console.log(vote)
  }


  // keep track of address to get balance for withdraw
  // delete invested amount
  const invest = async () => {
    const n2 = await investmentFundInstance.methods.currentBalance().call()
    console.log(n2)
    console.log(account)
    const invest = await investmentFundInstance.methods.invest(compoundCEthContractAddress).send({
      from: account,
      value: web3Instance.utils.toHex(n2),
      gasLimit: web3Instance.utils.toHex(750000),
      gasPrice: web3Instance.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
    });
    console.log(invest)
  }

  // wip withdraw GET CETH CONTRACT INSTANCE AND GET BALANCE OF UNDELRYING TO PASS INTO REDEEM
  const withdraw = async () => {
    const compoundCEthContractAddress = '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5';

const compoundCEthContract = new web3Instance.eth.Contract(compoundCEthContractAbi, compoundCEthContractAddress);

    const walletAddress = await investmentFundInstance.methods.walletAddress().call();
    let balanceOfUnderlying = await compoundCEthContract.methods.balanceOfUnderlying(walletAddress).call();
    console.log(balanceOfUnderlying)
    // already received in correct format just convert to hex
    // TODO programmatically retreive compoundCEthContract and refactor front end for second phase
    // balanceOfUnderlying = Math.floor(web3Instance.utils.fromWei(balanceOfUnderlying)); // "4.000000005482408467" account for large decimals
    console.log(walletAddress);
    const amount = web3Instance.utils.toHex(balanceOfUnderlying);
    console.log(amount)
    const withdrawal = await investmentFundInstance.methods.withdrawInvestment(compoundCEthContractAddress, amount).send({
      from: account,
      gasLimit: web3Instance.utils.toHex(750000),
      gasPrice: web3Instance.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
    });
    console.log(withdrawal)
  }

  const getProfit = async () => {
    const n2 = await investmentFundInstance.methods.profit().call()
    console.log(n2)
  }

  const getVoters = async () => {
    const invest = await investmentFundInstance.methods.getVoters().call();
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
      <button onClick={withdraw}>
        withdraw
      </button>
      <button onClick={getProfit}>
        get profit
      </button>
    </div>
  );
}
