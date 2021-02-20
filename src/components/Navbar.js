import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: 'black'
  },
  menuButton: {
    marginRight: theme.spacing(10),
  },
  title: {
    flexGrow: 1,
    fontSize: '20px'
  },
  account: {
    fontSize: '14px'
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const account = useSelector((state) => state.chain.account);
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.title}>
            ienai
          </Typography>
          <Typography className={classes.account}>
            { account }
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
