pragma solidity ^0.5.0;

import './TimoToken.sol';
import './DaiToken.sol';

contract TokenFarm {
  string public name = 'timo Token Farm';
  TimoToken public timoToken;
  DaiToken public daiToken;

  constructor(TimoToken _timoToken, DaiToken _daiToken) public {
    timoToken = _timoToken;
    daiToken = _daiToken;
  }

}
