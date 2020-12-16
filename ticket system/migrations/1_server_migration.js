const TicketServer = artifacts.require("Server");

module.exports = function(deployer) {
  deployer.deploy(TicketServer);
};
