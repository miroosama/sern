const Wallet = artifacts.require('Wallet');

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Wallet);
};
