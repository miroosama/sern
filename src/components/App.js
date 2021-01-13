import React, { useState, useEffect } from 'react'
import Web3 from 'web3';

import DaiToken from '../abis/DaiToken.json';
import TimoToken from '../abis/TimoToken.json';
import TokenFarm from '../abis/TokenFarm.json';
import Navbar from './Navbar'
import Web3Wrapper from './Web3Wrapper';
import './App.css'

export default function App() {

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
              <Web3Wrapper />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
