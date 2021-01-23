import * as hardhat from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { assert, expect } from "chai";
import { callbackify } from "util";
import { joinSignature } from "ethers/lib/utils";
import { unzipSync } from "zlib";

describe("Bazaar Vault Contract", function () {
    let owner: Signer;
    let ownerAddress: string;
    
    let recipient: Signer;
    let recipientAddress: string;
    let salary: number = 1000;

    let BazrToken: ContractFactory;
    let bazrToken: Contract;
    let BazaarVault: ContractFactory;
    let bazaarVault: Contract;

    before(async function () {
      this.daiContract = await hardhat.ethers.getContractAt("ERC20", this.DAI_CONTRACT_ADDRESS);
      this.aDaiContract = await hardhat.ethers.getContractAt("ERC20", this.ADAI_CONTRACT_ADDRESS);
    });

    beforeEach(async function () {
        // BazrToken = await hardhat.ethers.getContractFactory("BazrToken");
        // bazrToken = await BazrToken.deploy();
    
        // BazaarVault = await hardhat.ethers.getContractFactory("BazaarVault");

        // bazaarVault = await BazaarVault.deploy(dai, aDai, bazrToken, recipientAddress, salary);
    });
  
    describe("Deployment", function () {
      it("Should set the correct BazrToken address", async function () {
        // expect(await bazaar.bazrToken().getAddress()).to.equal(bazrToken.getAddress());
      });
    });
  });
  
  