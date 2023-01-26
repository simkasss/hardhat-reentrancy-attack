const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("VulnerableContract", function () {
          let attackerContract, deployer, vulnerableContract
          const sendValue = ethers.utils.parseEther("1")

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              vulnerableContract = await ethers.getContract(
                  "VulnerableContract",
                  deployer
              )
              attackerContract = await ethers.getContract(
                  "AttackerContract",
                  deployer
              )
          })
          it("allows to deposit 1 ETH and to withdraw all ETH from VulnerableContract", async function () {
              const accounts = await ethers.getSigners()
              const startingAttackerBalance =
                  await attackerContract.getContractBalance()
              console.log(
                  `Starting attacker balance: ${
                      startingAttackerBalance / 10 ** 18
                  } ETH`
              )
              for (let i = 1; i <= 10; i++) {
                  const UserConnectedContract =
                      await vulnerableContract.connect(accounts[i])
                  await UserConnectedContract.deposit({ value: sendValue })
              }
              const contractBalance =
                  await vulnerableContract.provider.getBalance(
                      vulnerableContract.address
                  )
              console.log(
                  `Vulnerable contract balance after each 10 users deposits 1 ETH: ${
                      contractBalance / 10 ** 18
                  } ETH`
              )
              await attackerContract.attack({ value: sendValue })
              const contractBalanceAfterAttack =
                  await vulnerableContract.provider.getBalance(
                      vulnerableContract.address
                  )
              console.log(
                  `Vulnerable contract balance after attack: ${
                      contractBalanceAfterAttack / 10 ** 18
                  } ETH`
              )
              const endingAttackerBalance =
                  await attackerContract.getContractBalance()
              console.log(
                  `Ending attacker balance (after attacker deposits 1 ETH and withdraw all): ${
                      endingAttackerBalance / 10 ** 18
                  } ETH`
              )
              assert.equal(
                  endingAttackerBalance.toString(),
                  startingAttackerBalance
                      .add(contractBalance)
                      .add(sendValue)
                      .toString()
              )
          })
      })
