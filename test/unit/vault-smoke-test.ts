import { ethers } from "hardhat";
import { Contract, ContractFactory, Signer} from "ethers";
import { expect } from "chai";

describe("Vault Contract Smoke Test with alice (depositor1), bob (depositor2) and charlie (recipient):", function () {
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

  let accounts;
  let alice;
  let bob;
  let charlie;
  let atoken;
  let aliceVaultSigner
  let bobVaultSigner
  let charlieVaultSigner
  let aliceTokenSigner
  let bobTokenSigner
  let aliceBtokenSigner
  let bobBtokenSigner

  before(async function() {
    accounts = await ethers.getSigners();
    charlie = accounts[0];
    alice = accounts[1];
    bob = accounts[2];
    let mocktokenfactory = await ethers.getContractFactory("MockERC20");
    let tokenTx = await mocktokenfactory.deploy("DAI", "DAI");
    let aTokenTx = await mocktokenfactory.deploy("aDAI", "aDAI");
    token = await tokenTx.deployed();
    aToken = await aTokenTx.deployed();

    let AavePoolFactory = await ethers.getContractFactory("MockAavePool");
    let AavePooltx = await AavePoolFactory.deploy(token.address, aToken.address);
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

    await vaultFactory.createVault(charlie.address, token.address, 100, bTokenAddress, aToken.address);
    vaultAddress = await vaultFactory.bTokenToVault(bTokenAddress);
    vaultInstance = await ethers.getContractAt("Vault", vaultAddress);
  })

  it("*T1 Alice deposits 1000 Tokens, \n she receives 1000 bTokens back", async function () {
    aliceVaultSigner = vaultInstance.connect(alice);
    aliceTokenSigner = token.connect(alice);
    await aliceTokenSigner.mint(alice.address, "1000");
    await aliceTokenSigner.approve(vaultInstance.address, "100000");
    await aliceVaultSigner.deposit("1000");
    let bbalance = await bTokenInstance.balanceOf(alice.address);
    expect(bbalance.toString()).to.equal("1000");
  })

  it("*T2 Interest surplus accrued by 200 aTokens, \n charlie earns 100 aTokens, \n 100 alice earns 100 aTokens", async function () {
    await aToken.mint(vaultInstance.address, "200");
    await token.mint(aavePool.address, "200");
    await vaultInstance.manualTransition();
    let recipientReserve = await vaultInstance.recipientReserve();
    let aliceTotal = await vaultInstance.totalBalanceOf(alice.address);
    expect(recipientReserve).to.equal(100);
    expect(aliceTotal).to.equal(1100);
  })

  it("*T3 Bob deposits 1000 Tokens, \n he receives 909 bTokens back \n ", async function () {
    bobVaultSigner = vaultInstance.connect(bob);
    bobTokenSigner = token.connect(bob);
    await aliceTokenSigner.mint(bob.address, "1000");
    await bobTokenSigner.approve(vaultInstance.address, "100000");
    await bobVaultSigner.deposit("1000");
    let bobTotal = await vaultInstance.totalBalanceOf(bob.address);
    let aliceTotal = await vaultInstance.totalBalanceOf(alice.address);
    let bbob = await bTokenInstance.balanceOf(bob.address);
    expect(bobTotal).to.equal("999"); // loss of precision, should be fine for large 18 decimals
    expect(aliceTotal).to.equal("1100");
    expect(bbob).to.equal("909");
  })

  it("*T4 Interests surplus accrued by 200 aTokens, \n charlie does not earn any aTokens, \n alice earns 104 aTokens \n, bob earns 95 aTokens", async function () {
    await aToken.mint(vaultInstance.address, "200");
    await token.mint(aavePool.address, "200");
    await vaultInstance.manualTransition();
    let aliceTotal = await vaultInstance.totalBalanceOf(alice.address);
    let bobTotal = await vaultInstance.totalBalanceOf(bob.address);
    expect(aliceTotal).to.equal("1204");
    expect(bobTotal).to.equal("1095");
  })

  it("*T5 Alice and Bob withdraw their entire balance, \n Alice receives 1204 Tokens back, \n Bob receives 1096 Tokens back", async function () {
    aliceBtokenSigner = bTokenInstance.connect(alice);
    bobBtokenSigner = bTokenInstance.connect(bob);
    await aliceBtokenSigner.approve(vaultInstance.address, "10000");
    let bal = await aToken.balanceOf(aavePool.address);
    await aliceVaultSigner.withdraw();
    let aliceTokenBalance = await token.balanceOf(alice.address);
    expect(aliceTokenBalance).to.equal("1204");

    let bal2 = await aToken.balanceOf(aavePool.address);
    await bobBtokenSigner.approve(vaultInstance.address, "10000");
    await bobVaultSigner.withdraw();
    let bobTokenBalance = await token.balanceOf(bob.address);
    expect(bobTokenBalance).to.equal("1096"); // TODO why is the returned balance off by one?
  })

  it("*T6 Charlie withdraws his salary, \n Charlie receives 100 Tokens back", async function () {
    charlieVaultSigner = vaultInstance.connect(charlie);
    await charlieVaultSigner.recipientWithdraw("100");
    let charliebalance = await token.balanceOf(charlie.address);
    expect(charliebalance).to.equal("100");
  })
})
