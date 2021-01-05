const TokenFarm = artifacts.require('TokenFarm');
const DaiToken = artifacts.require('DaiToken');
const TimoToken = artifacts.require('TimoToken');

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  await deployer.deploy(TimoToken);
  const timoToken = await TimoToken.deployed();

  await deployer.deploy(TokenFarm, timoToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  await timoToken.transfer(tokenFarm.address, '1000000000000000000000000');

  // transfer 100 mock dai to investor
  await daiToken.transfer(accounts[1], '100000000000000000000');
};
