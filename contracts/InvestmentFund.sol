pragma solidity >=0.4.16 <0.9.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import './CompoundWallet.sol';

contract InvestmentFund is CompoundWallet {
  using SafeMath for uint256;

  address creator;
  address[] public hasWithdrawn;
  address[] public investors;
  address[] public voters;
  uint256 public fundsRaised;
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
    fundsRaised = 0;
  }

  modifier participatedAndVoted() {
    require(hasParticipated(investors, msg.sender), 'Unauthorized');
    require(hasVotes(), 'Not enough votes');
    _;
  }

  function contribute() external payable {
    investments[msg.sender] = investments[msg.sender].add(msg.value);
    fundsRaised = fundsRaised.add(msg.value);
    bool hasInvested = hasParticipated(investors, msg.sender);
    if (!hasInvested) {
      investors.push(msg.sender);
    }

    emit FundingReceived(msg.sender, msg.value, fundsRaised);
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

  function withdrawInvestment(address payable _cEtherContract) participatedAndVoted public payable {
    bool isProfit = redeemCEth(_cEtherContract, address(this));
    if (isProfit) {
      delete voters;
    }
  }

  function withdrawFunds(uint _amount) public payable returns (bool) {
    require(!hasParticipated(hasWithdrawn, msg.sender), 'Already withdrawn');
    require(hasParticipated(investors, msg.sender), 'Unauthorized');
    address payable receiver = msg.sender;
    receiver.transfer(_amount);
    hasWithdrawn.push(msg.sender);
    if (hasWithdrawn.length + 1 >= investors.length) {
      for (uint i = 0; i < investors.length; i++) {
        investments[investors[i]] = 0;
      }
      inCycle = false;
      delete investors;
      delete hasWithdrawn;
    }
    return true;
  }
}
