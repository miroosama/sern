pragma solidity >=0.4.16 <0.9.0;

interface CEth {
    function mint() external payable;

    function exchangeRateCurrent() external returns (uint256);

    function supplyRatePerBlock() external returns (uint256);

    function redeem(uint) external returns (uint);

    function redeemUnderlying(uint) external returns (uint);

    function balanceOfUnderlying(address) external returns (uint);
}


contract CompoundWallet {
  event WalletLog(string, uint256);

  constructor() public payable { }

  function supplyEthToCompound(address payable _cEtherContract, uint256 _amount) public payable returns (bool) {
    CEth cToken = CEth(_cEtherContract);

    uint256 exchangeRateMantissa = cToken.exchangeRateCurrent();
    emit WalletLog("Exchange Rate (scaled up by 1e18): ", exchangeRateMantissa);

    uint256 supplyRateMantissa = cToken.supplyRatePerBlock();
    emit WalletLog("Supply Rate: (scaled up by 1e18)", supplyRateMantissa);

    cToken.mint.value(_amount).gas(250000)();
    return true;
  }
  // convert back to eth from cToken
  function redeemCEth(address _cEtherContract, address _fundAddress) public returns (bool) {
    CEth cToken = CEth(_cEtherContract);
    uint256 tokens = cToken.balanceOfUnderlying(_fundAddress);

    uint256 redeemResult = cToken.redeemUnderlying(tokens);

    emit WalletLog("tokensAttempted", tokens);
    emit WalletLog("If this is not 0, there was an error", redeemResult);

    return true;
  }

  fallback() external payable {}

}
