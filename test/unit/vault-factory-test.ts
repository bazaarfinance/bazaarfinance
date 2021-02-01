import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { expect } from "chai";

describe("Vault Factory", function () {
    let owner: Signer;
    let factoryWithOwnerSigner: Contract;
    let ownerAddress: string;
    
    let newAdmin: Signer;
    let newAdminAddress: string;
    let newAdminFactorySigner: Contract;
    
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
    let vaultFactoryTx: Contract;
    let bazaarVaultTx: Contract;
    let bazrTokenTx: Contract;

    let aavePool: Contract;
    let token: Contract;
    let aToken: Contract;
    let bTokenInstance: Contract;
    let vaultInstance: Contract;
    let bTokenAddress: string;
    let vaultAddress: string;

    // bytes32 encoding of "ADMIN_ROLE" used to test permissions
    let adminRoleEncoded: string;

    before(async function () {
      [owner, newAdmin, recipient, recipient2] = await ethers.getSigners();
      ownerAddress = await owner.getAddress();
      newAdminAddress = await newAdmin.getAddress();
      recipientAddress = await recipient.getAddress();
      recipient2Address = await recipient2.getAddress();

      let mocktokenfactory = await ethers.getContractFactory("MockERC20");
      let tokenTx = await mocktokenfactory.deploy("DAI", "DAI");
      let aTokenTx = await mocktokenfactory.deploy("aDAI", "aDAI");
      token = await tokenTx.deployed();
      aToken = await aTokenTx.deployed();
  
      let AavePoolFactory = await ethers.getContractFactory("MockAavePool");
      let AavePooltx = await AavePoolFactory.deploy(token.address, aToken.address);
      aavePool = await AavePooltx.deployed();
    });

    beforeEach(async function () {
      BazaarVault = await ethers.getContractFactory("Vault");
      bazaarVaultTx = await BazaarVault.deploy();
      bazaarVault = await bazaarVaultTx.deployed();

      BazrToken = await ethers.getContractFactory("BazrToken");
      bazrTokenTx = await BazrToken.deploy();
      bazrToken = await bazrTokenTx.deployed();

      VaultFactory = await ethers.getContractFactory("VaultFactory", { signer: owner });
      vaultFactoryTx = await VaultFactory.deploy(aavePool.address, bazaarVault.address, bazrToken.address);
      vaultFactory = await vaultFactoryTx.deployed();

      adminRoleEncoded = await vaultFactory.DEFAULT_ADMIN_ROLE();
    });

    describe("Access Control", function () {
      it("should set the Factory deployer as an admin", async function () {
        expect(await vaultFactory.hasRole(adminRoleEncoded, ownerAddress)).to.be.true;
        expect(await vaultFactory.getRoleMemberCount(adminRoleEncoded)).to.equal(1);
      });
      it("should revert if a non-admin tries to grant admin role", async function () {
        let factoryWithNonOwnerSigner = await vaultFactory.connect(recipient);
        await expect(factoryWithNonOwnerSigner.grantRole(adminRoleEncoded, newAdminAddress)).to.be.revertedWith("AccessControl: sender must be an admin to grant");
      });
      it("should revert if a non-admin tries to call createBToken", async function () {
        let factoryWithNonOwnerSigner = await vaultFactory.connect(recipient);
        await expect(factoryWithNonOwnerSigner.createBazrToken("BToken", "BZR")).to.be.revertedWith("Only callable by admin");
      });
      it("should revert if a non-admin tries to call createVault", async function () {
        let factoryWithNonOwnerSigner = await vaultFactory.connect(recipient);
        await expect(factoryWithNonOwnerSigner.createVault(recipientAddress, token.address, salary, bazrToken.address, aToken.address)).to.be.revertedWith("Only callable by admin");
      });
      it("should let the Factory deployer (default admin) grant admin status to another address", async function () {
        factoryWithOwnerSigner = await vaultFactory.connect(owner);
        await factoryWithOwnerSigner.grantRole(adminRoleEncoded, newAdminAddress);
        expect(await vaultFactory.hasRole(adminRoleEncoded, newAdminAddress)).to.be.true;
        expect(await vaultFactory.getRoleMemberCount(adminRoleEncoded)).to.equal(2);
      });
      it("should let a new admin call createVault and createBToken", async function () {
        factoryWithOwnerSigner = await vaultFactory.connect(owner);
        await factoryWithOwnerSigner.grantRole(adminRoleEncoded, newAdminAddress);
        newAdminFactorySigner = await vaultFactory.connect(newAdmin);

        await newAdminFactorySigner.createBazrToken("BToken", "BZR");
        bTokenAddress = await newAdminFactorySigner.projectIdToBToken(0);
        bTokenInstance = await ethers.getContractAt("BazrToken", bTokenAddress);

        await newAdminFactorySigner.createVault(recipientAddress, token.address, salary, bTokenAddress, aToken.address);
        vaultAddress = await newAdminFactorySigner.bTokenToVault(bTokenAddress);
        vaultInstance = await ethers.getContractAt("Vault", vaultAddress);

        expect((await bTokenInstance.name()).toString()).to.equal("BToken");
        expect((await bTokenInstance.symbol()).toString()).to.equal("BZR");

        expect((await vaultInstance.recipient()).toString()).to.equal(recipientAddress);
        expect((await vaultInstance.salary())).to.equal(salary);
      });
    });
  
    describe("Vault and bToken initialization", function () {
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
        expect((await bTokenInstance.name()).toString()).to.equal("BToken");
        expect((await bTokenInstance.symbol()).toString()).to.equal("BZR");

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
      it("should store the Factory's address in the bToken contract", async function () {
        expect((await bTokenInstance.factory()).toString()).to.equal(vaultFactory.address);
      });
    });
  });
  
  