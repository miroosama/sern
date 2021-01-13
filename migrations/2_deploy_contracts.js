const DaiToken = artifacts.require('DaiToken');

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();
};
