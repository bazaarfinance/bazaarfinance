import * as hre from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { expect } from "chai";

import "./contracts-integration-test-env";

const ethers = hre.ethers;


describe("Vault Contract", function () {
    let deployer: Signer;
    let recipient: Signer;
    let depositor: Signer;

    let BazrToken: ContractFactory;
    let bazrToken: Contract;
    let bazrTokenAddress: string;

    let BazaarVault: ContractFactory;
    let bazaarVault: Contract;

    before(async function () {
      // @ts-ignore
      this.contracts = await hre.getContracts();
    });

    beforeEach(async function () {
      [deployer, recipient, depositor] = await ethers.getSigners();
    });
  
    describe("Deployment", function () {
      it("Should set the correct BazrToken address and permissions", async function () {
        const reservesList = await this.contracts.AAVE_POOL.getReservesList();
        console.log(`reservesList = ${JSON.stringify(reservesList, undefined, 2)}`);
      });
    });
});
  
