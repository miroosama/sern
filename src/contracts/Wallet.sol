pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IYDAI {
  function deposit(uint _amount) external;
  function withdraw(uint _shares) external;
  function balanceOf(address account) external view returns (uint);
  function getPricePerFullShare() external view returns (uint);
}

contract Wallet {
  address admin;
  IERC20 dai = IERC20(0x6B175474E89094C44Da98b954EedeAC495271d0F);
  IYDAI yDai = IYDAI(0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01);

  constructor() public {
    admin = msg.sender;
  }

  function save(uint amount) external {
    dai.transferFrom(msg.sender, address(this), amount);
    _save(amount);
  }

  function spend (uint amount, address recipient) external {
    require(msg.sender == admin, 'unauthorized');
    uint balanceShares = yDai.balanceOf(address(this));
    yDai.withdraw(balanceShares);
    dai.transfer(recipient, amount);
    uint balanceDai = dai.balanceOf(address(this));
    if (balanceDai > 0) {
      _save(balanceDai);
    }
  }

  function _save(uint amount) internal {
    dai.approve(address(yDai), amount);
    yDai.deposit(amount);
  }

  function balance() external view returns(uint) {
    uint price = yDai.getPricePerFullShare();
    uint balanceShares = yDai.balanceOf(address(this));
    return balanceShares * price;
  }

}
