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
  const [raisedFunds, setRaisedFunds] = useState(0);
  const [voteCount, setVoteCount] = useState(0);
  const [profit, setProfit] = useState(0);
  const [balanceInvested, setBalanceInvested] = useState(0);
  const [title, setTitle] = useState('-');
  const [description, setDescription] = useState('-');
  const compoundCEthContractAddress = '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5';
  const compoundCEthContract = new web3Instance.eth.Contract(compoundCEthContractAbi, compoundCEthContractAddress);

  const contributeToFund = async () => {
    const n = await investmentFundInstance.methods.fundsRaised().call();
    const inv = await investmentFundInstance.methods.contribute().send({
      from: account,
      value: web3Instance.utils.toWei('1', 'ether')
    });
  }

  const vote = async () => {
    const vote = await investmentFundInstance.methods.vote().send({
      from: account
    });
  };

  const invest = async () => {
    const fundToInvest = await web3Instance.eth.getBalance(investmentFundInstance._address);
    const invest = await investmentFundInstance.methods.invest(compoundCEthContractAddress, web3Instance.utils.toHex(fundToInvest)).send({
      from: account,
      gasLimit: web3Instance.utils.toHex(750000),
      gasPrice: web3Instance.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
    });
    const cycle = await investmentFundInstance.methods.inCycle().call();
    console.log(cycle)
    console.log(invest)
  };

  const withdraw = async () => {
    let balanceOfUnderlying = await compoundCEthContract.methods.balanceOfUnderlying(investmentFundInstance._address).call();
    balanceOfUnderlying = web3Instance.utils.fromWei(balanceOfUnderlying, 'wei');
    const withdrawal = await investmentFundInstance.methods.withdrawInvestment(compoundCEthContractAddress).send({
      from: account,
      gasLimit: web3Instance.utils.toHex(750000),
      gasPrice: web3Instance.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
    });
  };

  const closeAccount = async () => {
    const seedFund = await investmentFundInstance.methods.investments(account).call();
    const percentageOfProfit = seedFund / raisedFunds;
    const profit = await web3Instance.eth.getBalance(investmentFundInstance._address);
    let amountToSend = profit * percentageOfProfit;
    const dividends = await investmentFundInstance.methods.withdrawFunds(amountToSend.toString()).send({
      from: account
    });
  };

  useEffect(() => {
    const getContractData = async () => {
      const title = await investmentFundInstance.methods.title().call();
      const desc = await investmentFundInstance.methods.desc().call();
      const profit = await web3Instance.eth.getBalance(investmentFundInstance._address);
      const investorsVoted = await investmentFundInstance.methods.getVoters().call();
      const fundsRaised = await investmentFundInstance.methods.fundsRaised().call();
      setProfit(profit);
      setVoteCount(investorsVoted.length);
      setRaisedFunds(fundsRaised);
      setTitle(title);
      setDescription(desc);
      // setBalanceInvested(compoundBalance)
    };
    getContractData();
  }, []);

  useEffect(() => {
    const getCompoundBalance = async () => {
      const compoundBalance = await compoundCEthContract.methods.balanceOfUnderlying(investmentFundInstance._address).call();
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
        Funds Raised: { raisedFunds }
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
