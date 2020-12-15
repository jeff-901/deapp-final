const Campaign = artifacts.require("campaign");

module.exports = function(deployer) {
  deployer.deploy(Campaign);
};
