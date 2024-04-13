require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
 const accounts = await hre.ethers.getSigners();
 for (const account of accounts) {
 console.log(account.address);
 }
});
module.exports = {
  networks: {
    hardhat: {
    chainId: 1337
    },
    sepolia: {
    url: process.env.REACT_APP_ALCHEMY_API_URL,
    accounts: [ process.env.REACT_APP_PRIVATE_KEY ]
    }
    },
  solidity: "0.8.4"
};
