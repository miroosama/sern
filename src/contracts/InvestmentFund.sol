pragma solidity ^0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import './Wallet.sol';

contract InvestmentFund is Wallet {
  using SafeMath for uint256;

  address creator;
  uint256 public currentBalance;
  uint256 public votes;
  string public title;
  string public desc;

  address[] internal investors;
  address[] internal voters;
  mapping(address => uint256) public investments;

  event FundingReceived(address investor, uint amount, uint currentTotal);

  constructor(address _creator, string memory _title, string memory _desc) public {
    creator = _creator;
    title = _title;
    desc = _desc;
    currentBalance = 0;
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

  function invest() public payable {
    require(hasParticipated(investors, msg.sender), 'Unauthorized');
    require (hasVotes(), 'Not enough votes');
    save(address(this), currentBalance);
  }

}
