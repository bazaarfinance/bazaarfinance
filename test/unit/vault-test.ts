import { ethers as ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { expect } from "chai";

describe("Vault contract", function () {
  // @ts-ignore
  let accounts: ethers.SignerWithAddress[];
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

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    recipient = accounts[0];
    depositor = accounts[1];
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
    bazaarVault = await BazaarVault.deploy();
    await bazaarVault.deployed();

    BazrToken = await ethers.getContractFactory("BazrToken");
    bazrToken = await BazrToken.deploy();
    await bazrToken.deployed();

    VaultFactory = await ethers.getContractFactory("VaultFactory");
    vaultFactory = await VaultFactory.deploy(aavePool.address, bazaarVault.address, bazrToken.address);
    await vaultFactory.deployed();

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

  describe("deposit", function () {
    let vaultWithSigner;
    let tokenWithSigner;

    beforeEach(async function () {
      vaultWithSigner = vaultInstance.connect(depositor);
      tokenWithSigner = token.connect(depositor);
      await tokenWithSigner.mint(depositor.address, "10000");
      await tokenWithSigner.approve(vaultInstance.address, "10000");
    });

    it("should successfully make deposit", async function () {
      let allow = await tokenWithSigner.allowance(
        depositor.address,
        vaultInstance.address
      );
      await vaultWithSigner.deposit("1000");
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
      let allow = await tokenWithSigner.allowance(
        depositor.address,
        vaultInstance.address
      );
      await vaultWithSigner.deposit("1000");
      let principal = await vaultInstance.principal();
      let depositorPrincipal = await vaultInstance.depositorToPrincipal(
        depositor.address
      );
      let depositorReserve = await vaultInstance.depositorReserve();
      let supply = await bTokenInstance.totalSupply();
      await aToken.mint(vaultInstance.address, "1100"); // simulate interests 1000 to recipient, 100 to depositor
      await vaultWithSigner.deposit("1000"); // force state transition and return 909 bTokens, exchange rate should change
      let bbalance = await bTokenInstance.balanceOf(depositor.address);
      expect(bbalance).to.equal("1909");
    });
  });
});
