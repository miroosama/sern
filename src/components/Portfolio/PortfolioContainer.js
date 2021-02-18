import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid, Button } from '@material-ui/core';

import InvestmentFund from '../../abis/InvestmentFund.json';
import { setInvestmentFundInstance } from '../../actions/investmentFundActions';

export default function PortfolioContainer({ portfolioInstance, web3Instance, account }) {
  const dispatch = useDispatch();
  const [investmentFunds, setInvestmentFunds] = useState();

  const startFund = async () => {
    const newFund = await portfolioInstance.methods.startFund('new fund', 'moon').send({
      from: account
    });
    console.log(newFund)
  };

  const getFundList = async () => {
    const fundList = await portfolioInstance.methods.returnAllProjects().call();
    console.log(fundList)
    setInvestmentFunds(fundList);
  }

  const getInvestmentContract = async () => {
    const investmentFundContract = await new web3Instance.eth.Contract(InvestmentFund.abi, investmentFunds[0]);
    console.log(investmentFundContract)
    dispatch(setInvestmentFundInstance(investmentFundContract));
  }

  return(
    <Grid container direction="column">
      <Button onClick={startFund}>
        Start fund
      </Button>
      <Button onClick={getFundList}>
        getFundList
      </Button>
      <Button onClick={getInvestmentContract}>
        get investment fund contract
      </Button>
    </Grid>
  );
}
