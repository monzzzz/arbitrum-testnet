const { ethers } = require("hardhat");

async function main() {
    // Get the signer (your wallet)
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contract with the account:", deployer.address);

    // Deploy the MoneySender contract
    const MoneySender = await ethers.getContractFactory("MoneySender");
    const moneySender = await MoneySender.deploy();

    console.log("MoneySender contract deployed to:", moneySender.target);

    const recipient = "0x95Da0A827ff79F78B2B7ca784598c602734939Ae"; // Replace with recipient's address
    const amountToSend = ethers.parseEther("0.001"); // Amount to send (0.005 ETH)

    console.log(`Sending ${ethers.formatEther(amountToSend)} ETH to ${recipient}...`);
    const tx = await moneySender.sendMoney(recipient, {
        value: amountToSend, // Amount of ETH to send
    });

    await tx.wait(); // Wait for the transaction to be mined
    console.log(`Sent ${ethers.formatEther(amountToSend)} ETH to ${recipient}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });