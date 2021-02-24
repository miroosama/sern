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
  const [title, setTitle] = useState('-');
  const [description, setDescription] = useState('-');

  const contributeToFund = async () => {
    const n = await investmentFundInstance.methods.currentBalance().call();
    const inv = await investmentFundInstance.methods.contribute().send({
      from: account,
      value: web3Instance.utils.toWei('1', 'ether')
    });
    const n2 = await investmentFundInstance.methods.currentBalance().call()
  }

  const vote = async () => {
    const vote = await investmentFundInstance.methods.vote().send({
      from: account
    });
    console.log(vote)
  }
  console.log(investmentFundInstance)
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
    const cycle = await investmentFundInstance.methods.inCycle().call();
    console.log(cycle)
    console.log(invest)
  }

  // wip withdraw GET CETH CONTRACT INSTANCE AND GET BALANCE OF UNDELRYING TO PASS INTO REDEEM
  const withdraw = async () => {
    const compoundCEthContractAddress = '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5';

    const compoundCEthContract = new web3Instance.eth.Contract(compoundCEthContractAbi, compoundCEthContractAddress);

    // extract get balance of underlying for use global
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

  const closeAccount = async () => {
    // const initialInvestment = await investmentFundInstance.methods.investments(account).call();
    // const percentageOfProfit = initialInvestment / fundBalance;
    // const amountToSend = profit * percentageOfProfit;
    const dividends = await investmentFundInstance.methods.withdrawFunds().send({
      from: account
    });
    console.log(dividends)
  }

  useEffect(() => {
    console.log(investmentFundInstance)
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
    };
    getContractData();
  }, [])

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
        Current Profit: { profit }
      </Typography>
      <Typography variant="h6">
        Vote Count: { voteCount }
      </Typography>
      <Typography variant="h6">
        Fund Balance: { fundBalance }
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
