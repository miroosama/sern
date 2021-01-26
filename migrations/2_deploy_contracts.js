const Wallet = artifacts.require('Wallet');
const Portfolio = artifacts.require('Portfolio');
// const InvestmentFund = artifacts.require('InvestmentFund');

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Wallet);
  await deployer.deploy(Portfolio);
  // await deployer.deploy(InvestmentFund);
};
