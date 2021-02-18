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
      <Web3Wrapper />
    </div>
  );
}
