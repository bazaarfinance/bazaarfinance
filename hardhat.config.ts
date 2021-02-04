import * as dotenv from "dotenv";
dotenv.config();

import * as env from "env-var";

import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "@symfoni/hardhat-react";
import "hardhat-typechain";
import "@typechain/ethers-v5";

import { HardhatUserConfig, task } from "hardhat/config";


const FORKING_URL = env.get('FORKING_URL').required().asUrlString();
const BLOCK_NUMBER = env.get('BLOCK_NUMBER').required().asIntPositive();


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      forking: {
        url: FORKING_URL,
        blockNumber: BLOCK_NUMBER
      },
    },
  },
  paths: {
    artifacts: "./artifacts",
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
