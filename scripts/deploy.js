const fs = require('fs');
const { ethers } = require('hardhat');
async function main() {
  const [deployer, user1] = await ethers.getSigners();
  // We get the contract factory to deploy
  const DebookFactory = await ethers.getContractFactory("Debook");
  // Deploy contract
  const Debook = await DebookFactory.deploy();
  // Save contract address file in project
  const contractsDir = __dirname + "/../src/contractsData";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/Debook-address.json`,
    JSON.stringify({ address: Debook.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync("Debook");

  fs.writeFileSync(
    contractsDir + `/Debook.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
  console.log("Debook deployed to:", Debook.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
