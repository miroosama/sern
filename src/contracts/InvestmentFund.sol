pragma solidity ^0.6.0;

import './Wallet.sol';

contract InvestmentFund is Wallet {
  address proposer;
  uint256 fundsRaised;
  mapping(address => uint256) public pledgeOf;

  constructor() {
    proposer = msg.sender;
  }

  function pledge(uint256 amount) public payable {
    require(msg.value == amount);
    msg.sender.transfer()
  }
}
