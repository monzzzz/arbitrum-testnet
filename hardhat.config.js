require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    arbitrumSepolia: {
      url: "https://arb-sepolia.g.alchemy.com/v2/NKzHJnILtAa6JmbWotKc5cmY1nYdSW7f", // Replace with your RPC URL
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Replace with your private key
    },
  },
  etherscan: {
    apiKey: "392EDJXAWCPD9R1A1WG1KZUP22P98DFMIE", // Optional: For verifying contracts on Arbitrum's block explorer
  },
};
