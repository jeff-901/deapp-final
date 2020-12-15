const TicketServer = artifacts.require("TicketServer");

module.exports = function(deployer) {
  deployer.deploy(TicketServer);
};
