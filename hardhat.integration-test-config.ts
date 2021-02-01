
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env.integration-tests"});

import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "@symfoni/hardhat-react";
import "hardhat-typechain";
import "@typechain/ethers-v5";

import { extendEnvironment, HardhatUserConfig, task } from "hardhat/config";

<<<<<<< Updated upstream
import { testEnvironment } from "./test/integration/contracts-integration-test-env";
=======
import { testEnvironment } from "./contracts-integration-test-env";
>>>>>>> Stashed changes

extendEnvironment(testEnvironment);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  mocha: {
    timeout: 60000,
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.FORKING_URL,
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

