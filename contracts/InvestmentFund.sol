pragma solidity ^0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import './CompoundWallet.sol';

contract InvestmentFund {
  using SafeMath for uint256;

  address creator;
  address public walletAddress;
  address[] public hasWithdrawn;
  address[] public investors;
  address[] public voters;
  uint256 public currentBalance;
  uint256 public profit;
  uint256 public votes;
  string public title;
  string public desc;

  mapping(address => uint256) public investments;

  event FundingReceived(address investor, uint amount, uint currentTotal);

  constructor(string memory _title, string memory _desc) public {
    creator = msg.sender;
    title = _title;
    desc = _desc;
    currentBalance = 0;
    profit = 0;
    walletAddress = address(new CompoundWallet());
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
    bool majorityVotes = voters.length >= (investors.length / 2);
    return majorityVotes;
  }

  function getVoters() external view returns (address[] memory) {
    return voters;
  }

  function getHasWithdrawn() external view returns (address[] memory) {
    return hasWithdrawn;
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

  function invest(address payable _cEtherContract) public payable returns (bool) {
    bool participated = hasParticipated(investors, msg.sender);
    bool sufficientVotes = hasVotes();
    require(participated, 'Unauthorized');
    require(sufficientVotes, 'Not enough votes');
    CompoundWallet compoundWallet = CompoundWallet(walletAddress);
    bool isInvested = compoundWallet.supplyEthToCompound.value(msg.value).gas(2500000)(_cEtherContract);
    return isInvested;
  }

  function withdrawInvestment(address payable _cEtherContract, uint256 _amount) public payable {
    bool participated = hasParticipated(investors, msg.sender);
    bool sufficientVotes = hasVotes();
    require(participated, 'Unauthorized');
    require(sufficientVotes, 'Not enough votes');
    CompoundWallet compoundWallet = CompoundWallet(walletAddress);
    bool isProfit = compoundWallet.redeemCEth(_cEtherContract, _amount);
    if (isProfit) {
      profit = _amount;
    }
  }

  function withdrawFunds() public payable returns (uint256) {
    bool participated = hasParticipated(hasWithdrawn, msg.sender);
    bool isAuthorized = hasParticipated(investors, msg.sender);
    require(profit > 0, 'Withdraw profit first');
    require(!participated, 'Already withdrawn');
    require(isAuthorized, 'Unauthorized');
    uint256 initialInvestment = investments[msg.sender];
    uint256 percentageOfProfit = initialInvestment / currentBalance;
    uint256 amountToSend = profit * percentageOfProfit;
    address payable receiver = msg.sender;
    receiver.transfer(amountToSend);
    hasWithdrawn.push(msg.sender);
    if (hasWithdrawn.length + 1 >= investors.length) {
      currentBalance = 0;
    }
    return amountToSend;
  }

}
