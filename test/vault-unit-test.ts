import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { expect } from "chai";
import { SignerWithAddress } from "hardhat-deploy-ethers/dist/src/signer-with-address";

describe("Vault contract", function () {
  let accounts: SignerWithAddress[];
  let recipient: SignerWithAddress;
  let depositor: SignerWithAddress;
  let aavePool: Contract;
  let token: Contract;
  let aToken: Contract;
  let bToken: Contract;
  let vaultFactory: ContractFactory;
  let vaultTx: Contract;
  let vault: Contract;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    recipient = accounts[0];
    depositor = accounts[1];
    let mocktokenfactory = await ethers.getContractFactory("MockERC20");
    let tokenTx = await mocktokenfactory.deploy("DAI", "DAI");
    let aTokenTx = await mocktokenfactory.deploy("aDAI", "aDAI");
    let bTokenTx = await mocktokenfactory.deploy("bDAI", "bDAI");
    token = await tokenTx.deployed();
    aToken = await aTokenTx.deployed();
    bToken = await bTokenTx.deployed();

    let AavePoolFactory = await ethers.getContractFactory("MockAavePool");
    let AavePooltx = await AavePoolFactory.deploy(
      token.address,
      aToken.address
    );
    aavePool = await AavePooltx.deployed();

    vaultFactory = await ethers.getContractFactory("Vault");
    vaultTx = await vaultFactory.deploy(
      recipient.address,
      token.address,
      aavePool.address,
      "1000",
      bToken.address,
      aToken.address
    );
    vault = await vaultTx.deployed();
  });

  describe("constructor", function () {
    it("should initialize all correct address and values", async function () {
      let crecipient = await vault.recipient();
      let csalary = await vault.salary();
      let caavePool = await vault.aavePool();
      let caToken = await vault.aToken();
      let cbToken = await vault.bToken();
      let ctoken = await vault.token();
      expect(crecipient).to.equal(recipient.address);
      expect(csalary).to.equal("1000");
      expect(caavePool).to.equal(aavePool.address);
      expect(caToken).to.equal(aToken.address);
      expect(cbToken).to.equal(bToken.address);
      expect(ctoken).to.equal(token.address);

      let nextCheckpoint = await vault.nextCheckpoint();
      let interestEarnedAtLastCheckpoint = await vault.interestEarnedAtLastCheckpoint();
      let startedSurplus = await vault.startedSurplus();
      let principal = await vault.principal();
      let depositorReserve = await vault.depositorReserve();
      let recipientReserve = await vault.recipientReserve();
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
      vaultWithSigner = vault.connect(depositor);
      tokenWithSigner = token.connect(depositor);
      await tokenWithSigner.mint(depositor.address, "10000");
      await tokenWithSigner.approve(vault.address, "10000");
    });

    it("should successfully make deposit", async function () {
      let allow = await tokenWithSigner.allowance(
        depositor.address,
        vault.address
      );
      await vaultWithSigner.deposit("1000");
      let balance = await token.balanceOf(aavePool.address);
      let bbalance = await bToken.balanceOf(depositor.address);
      let abalance = await aToken.balanceOf(vault.address);
      expect(abalance.toString()).to.equal("1000");
      expect(bbalance.toString()).to.equal("1000");
      expect(balance.toString()).to.equal("1000");

      let depositCalled = await aavePool.deposited();
      let principal = await vault.principal();
      let depositorPrincipal = await vault.depositorToPrincipal(
        depositor.address
      );
      let interestEarnedAtLastCheckpoint = await vault.interestEarnedAtLastCheckpoint();
      expect(interestEarnedAtLastCheckpoint).to.equal("0");
      expect(depositCalled).to.true;
      expect(principal).to.equal("1000");
      expect(depositorPrincipal).to.equal("1000");
    });

    it("should return the correct amount of bToken after first deposit", async function () {
      let allow = await tokenWithSigner.allowance(
        depositor.address,
        vault.address
      );
      await vaultWithSigner.deposit("1000");
      let principal = await vault.principal();
      let depositorPrincipal = await vault.depositorToPrincipal(
        depositor.address
      );
      let depositorReserve = await vault.depositorReserve();
      let supply = await bToken.totalSupply();
      await aToken.mint(vault.address, "1100"); // simulate interests 1000 to recipient, 100 to depositor
      await vaultWithSigner.deposit("1000"); // force state transition and return 909 bTokens, exchange rate should change
      let bbalance = await bToken.balanceOf(depositor.address);
      expect(bbalance).to.equal("1909");
    });
  });
});
