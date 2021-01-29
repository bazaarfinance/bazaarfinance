import { ethers as ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { expect } from "chai";


describe("Vault contract", function () {
  // @ts-ignore
  let admin: SignerWithAddress;
  // @ts-ignore
  let recipient: SignerWithAddress;
  // @ts-ignore
  let depositor: SignerWithAddress;
  let aavePool: Contract;
  let token: Contract;
  let aToken: Contract;
  let bToken: Contract;
  let BazrToken: ContractFactory;
  let bazrToken: Contract;
  let BazaarVault: ContractFactory;
  let bazaarVault: Contract;
  let VaultFactory: ContractFactory;
  let vaultFactory: Contract;
  let bTokenInstance: Contract;
  let vaultInstance: Contract;
  let bTokenAddress: string;
  let vaultAddress: string;
  let vaultFactoryTx: Contract;
  let bazaarVaultTx: Contract;
  let bazrTokenTx: Contract;

  beforeEach(async function () {
    [admin, recipient, depositor] = await ethers.getSigners();
    let mocktokenfactory = await ethers.getContractFactory("MockERC20");
    let tokenTx = await mocktokenfactory.deploy("DAI", "DAI");
    let aTokenTx = await mocktokenfactory.deploy("aDAI", "aDAI");
    token = await tokenTx.deployed();
    aToken = await aTokenTx.deployed();

    let AavePoolFactory = await ethers.getContractFactory("MockAavePool");
    let AavePooltx = await AavePoolFactory.deploy(
      token.address,
      aToken.address
    );
    aavePool = await AavePooltx.deployed();

    BazaarVault = await ethers.getContractFactory("Vault");
    bazaarVaultTx = await BazaarVault.deploy();
    bazaarVault = await bazaarVaultTx.deployed();

    BazrToken = await ethers.getContractFactory("BazrToken");
    bazrTokenTx = await BazrToken.deploy();
    bazrToken = await bazrTokenTx.deployed();

    VaultFactory = await ethers.getContractFactory("VaultFactory", { signer: admin });
    vaultFactoryTx = await VaultFactory.deploy(aavePool.address, bazaarVault.address, bazrToken.address);
    vaultFactory = await vaultFactoryTx.deployed();

    // initialize a new vault and bToken contract (BToken needs to be deployed first to get its address)
    await vaultFactory.createBazrToken("BToken", "BZR");
    bTokenAddress = await vaultFactory.projectIdToBToken(0);
    bTokenInstance = await ethers.getContractAt("BazrToken", bTokenAddress);

    await vaultFactory.createVault(recipient.address, token.address, 1000, bTokenAddress, aToken.address);
    vaultAddress = await vaultFactory.bTokenToVault(bTokenAddress);
    vaultInstance = await ethers.getContractAt("Vault", vaultAddress);
  });

  describe("constructor", function () {
    it("should initialize all correct address and values", async function () {
      let crecipient = await vaultInstance.recipient();
      let csalary = await vaultInstance.salary();
      let caavePool = await vaultInstance.aavePool();
      let caToken = await vaultInstance.aToken();
      let cbToken = await vaultInstance.bToken();
      let ctoken = await vaultInstance.token();
      expect(crecipient).to.equal(recipient.address);
      expect(csalary).to.equal("1000");
      expect(caavePool).to.equal(aavePool.address);
      expect(caToken).to.equal(aToken.address);
      expect(cbToken).to.equal(bTokenInstance.address);
      expect(ctoken).to.equal(token.address);

      let nextCheckpoint = await vaultInstance.nextCheckpoint();
      let interestEarnedAtLastCheckpoint = await vaultInstance.interestEarnedAtLastCheckpoint();
      let startedSurplus = await vaultInstance.startedSurplus();
      let principal = await vaultInstance.principal();
      let depositorReserve = await vaultInstance.depositorReserve();
      let recipientReserve = await vaultInstance.recipientReserve();
      expect(parseInt(nextCheckpoint)).to.gt(
        ethers.provider.blockNumber + 216000
      ); // approx number of blocks in 30 days
      expect(startedSurplus).to.equal(false);
      expect(interestEarnedAtLastCheckpoint).to.equal("0");
      expect(principal).to.equal("0");
      expect(depositorReserve).to.equal("0");
      expect(recipientReserve).to.equal("0");
    });
  });

  describe("pausable", function () {
    let vaultWithAdminSigner;
    let vaultWithNonAdminSigner;
    it("should revert if non-admin calls pause", async function () {
      vaultWithNonAdminSigner = vaultInstance.connect(recipient);
      await expect(vaultWithNonAdminSigner.pause()).to.be.revertedWith("Only callable by admin");
    });
    it("should revert if non-admin calls unpause", async function () {
      vaultWithAdminSigner = vaultInstance.connect(admin);
      await vaultWithAdminSigner.pause();
      vaultWithNonAdminSigner = vaultInstance.connect(recipient);
      await expect(vaultWithNonAdminSigner.unpause()).to.be.revertedWith("Only callable by admin");
    });
    it("should allow an admin to pause the contract", async function () {
      vaultWithAdminSigner = vaultInstance.connect(admin);
      await vaultWithAdminSigner.pause();
      expect(await vaultInstance.paused()).to.be.true;
    });
    it("should allow an admin to unpause the contract", async function () {
      vaultWithAdminSigner = vaultInstance.connect(admin);
      await vaultWithAdminSigner.pause();
      expect(await vaultInstance.paused()).to.be.true;
      await vaultWithAdminSigner.unpause();
      expect(await vaultInstance.paused()).to.be.false;
    });
  });

  describe("deposit", function () {
    let vaultWithAdminSigner;
    let vaultWithDepositorSigner;
    let tokenWithDepositorSigner;

    beforeEach(async function () {
      vaultWithDepositorSigner = vaultInstance.connect(depositor);
      tokenWithDepositorSigner = token.connect(depositor);
      await tokenWithDepositorSigner.mint(depositor.address, "10000");
      await tokenWithDepositorSigner.approve(vaultInstance.address, "10000");
    });

    it("should revert when Vault is paused", async function () {
      vaultWithAdminSigner = vaultInstance.connect(admin);
      await vaultWithAdminSigner.pause();
      await expect(vaultWithDepositorSigner.deposit("1000")).to.be.revertedWith("Pausable: paused");
    });

    it("should successfully make deposit", async function () {
      let allow = await tokenWithDepositorSigner.allowance(
        depositor.address,
        vaultInstance.address
      );
      await vaultWithDepositorSigner.deposit("1000");
      let balance = await token.balanceOf(aavePool.address);
      let bbalance = await bTokenInstance.balanceOf(depositor.address);
      let abalance = await aToken.balanceOf(vaultInstance.address);
      expect(abalance.toString()).to.equal("1000");
      expect(bbalance.toString()).to.equal("1000");
      expect(balance.toString()).to.equal("1000");

      let depositCalled = await aavePool.deposited();
      let principal = await vaultInstance.principal();
      let depositorPrincipal = await vaultInstance.depositorToPrincipal(
        depositor.address
      );
      let interestEarnedAtLastCheckpoint = await vaultInstance.interestEarnedAtLastCheckpoint();
      expect(interestEarnedAtLastCheckpoint).to.equal("0");
      expect(depositCalled).to.true;
      expect(principal).to.equal("1000");
      expect(depositorPrincipal).to.equal("1000");
    });

    it("should return the correct amount of bToken after first deposit", async function () {
      let allow = await tokenWithDepositorSigner.allowance(
        depositor.address,
        vaultInstance.address
      );
      await vaultWithDepositorSigner.deposit("1000");
      let principal = await vaultInstance.principal();
      let depositorPrincipal = await vaultInstance.depositorToPrincipal(
        depositor.address
      );
      let depositorReserve = await vaultInstance.depositorReserve();
      let supply = await bTokenInstance.totalSupply();
      await aToken.mint(vaultInstance.address, "1100"); // simulate interests 1000 to recipient, 100 to depositor
      await vaultWithDepositorSigner.deposit("1000"); // force state transition and return 909 bTokens, exchange rate should change
      let bbalance = await bTokenInstance.balanceOf(depositor.address);
      expect(bbalance).to.equal("1909");
    });
  });
});
