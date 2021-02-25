import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  Button,
  Paper,
  Typography
} from '@material-ui/core';

import { compoundCEthContractAbi } from '../../abis/CompoundCEthMainnetAbi';

const compoundCEthContractAddress = '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5';

export default function InvestmentFundContainer() {
  const investmentFundInstance = useSelector((state) => state.investmentFund.investmentFundInstance);
  const web3Instance = useSelector((state) => state.chain.web3Instance);
  const account = useSelector((state) => state.chain.account);
  const [fundBalance, setFundBalance] = useState(0);
  const [voteCount, setVoteCount] = useState(0);
  const [profit, setProfit] = useState(0);
  const [balanceInvested, setBalanceInvested] = useState(0);
  const [title, setTitle] = useState('-');
  const [description, setDescription] = useState('-');
  const compoundCEthContractAddress = '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5';
  const compoundCEthContract = new web3Instance.eth.Contract(compoundCEthContractAbi, compoundCEthContractAddress);

  const contributeToFund = async () => {
    const n = await investmentFundInstance.methods.currentBalance().call();
    const inv = await investmentFundInstance.methods.contribute().send({
      from: account,
      value: web3Instance.utils.toWei('1', 'ether')
    });
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
    // const n2 = await investmentFundInstance.methods.currentBalance().call()
    const n2 = await web3Instance.eth.getBalance(investmentFundInstance._address);
    console.log(n2)
    console.log(account)
    const invest = await investmentFundInstance.methods.invest(compoundCEthContractAddress, web3Instance.utils.toHex(n2)).send({
      from: account,
      gasLimit: web3Instance.utils.toHex(750000),
      gasPrice: web3Instance.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
    });
    const cycle = await investmentFundInstance.methods.inCycle().call();
    console.log(cycle)
    console.log(invest)
  }

  // wip withdraw GET CETH CONTRACT INSTANCE AND GET BALANCE OF UNDELRYING TO PASS INTO REDEEM
  const withdraw = async () => {

    // extract get balance of underlying for use global
    let balanceOfUnderlying = await compoundCEthContract.methods.balanceOfUnderlying(investmentFundInstance._address).call();
    // console.log(balanceOfUnderlying)
    balanceOfUnderlying = web3Instance.utils.fromWei(balanceOfUnderlying, 'wei');
    // balanceOfUnderlyingEth = web3.utils.fromWei(balanceOfUnderlying).toString();
    // already received in correct format just convert to hex
    // TODO programmatically retreive compoundCEthContract and refactor front end for second phase
    // balanceOfUnderlying = Math.floor(web3Instance.utils.fromWei(balanceOfUnderlying)); // "4.000000005482408467" account for large decimals
    // const amount = web3Instance.utils.toHex(balanceOfUnderlying);
    console.log(balanceOfUnderlying)
    // let cTokenBalance = await compoundCEthContract.methods.balanceOf(investmentFundInstance._address).call();
    //  console.log(cTokenBalance)
    // cTokenBalance = (cTokenBalance / 1e8).toString();
    // console.log("MyContract's cETH Token Balance:", cTokenBalance);

// Call redeem based on a cToken amount
    // const amount = web3Instance.utils.toHex(cTokenBalance * 1e8);
    const withdrawal = await investmentFundInstance.methods.withdrawInvestment(compoundCEthContractAddress).send({
      from: account,
      gasLimit: web3Instance.utils.toHex(750000),
      gasPrice: web3Instance.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
    });
    console.log(withdrawal)
  }

  const closeAccount = async () => {
    const dividends = await investmentFundInstance.methods.withdrawFunds().send({
      from: account
    });
    console.log(dividends)
  }

  useEffect(() => {
    const getContractData = async () => {
      const title = await investmentFundInstance.methods.title().call();
      const desc = await investmentFundInstance.methods.desc().call();
      const profit = await investmentFundInstance.methods.profit().call();
      const investorsVoted = await investmentFundInstance.methods.getVoters().call();
      const balanceOfFund = await investmentFundInstance.methods.currentBalance().call();
      setProfit(profit);
      setVoteCount(investorsVoted.length);
      setFundBalance(balanceOfFund);
      setTitle(title);
      setDescription(desc);
      // setBalanceInvested(compoundBalance)
    };
    getContractData();
  }, []);

  useEffect(() => {
    const getCompoundBalance = async () => {
      const a = await web3Instance.eth.getBalance(investmentFundInstance._address)
      const b = await web3Instance.eth.getBalance('0x4F3Acc0d0C891B4306bA6F90EcF5b2F818697a41')
      console.log(a)
      console.log(b)
      // const walletAddress = await investmentFundInstance.methods.walletAddress().call();
      const compoundBalance = await compoundCEthContract.methods.balanceOfUnderlying(investmentFundInstance._address).call();
      console.log(compoundBalance)
   //    const cTokenBalance = await compoundCEthContract.methods.balanceOf(investmentFundInstance._address).call();
   // console.log(cTokenBalance)
      setBalanceInvested(compoundBalance);
    };
    getCompoundBalance();
  }, []);

  const gethasWithdrawn = async () => {
    const arr = await investmentFundInstance.methods.getHasWithdrawn().call();
    console.log(arr)
  }

  return (
    <Grid container justify="space-between">
    <Grid item xs={4}>
      <Typography variant="h5">
        Fund Title: { title }
      </Typography>
      <Typography variant="h5">
        Fund Description: { description }
      </Typography>
      <br />
      <Typography variant="h6">
        Profit Withdraw: { profit }
      </Typography>
      <Typography variant="h6">
        Vote Count: { voteCount }
      </Typography>
      <Typography variant="h6">
        Fund Contributions: { fundBalance }
      </Typography>
      <Typography variant="h6">
        Current Investment Balance: { balanceInvested }
      </Typography>
    </Grid>
      <Grid item xs={5}>
        <Paper>
          <Button onClick={contributeToFund}>
            contributeToFund
          </Button>
          <Button onClick={vote}>
            vote
          </Button>
          <Button onClick={invest}>
            invest
          </Button>
          <Button onClick={withdraw}>
            withdraw
          </Button>
          <Button onClick={closeAccount}>
            withdraw profits from fund
          </Button>
          <Button onClick={gethasWithdrawn}>
            get has withdrawn
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}
