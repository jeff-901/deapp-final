const User = artifacts.require("user");

module.exports = function(deployer) {
  deployer.deploy(User, 'genesis_user', '0000');
};
