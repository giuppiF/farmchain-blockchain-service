var HashContract = artifacts.require("./HashStore.sol");

module.exports = function(deployer){
    deployer.deploy(HashContract, 1000);
};
