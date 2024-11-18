// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MoneySender {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Function to send money to a specified address
    function sendMoney(address payable recipient) external payable {
        require(msg.sender == owner, "Only the owner can send money");
        require(msg.value > 0, "Must send a positive amount");

        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "Transfer failed");
    }

    // Function to withdraw all Ether to the owner
    function withdrawAll() external {
        require(msg.sender == owner, "Only the owner can withdraw");
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    // Fallback to accept Ether
    receive() external payable {}
}