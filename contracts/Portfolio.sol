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

  function startFund(string memory _fundTitle, string memory _fundDesc) public {
    InvestmentFund newFund = new InvestmentFund(_fundTitle, _fundDesc);
    investmentFunds.push(newFund);
    emit InvestmentFundStarted(
      address(newFund),
      msg.sender,
      _fundTitle,
      _fundDesc
    );
  }

  function returnAllProjects() public view returns (InvestmentFund[] memory) {
    return investmentFunds;
  }

}
