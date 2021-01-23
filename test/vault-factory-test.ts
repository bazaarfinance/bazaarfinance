import * as hardhat from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { expect } from "chai";

const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const aDaiAddress = "0x028171bCA77440897B824Ca71D1c56caC55b68A3";

describe("Vault Factory", function () {
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

    let newVaultAddress: string;
    let newVault: Contract;

    let newBTokenAddress: string;
    let newBToken: Contract;

    let dai: Contract;
    let aDai: Contract;

    before(async function () {
      [owner, recipient] = await hardhat.ethers.getSigners();
      ownerAddress = await owner.getAddress();
      recipientAddress = await recipient.getAddress();

      dai = await hardhat.ethers.getContractAt("ERC20", "0x6b175474e89094c44da98b954eedeac495271d0f", owner);      
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
      it("should return the correct reference implementation addresses", async function () {
        expect(await vaultFactory.dai()).to.equal(daiAddress);
        expect(await vaultFactory.aDai()).to.equal(aDaiAddress);
        expect(await vaultFactory.vaultImplementation()).to.equal(bazaarVault.address);
        expect(await vaultFactory.bTokenImplementation()).to.equal(bazrToken.address);
      });
      it("should initialize a new vault contract", async function () {
        const newVaultAddress = await vaultFactory.createVault(recipientAddress, salary);
        newVault = await hardhat.ethers.getContractAt("BazaarVault", newVaultAddress, owner);
      });
      it("should initialize a new bToken contract", async function () {
        const newBTokenAddress = await vaultFactory.createBazrToken("BToken", "BZR");
        newBToken = await hardhat.ethers.getContractAt("BazrToken", newBTokenAddress, owner);
      });
    });
  });
  
  