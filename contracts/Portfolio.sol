pragma solidity ^0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import './InvestmentFund.sol';

contract Portfolio {
  using SafeMath for uint256;

  InvestmentFund[] private investmentFunds;

  event InvestmentFundStarted(
    address contractAddress,
    address fundStarter,
    string fundTitle,
    string fundDesc
  );

  function startFund(string calldata _fundTitle, string calldata  _fundDesc) external {
    InvestmentFund newFund = new InvestmentFund(msg.sender, _fundTitle, _fundDesc);
    investmentFunds.push(newFund);
    emit InvestmentFundStarted(
      address(newFund),
      msg.sender,
      _fundTitle,
      _fundDesc
    );
  }

  function returnAllProjects() external view returns (InvestmentFund[] memory) {
    return investmentFunds;
  }

}
