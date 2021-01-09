import React, { useState, useEffect } from 'react'
import Web3 from 'web3';

import DaiToken from '../abis/DaiToken.json';
import TimoToken from '../abis/TimoToken.json';
import TokenFarm from '../abis/TokenFarm.json';
import Navbar from './Navbar'
import Web3Wrapper from './Web3Wrapper';
import './App.css'

export default function App() {
  const [account, setAccount] = useState('0x0');
  const [web3Instance, setWeb3Instance] = useState();
  const [networkId, setNetworkId] = useState();
  const [smartContract, setSmartContract] = useState({
    daiToken: {},
    timoToken: {},
    tokenFarm: {}
  });
  const [daiTokenBalance, setDaiTokenBalance] = useState();
  const [timoTokenBalance, setTimoTokenBalance] = useState();
  const [stakingBalance, setStakingBalance] = useState();
  // const [loading, setLoading] optional

  useEffect(() => {
    const loadWeb3 = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();

      const daiTokenData = DaiToken.networks[networkId];
      if (daiTokenData) {
        const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address);
        const daiTokenBalance = await daiToken.methods.balanceOf(accounts[0]).call();
        setSmartContract({
          ...smartContract,
          daiToken
        });
        setDaiTokenBalance(daiTokenBalance.toString());
      } else {
        window.alert('dai token contract not detected');
      }

      const timoTokenData = TimoToken.networks[networkId];
      if (timoTokenData) {
        const timoToken = new web3.eth.Contract(TimoToken.abi, timoTokenData.address);
        const timoTokenBalance = await timoToken.methods.balanceOf(accounts[0]).call();
        setSmartContract({
          ...smartContract,
          timoToken
        });
        setTimoTokenBalance(timoTokenBalance.toString());
      } else {
        window.alert('dai token contract not detected');
      }

      const tokenFarmData = TokenFarm.networks[networkId];
      if (tokenFarmData) {
        const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
        const tokenFarmBalance = await tokenFarm.methods.stakingBalance(accounts[0]).call();
        setSmartContract({
          ...smartContract,
          tokenFarm
        });
        setStakingBalance(tokenFarmBalance.toString());
      } else {
        window.alert('dai token contract not detected');
      }

      setNetworkId(networkId);
      setAccount(accounts[0]);
      setWeb3Instance(web3);
    };
    loadWeb3();
  }, []);

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
            <div className="content mr-auto ml-auto">
              <a
                href="http://www.dappuniversity.com/bootcamp"
                target="_blank"
                rel="noopener noreferrer"
              >
              </a>
              <Web3Wrapper web3={web3Instance} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
