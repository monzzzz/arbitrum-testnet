const { ethers } = require("hardhat");

async function main() {
    // Get the deployer's wallet
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account:", deployer.address);

    // Deploy the MoneySender contract
    const Bet = await ethers.getContractFactory("AddressList");
    const bet = await Bet.deploy();
    // await moneySender.deployed();
    const address = await bet.getAddress();
    console.log("MoneySender contract deployed to:",address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });