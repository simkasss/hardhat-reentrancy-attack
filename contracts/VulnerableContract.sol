// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

error VulnerableContract__NoBalance();
error VulnerableContract__TransferFailed();

/** @title A sample Insecure Vulnerable Contract
 * @author Simona Kastantinaviciute
 * @notice This contract is an example of vulnerable to reentrancy attack smart contract
 */

contract VulnerableContract {
    mapping(address => uint256) private addressToBalance;

    function deposit() public payable {
        addressToBalance[msg.sender] += msg.value;
    }

    function withdraw() public {
        uint256 balance = addressToBalance[msg.sender];
        if (balance <= 0) revert VulnerableContract__NoBalance();

        (bool callSuccess, ) = payable(msg.sender).call{value: balance}("");
        if (!callSuccess) revert VulnerableContract__TransferFailed();

        addressToBalance[msg.sender] = 0;
    }
}
