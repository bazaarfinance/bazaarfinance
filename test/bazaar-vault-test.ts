import * as hardhat from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { assert, expect } from "chai";
import { callbackify } from "util";
import { joinSignature } from "ethers/lib/utils";

const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const aDaiAddress = "0x028171bCA77440897B824Ca71D1c56caC55b68A3";

describe.skip("Bazaar Vault Contract", function () {
    let owner: Signer;
    let ownerAddress: string;
    
    let recipient: Signer;
    let recipientAddress: string;
    let salary: number = 1000;

    let BazrToken: ContractFactory;
    let bazrToken: Contract;
    let BazaarVault: ContractFactory;
    let bazaarVault: Contract;
    let VaultFactory: ContractFactory;
    let vaultFactory: Contract;

    let dai: Contract;
    let aDai: Contract;

    before(async function () {
      [owner, recipient] = await hardhat.ethers.getSigners();
      ownerAddress = await owner.getAddress();
      recipientAddress = await recipient.getAddress();

      dai = await hardhat.ethers.getContractAt("ERC20", "0x6b175474e89094c44da98b954eedeac495271d0f", owner);
      
      let daiName = await dai.name();
      let daiSymbol = await dai.symbol();
      
      aDai = await hardhat.ethers.getContractAt("ERC20", "0x028171bCA77440897B824Ca71D1c56caC55b68A3");
    });

    beforeEach(async function () {
      BazaarVault = await hardhat.ethers.getContractFactory("BazaarVault");
      bazaarVault = await BazaarVault.deploy();
      await bazaarVault.deployed();

      BazrToken = await hardhat.ethers.getContractFactory("BazrToken");
      bazrToken = await BazrToken.deploy();
      await bazrToken.deployed();

      VaultFactory = await hardhat.ethers.getContractFactory("VaultFactory");
      vaultFactory = await VaultFactory.deploy(daiAddress, aDaiAddress, bazaarVault.address, bazrToken.address);
      await vaultFactory.deployed();
    });
  
    describe("Deployment", function () {
      it("Should set the correct BazrToken address", async function () {
        // expect(await bazaar.bazrToken().getAddress()).to.equal(bazrToken.getAddress());
      });
      it("Should set the correct owner address", async function () {
        // const newVaultAddress = await vaultFactory.createVault(recipientAddress, salary);
        // const newVault = await hardhat.ethers.getContractAt("BazaarVault", newVaultAddress, owner);
        // expect(await newVault.owner()).to.equal(ownerAddress);
      });
    });
  });
  
  