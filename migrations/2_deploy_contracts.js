const CompoundWallet = artifacts.require('CompoundWallet');
const Portfolio = artifacts.require('Portfolio');
const InvestmentFund = artifacts.require('InvestmentFund');

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(CompoundWallet);
  await deployer.deploy(InvestmentFund, 'genesis', 'genesis');
  await deployer.deploy(Portfolio);
};
