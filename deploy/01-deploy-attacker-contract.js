const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("---------------")

    const vulnerableContract = await ethers.getContract("VulnerableContract")
    const _vulnerableContract = vulnerableContract.address

    const attackerContract = await deploy("AttackerContract", {
        from: deployer,
        args: [_vulnerableContract],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    log("---------------")
}
module.exports.tags = ["all", "attackerContract"]
