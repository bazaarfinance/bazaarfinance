// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {

  const recipient = "0x31567830e4482739Df31D36E5dB47F4FA67ac072"
  const contracts = {
    AAVE_POOL: "0x9FE532197ad76c5a68961439604C037EB79681F0",
    ADAI: "0xdcf0af9e59c002fa3aa091a46196b37530fd48a8",
    DAI: "0xff795577d9ac8bd7d90ee22b6c1703490b6512fd"
  }
  const [deployer] = await hre.ethers.getSigners();
  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const Token = await hre.ethers.getContractFactory("BazrToken");
  const btokenDepoymentTx = await Token.deploy();

  console.log("Account balance:", (await deployer.getBalance()).toString());
  let btokenBlueprint = await btokenDepoymentTx.deployed();
  const Vault = await hre.ethers.getContractFactory("Vault");
  const vaultDepoymentTx = await Vault.deploy();
  
  const vaultBlueprint = await vaultDepoymentTx.deployed();

  const VaultFactory = await hre.ethers.getContractFactory("VaultFactory");
  const vaultFactoryDepoymentTx = await VaultFactory.deploy(contracts.AAVE_POOL, vaultBlueprint.address, btokenBlueprint.address);
  const vaultFactory = await vaultFactoryDepoymentTx.deployed();
  console.log("vault factory contract deployed at:", vaultFactory.address)

  await vaultFactory.createBazrToken("BToken", "BZR");

  await sleep(20000) // TODO need a better way to wait for createBazrToken() transaction to get mined
  const bTokenAddress = await vaultFactory.projectIdToBToken(0);
  console.log("bToken deployed at:", bTokenAddress)

  await vaultFactory.createVault(recipient, contracts.DAI, "1000", bTokenAddress, contracts.ADAI);
  const vaultAddress = await vaultFactory.bTokenToVault(bTokenAddress);

  console.log("Vault deployed at:", vaultAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
