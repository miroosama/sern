import React, { useState, useEffect } from 'react'
import Web3 from 'web3';

import Navbar from './Navbar'
import Web3Wrapper from './Web3Wrapper';
import './App.css'

export default function App() {
  const [account, setAccount] = useState('0x0');
  const [web3Instance, setWeb3Instance] = useState();

  useEffect(() => {
    const loadWeb3 = async () => {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
      const accounts = await web3.eth.getAccounts();
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
