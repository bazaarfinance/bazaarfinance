import * as hardhat from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { expect } from "chai";

import "./contracts-integration-test-env";

describe("Bazaar Vault Contract", function () {
    let deployer: Signer;
    let recipient: Signer;

    let salary: number = 1000;

    let BazrToken: ContractFactory;
    let bazrToken: Contract;
    let bazrTokenAddress: string;

    let BazaarVault: ContractFactory;
    let bazaarVault: Contract;

    before(async function () {
      // @ts-ignore
      this.contracts = await hardhat.getContracts();
    });


    beforeEach(async function () {
        [deployer, recipient] = await hardhat.ethers.getSigners();

        BazrToken = await hardhat.ethers.getContractFactory("BazrToken");
        bazrToken = await BazrToken.deploy();
    
        BazaarVault = await hardhat.ethers.getContractFactory("BazaarVault");

        let recipientAddress = await recipient.getAddress();

        bazaarVault = await BazaarVault.deploy(this.contracts.DAI.address, this.contracts.ADAI.address, bazrToken.address, recipientAddress, salary);
    });
  
    describe("Deployment", function () {
      it("Should set the correct BazrToken address and permissions", async function () {
        let vaultBazrToken = await bazaarVault.bazrToken();

        expect(vaultBazrToken).to.equal(bazrToken.address);

        //
        // test that vault has correct roles on token
        //
      });
    });
  });
  
