const Campaigns = artifacts.require("campaign");

module.exports = function(deployer) {
  deployer.deploy(Campaigns, 'genesis_campaign', 0, 0, 0, 0, 0, "genesis");
};
