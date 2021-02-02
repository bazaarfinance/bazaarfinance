
const hre = require("hardhat");
const dotenv = require("dotenv");

async function main() {

  let recipient = process.env.RECIPIENT
  const contracts = {
    AAVE_POOL: process.env.AAVE_POOL,
    ADAI: process.env.ADAI,
    DAI: process.env.DAI
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

  let vaultBlueprint = await vaultDepoymentTx.deployed();

  const VaultFactory = await hre.ethers.getContractFactory("VaultFactory");
  const vaultFactoryDepoymentTx = await VaultFactory.deploy(contracts.AAVE_POOL, vaultBlueprint.address, btokenBlueprint.address);
  let vaultFactory = await vaultFactoryDepoymentTx.deployed();
  console.log("vault factory contract deployed at:", vaultFactory.address)

  let bazrDeploymentTx = await vaultFactory.createBazrToken("BToken", "BZR");
  await bazrDeploymentTx.wait();

  const bTokenAddress = await vaultFactory.projectIdToBToken(0);
  console.log("bToken deployed at:", bTokenAddress)

  let vaultDeploymentTx = await vaultFactory.createVault(recipient, contracts.DAI, process.env.SALARY, bTokenAddress, contracts.ADAI);
  await vaultDeploymentTx.wait();
  const vaultAddress = await vaultFactory.bTokenToVault(bTokenAddress);

  console.log("Vault deployed at:", vaultAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
