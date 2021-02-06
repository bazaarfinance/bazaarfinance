
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.kovan-staging" });

import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "@symfoni/hardhat-react";
import "hardhat-typechain";
import "hardhat-abi-exporter";
import "@typechain/ethers-v5";

import { HardhatUserConfig } from "hardhat/config";


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (args, hre) => {
//   const accounts = await hre.ethers.getSigners();
//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  namedAccounts: {
    deployer: process.env.DEPLOYER_PRIVATE_KEY
  },
  networks: {
    kovan: {
      url: process.env.KOVAN_RPC_ENDPOINT,
      live: true,
      saveDeployments: true,
      tags: ["staging"],
      accounts: [process.env.DEPLOYER_PRIVATE_KEY]
    }
  },
  abiExporter: {
    path: './data/abi',
    clear: true,
    only: ['ILendingPool', 'IERC20', 'VaultFactory', 'BazrToken', 'Vault', 'ProxyFactory']
  },
  paths: {
    artifacts: "./artifacts",
    deploy: 'deploy',
    deployments: 'deployments',
    imports: `imports`
  },
  react: {
    providerPriority: ["web3modal", "hardhat"],
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 50,
          },
        },
      },
    ],
  },
};

export default config;
