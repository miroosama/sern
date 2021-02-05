import React, { useState, useEffect } from 'react'
import Web3 from 'web3';

import Web3Wrapper from './Web3Wrapper';
import './App.css'

export default function App() {

  // useEffect(() => {
    // const enableMetamask = async () => {
    //   if (window.ethereum) {
    //     try {
    //       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //       setAccounts(accounts);
    //     } catch (error) {
    //       if (error.code === 4001) {
    //         // User rejected request
    //       }
    //
    //       // setError(error);
    //     }
    //   }
    // }
    // enableMetamask();
  // }, [])

  return (
    <div>
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
