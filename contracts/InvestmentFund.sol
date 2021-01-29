pragma solidity ^0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import './CompoundWallet.sol';

contract InvestmentFund is CompoundWallet {
  using SafeMath for uint256;

  address creator;
  uint256 public currentBalance;
  uint256 public profit;
  uint256 public votes;
  string public title;
  string public desc;

  address[] internal hasWithdrawn;
  address[] internal investors;
  address[] internal voters;
  mapping(address => uint256) public investments;

  event FundingReceived(address investor, uint amount, uint currentTotal);

  constructor(string memory _title, string memory _desc) public {
    creator = msg.sender;
    title = _title;
    desc = _desc;
    currentBalance = 0;
    profit = 0;
  }

  function contribute() external payable {
    investments[msg.sender] = investments[msg.sender].add(msg.value);
    currentBalance = currentBalance.add(msg.value);
    bool hasInvested = hasParticipated(investors, msg.sender);
    if (!hasInvested) {
      investors.push(msg.sender);
    }

    emit FundingReceived(msg.sender, msg.value, currentBalance);
  }

  function vote(address _voter) external {
    bool hasVoted = hasParticipated(voters, _voter);
    if (!hasVoted) {
      voters.push(_voter);
    }
  }

  function hasVotes() internal view returns (bool) {
    bool majorityVotes = voters.length >= (investors.length / 2);
    return majorityVotes;
  }

  function hasParticipated(address[] storage _addressList, address _investor) internal view returns (bool) {
    bool participated = false;
    for (uint i = 0; i < _addressList.length; i++) {
      if (_addressList[i] == _investor) {
        participated = true;
      }
    }
    return participated;
  }

  function invest(address payable _cEtherContract, uint256 _amount) public payable returns (bool) {
    require(hasParticipated(investors, msg.sender), 'Unauthorized');
    require (hasVotes(), 'Not enough votes');
    bool isInvested = supplyEthToCompound(_cEtherContract, _amount);
    return isInvested;
  }

  function withdrawInvestment(address payable _cEtherContract, uint256 _amount) public payable {
    require(_amount > 0, 'No profit yet!');
    require(hasParticipated(investors, msg.sender), 'Unauthorized');
    require (hasVotes(), 'Not enough votes');
    bool isProfit = redeemCEth(_cEtherContract, _amount);
    if (isProfit) {
      profit = address(this).balance;
    }
  }

  function withdrawFunds() public payable {
    require(profit > 0, 'Withdraw profit first');
    require(hasParticipated(hasWithdrawn, msg.sender), 'Already withdrawn');
    require(hasParticipated(investors, msg.sender), 'Unauthorized');
    uint256 initialInvestment = investments[msg.sender];
    uint256 percentageOfProfit = initialInvestment / currentBalance;
    uint256 amountToSend = profit * percentageOfProfit;
    msg.sender.transfer(amountToSend);
    hasWithdrawn.push(msg.sender);
    if (hasWithdrawn.length + 1 >= investors.length) {
      currentBalance = 0;
    }
  }

}
