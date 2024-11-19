const { ethers } = require("hardhat");

async function main() {
    // Get the deployer's wallet
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account:", deployer.address);

    // Deploy the MoneySender contract
    const MoneySender = await ethers.getContractFactory("MoneySender");
    const moneySender = await MoneySender.deploy();
    // await moneySender.deployed();
    const address = await moneySender.getAddress();
    console.log("MoneySender contract deployed to:",address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });