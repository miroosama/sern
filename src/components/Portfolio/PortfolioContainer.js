import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';

import InvestmentFund from '../../abis/InvestmentFund.json';
import { setInvestmentFundInstance } from '../../actions/investmentFundActions';

export default function PortfolioContainer() {
  const dispatch = useDispatch();
  const history = useHistory();
  const portfolioInstance = useSelector((state) => state.chain.portfolioInstance);
  const web3Instance = useSelector((state) => state.chain.web3Instance);
  const account = useSelector((state) => state.chain.account);
  const [investmentFunds, setInvestmentFunds] = useState([]);

  const getFundList = async () => {
    const fundList = await portfolioInstance.methods.returnAllProjects().call();
    console.log(fundList);
    setInvestmentFunds(fundList);
  };

  useEffect(() => {
    if (portfolioInstance) getFundList();
  }, [portfolioInstance])

  const startFund = async () => {
    const newFund = await portfolioInstance.methods.startFund('new fund', 'moon').send({
      from: account
    });
    console.log(newFund);
    getFundList();
  };

  const getInvestmentContract = async (fund) => {
    const investmentFundContract = await new web3Instance.eth.Contract(InvestmentFund.abi, fund);
    console.log(investmentFundContract)
    dispatch(setInvestmentFundInstance(investmentFundContract));
    history.push('/fund');
  }

  return(
    <Grid container spacing={1} justify="space-between">
    <Grid item xs={4} style={{ alignItems: 'flex-end'}}>
      <Button onClick={startFund}>
        Start fund
      </Button>
    </Grid>
      <Grid item xs={4}>
        <Typography variant="h5">
          Fund List
        </Typography>
        <Paper>
          <List component="nav" aria-label="Investment Fund List">
            { investmentFunds.length
              ? investmentFunds.map((fund) => (
                  <ListItem key={fund} button onClick={() => getInvestmentContract(fund)}>
                    <ListItemText primary={fund} />
                  </ListItem>
                ))
              : <div>No data</div>
            }
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}
