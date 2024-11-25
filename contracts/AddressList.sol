// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AddressList {
    // Array to store contract addresses as strings
    string[] public contractAddresses;

    // Event to log addition of a new address
    event AddressAdded(string newAddress);

    // Function to add a new contract address to the list
    function addAddress(string memory newAddress) public {
        contractAddresses.push(newAddress);
        emit AddressAdded(newAddress);
    }

    // Function to get the list of addresses
    function getAddresses() public view returns (string[] memory) {
        return contractAddresses;
    }

    // Function to get the address count
    function getAddressCount() public view returns (uint256) {
        return contractAddresses.length;
    }
}
