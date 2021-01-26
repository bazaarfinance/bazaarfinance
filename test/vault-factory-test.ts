import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer} from "ethers";
import { expect } from "chai";

describe("Vault Factory", function () {
    let owner: Signer;
    let ownerAddress: string;
    
    let recipient: Signer;
    let recipient2: Signer;
    let recipientAddress: string;
    let recipient2Address: string;
    let salary: number = 1000;

    let BazrToken: ContractFactory;
    let bazrToken: Contract;
    let BazaarVault: ContractFactory;
    let bazaarVault: Contract;
    let VaultFactory: ContractFactory;
    let vaultFactory: Contract;

    let aavePool: Contract;
    let token: Contract;
    let aToken: Contract;
    let bTokenInstance: Contract;
    let vaultInstance: Contract;
    let bTokenAddress: string;
    let vaultAddress: string;

    before(async function () {
      [owner, recipient, recipient2] = await ethers.getSigners();
      ownerAddress = await owner.getAddress();
      recipientAddress = await recipient.getAddress();
      recipient2Address = await recipient2.getAddress();

      let mocktokenfactory = await ethers.getContractFactory("MockERC20");
      let tokenTx = await mocktokenfactory.deploy("DAI", "DAI");
      let aTokenTx = await mocktokenfactory.deploy("aDAI", "aDAI");
      token = await tokenTx.deployed();
      aToken = await aTokenTx.deployed();
  
      let AavePoolFactory = await ethers.getContractFactory("MockAavePool");
      let AavePooltx = await AavePoolFactory.deploy(token.address, aToken.address);
      aavePool = await AavePooltx.deployed()
    });

    beforeEach(async function () {
      BazaarVault = await ethers.getContractFactory("Vault");
      bazaarVault = await BazaarVault.deploy();
      await bazaarVault.deployed();

      BazrToken = await ethers.getContractFactory("BazrToken");
      bazrToken = await BazrToken.deploy();
      await bazrToken.deployed();

      VaultFactory = await ethers.getContractFactory("VaultFactory");
      vaultFactory = await VaultFactory.deploy(aavePool.address, bazaarVault.address, bazrToken.address);
      await vaultFactory.deployed();
    });
  
    describe("Deployment", function () {
      beforeEach(async function () {
        // initialize a new vault and bToken contract (BToken needs to be deployed first to get its address)
        await vaultFactory.createBazrToken("BToken", "BZR");
        bTokenAddress = await vaultFactory.projectIdToBToken(0);
        bTokenInstance = await ethers.getContractAt("BazrToken", bTokenAddress);

        await vaultFactory.createVault(recipientAddress, token.address, salary, bTokenAddress, aToken.address);
        vaultAddress = await vaultFactory.bTokenToVault(bTokenAddress);
        vaultInstance = await ethers.getContractAt("Vault", vaultAddress);
      });
      it("should return the correct reference implementation addresses", async function () {
        expect(await vaultFactory.vaultImplementation()).to.equal(bazaarVault.address);
        expect(await vaultFactory.bTokenImplementation()).to.equal(bazrToken.address);
      });
      it("should return correct parameters for newly initialized contracts", async function () {
        expect ((await bTokenInstance.name()).toString()).to.equal("BToken");
        expect ((await bTokenInstance.symbol()).toString()).to.equal("BZR");

        expect((await vaultInstance.recipient()).toString()).to.equal(recipientAddress);
        expect((await vaultInstance.salary())).to.equal(salary);
      });
      it("should correctly increment the projectId", async function () {
        await vaultFactory.createBazrToken("BTokenEthersJS", "BZREJS");
        bTokenAddress = await vaultFactory.projectIdToBToken(1);
        bTokenInstance = await ethers.getContractAt("BazrToken", bTokenAddress);

        await vaultFactory.createVault(recipient2Address, token.address, salary, bTokenAddress, aToken.address);
        vaultAddress = await vaultFactory.bTokenToVault(bTokenAddress);
        vaultInstance = await ethers.getContractAt("Vault", vaultAddress);
        
        expect ((await bTokenInstance.name()).toString()).to.equal("BTokenEthersJS");
        expect ((await bTokenInstance.symbol()).toString()).to.equal("BZREJS");

        expect((await vaultInstance.recipient()).toString()).to.equal(recipient2Address);
        expect((await vaultInstance.salary())).to.equal(salary);
      });
    });
  });
  
  