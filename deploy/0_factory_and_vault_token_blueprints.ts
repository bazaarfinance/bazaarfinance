import * as dotenv from "dotenv";
dotenv.config();

import * as env from "env-var";

const DAI_CONTRACT_ADDRESS = env.get('DAI_CONTRACT_ADDRESS').required().asString();
const ADAI_CONTRACT_ADDRESS = env.get('ADAI_CONTRACT_ADDRESS').required().asString();
const AAVE_POOL_CONTRACT_ADDRESS = env.get('AAVE_POOL_CONTRACT_ADDRESS').required().asString();

const SALARY = env.get('SALARY').required().asIntPositive();


import { DeployFunction } from 'hardhat-deploy/types';


const deployFunction: DeployFunction = async function (hre) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy, execute, read, log } = deployments;
  
  const { deployer } = await getNamedAccounts();
  const signers = await hre.ethers.getSigners();

  const recipient = signers[1];

  console.log(`Deployment network: ${hre.network.name}`);
  console.log(`Deployer address: ${deployer}`);
  console.log(`Recipient address: ${recipient.address}`);

  const greeterDeploymentResult = await deploy("Greeter", {
    from: deployer,
    // gas: 4000000,
    args: ["Greeting set from ./deploy/Greeter.ts"],
  });
  
  console.log(`greeterDeploymentResult.address = ${greeterDeploymentResult.address}`);
  console.log(`greeterDeploymentResult.receipt.from = ${greeterDeploymentResult.receipt.from}`);

  const tokenBlueprintDeploymentResult = await deploy('BazrToken', {
    from: deployer,
    log: true,
    deterministicDeployment: true,
  });

  console.log(`tokenBlueprintDeploymentResult.address = ${tokenBlueprintDeploymentResult.address}`);
  console.log(`tokenBlueprintDeploymentResult.receipt.from = ${tokenBlueprintDeploymentResult.receipt.from}`);

  const vaultBlueprintDeploymentResult = await deploy('Vault', {
    from: deployer,
    log: true,
    deterministicDeployment: true,
  });

  console.log(`vaultBlueprintDeploymentResult.address = ${vaultBlueprintDeploymentResult.address}`);
  console.log(`vaultBlueprintDeploymentResult.receipt.from = ${vaultBlueprintDeploymentResult.receipt.from}`);

  const vaultFactoryDeploymentResult = await deploy('VaultFactory', {
    from: deployer,
    log: true,
    deterministicDeployment: true,
    args: [AAVE_POOL_CONTRACT_ADDRESS, vaultBlueprintDeploymentResult.address, tokenBlueprintDeploymentResult.address]
  });

  console.log(`vaultFactoryDeploymentResult.address = ${vaultFactoryDeploymentResult.address}`);
  console.log(`vaultFactoryDeploymentResult.receipt.from = ${vaultFactoryDeploymentResult.receipt.from}`);

//   await execute(
//       'VaultFactory',
//       { from: deployer, log: true },
//       'createBazrToken', 'BToken', 'BZR'
//   );

//   const bTokenAddress = await execute(
//       'VaultFactory',
//       { from: deployer, log: true },
//       'projectIdToBToken', 0
//   );

//   console.log(`bTokenAddress = ${JSON.stringify(bTokenAddress, undefined, 2)}`);

//   await execute(
//       'VaultFactory',
//       { from: deployer, log: true },
//       'createVault',
//       SALARY, recipient, DAI_CONTRACT_ADDRESS, bTokenAddress, ADAI_CONTRACT_ADDRESS
//   );
};

export default deployFunction;