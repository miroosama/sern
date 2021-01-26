const Wallet = artifacts.require('Wallet');
const Portfolio = artifacts.require('Portfolio');
const InvestmentFund = artifacts.require('InvestmentFund');

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(Wallet);
  await deployer.deploy(Portfolio);
  await deployer.deploy(InvestmentFund, '0x2902Df4Cf4d88308c4cE6563B7b1e7124a2A64b0', 'genesis', 'genesis');
};
