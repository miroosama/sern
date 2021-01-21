pragma solidity ^0.6.0;

import 'https://github.com/OpenZeppelin/openzeppelin-solidity/contracts/math/SafeMath.sol';
import './InvestmentFund.sol';

contract Portfolio {
  using SafeMath for uint256;

  InvestmentFund[] private investmentFunds

  event InvestmentFundStarted(
    address contractAddress,
    address fundStarter,
    string fundTitle,
    string fundDesc
  );

  function startFund(string _title, string _desc) external {
    InvestmentFund newFund = new InvestmentFund(msg.sender, _title, _desc);
    investmentFunds.push(newFund);
    emit InvestmentFundStarted(
      address(newFund);
      msg.sender,
      _title,
      _desc
    );
  }

  function returnAllProjects() external view returns (InvestmentFund[] memory) {
    return investmentFunds;
  }

}
