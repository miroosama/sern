pragma solidity >=0.4.16 <0.9.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import './CompoundWallet.sol';

contract InvestmentFund is CompoundWallet {
  using SafeMath for uint256;

  address creator;
  address[] public hasWithdrawn;
  address[] public investors;
  address[] public voters;
  uint256 public currentBalance;
  uint256 public profit;
  uint256 public votes;
  string public title;
  string public desc;
  bool public inCycle;

  mapping(address => uint256) public investments;

  event FundingReceived(address investor, uint amount, uint currentTotal);

  constructor(string memory _title, string memory _desc) public payable {
    creator = msg.sender;
    title = _title;
    desc = _desc;
    currentBalance = 0;
    profit = 0;
  }

  modifier participatedAndVoted() {
    require(hasParticipated(investors, msg.sender), 'Unauthorized');
    require(hasVotes(), 'Not enough votes');
    _;
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

  function vote() external {
    bool hasVoted = hasParticipated(voters, msg.sender);
    if (!hasVoted) {
      voters.push(msg.sender);
    }
  }

  function hasVotes() internal view returns (bool) {
    if (voters.length == 0) return false;
    uint256 voterCount = uint(voters.length);
    uint256 sufficientVotes = uint(investors.length) / 2;
    return voterCount >= sufficientVotes;
  }

  function getVoters() external view returns (address[] memory) {
    return voters;
  }

  function getHasWithdrawn() external view returns (address[] memory) {
    return hasWithdrawn;
  }

  function hasParticipated(
    address[] storage _addressList,
    address _investor
  ) internal view returns (bool) {
    bool participated = false;
    for (uint i = 0; i < _addressList.length; i++) {
      if (_addressList[i] == _investor) {
        participated = true;
      }
    }
    return participated;
  }

  function invest(address payable _cEtherContract, uint256 _amount) participatedAndVoted public returns (bool) {
    bool isInvested = supplyEthToCompound(_cEtherContract, _amount);
    if (isInvested) {
      inCycle = true;
      delete voters;
    }
    return isInvested;
  }
// finish validations and modifiers and withdrawal math. check actual profit values. Read compound docs on calc profits
  function withdrawInvestment(
    address payable _cEtherContract,
    uint256 _amount
  ) participatedAndVoted public payable {
    bool isProfit = redeemCEth(_cEtherContract, _amount);
    if (isProfit) {
      profit = _amount;
      delete voters;
    }
  }

  function withdrawFunds() public payable returns (uint256) {
    require(profit > 0, 'Withdraw profit first');
    require(!hasParticipated(hasWithdrawn, msg.sender), 'Already withdrawn');
    require(hasParticipated(investors, msg.sender), 'Unauthorized');
    uint256 initialInvestment = investments[msg.sender];
    uint256 percentageOfProfit = initialInvestment / currentBalance;
    uint256 amountToSend = profit * percentageOfProfit;
    address payable receiver = msg.sender;
    receiver.transfer(amountToSend);
    hasWithdrawn.push(msg.sender);
    if (hasWithdrawn.length == investors.length) {
      currentBalance = 0;
    }
    return amountToSend;
  }
}
