// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MoneySender {
    // Function to send Ether dynamically to any recipient
    function sendMoney(address payable recipient) external payable {
        require(msg.value > 0, "You need to send some ETH");
        recipient.transfer(msg.value); // Transfer the Ether to the recipient
    }
}