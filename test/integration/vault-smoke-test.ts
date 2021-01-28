
import { expect } from "chai";
import { Contract } from "ethers";
import * as hre from "hardhat";
import { Contracts } from "./contracts-integration-test-env";
import { Roles } from "./utils/access-control";

describe("Vault Contract Smoke Test with depositor1, depositor2 and recipient:", function () {
  let contracts: Contracts;

  // SignersWithAddress
  let deployer, depositor1, depositor2, recipient;

  let salary = 100; // in dai

  let btokenBlueprint: Contract;
  let vaultBlueprint: Contract;
  let vaultFactory: Contract;

  let bTokenInstance: Contract;
  let vaultInstance: Contract;

  // setup signers/accounts
  before(async function() {
    // @ts-ignore
    contracts = await hre.initializeEnvironment();
    [deployer, depositor1, depositor2, recipient] = await hre.ethers.getSigners();
  });

  // setup blueprint contracts and vault/token factory
  before(async function() {
    const Token = await hre.ethers.getContractFactory("BazrToken");
    const btokenDepoymentTx = await Token.deploy();

    btokenBlueprint = await btokenDepoymentTx.deployed();
    // await btoken.grantRole(Roles.MINTER_ROLE, vault.address);

    const Vault = await hre.ethers.getContractFactory("Vault");
    const vaultDepoymentTx = await Vault.deploy();
    
    vaultBlueprint = await vaultDepoymentTx.deployed();

    const VaultFactory = await hre.ethers.getContractFactory("VaultFactory");
    const vaultFactoryDepoymentTx = await VaultFactory.deploy(contracts.AAVE_POOL.address, vaultBlueprint.address, btokenBlueprint.address);
    vaultFactory = await vaultFactoryDepoymentTx.deployed();
  });

  before(async function() {
    await vaultFactory.createBazrToken("BToken", "BZR");

    const bTokenAddress = await vaultFactory.projectIdToBToken(0);
    bTokenInstance = await hre.ethers.getContractAt("BazrToken", bTokenAddress);

    await vaultFactory.createVault(recipient.address, contracts.DAI.address, salary, bTokenAddress, contracts.ADAI.address);
    const vaultAddress = await vaultFactory.bTokenToVault(bTokenAddress);
    vaultInstance = await hre.ethers.getContractAt("Vault", vaultAddress);
  });

  it("*T1 depositor1 deposits 1000 Tokens, \n she receives 1000 bTokens back", async function () {
    let depositor1VaultSigner = vaultInstance.connect(depositor1);
    let depositor1TokenSigner = contracts.DAI.connect(depositor1);
    await depositor1TokenSigner.approve(vaultInstance.address, "100000");
    await depositor1VaultSigner.deposit("1000");
    let bbalance = await bTokenInstance.balanceOf(depositor1.address);
    expect(bbalance.toString()).to.equal("1000");
  })

  it("*T2 Interest surplus accrued by 200 aTokens, \n recipient earns 100 aTokens, \n 100 depositor1 earns 100 aTokens", async function () {
    // @ts-ignore
    await hre.addADaiToWallet(vaultInstance.address, "200"); // simulate interests earned
    await vaultInstance.manualTransition();
    let recipientReserve = await vaultInstance.recipientReserve();
    let depositor1Total = await vaultInstance.totalBalanceOf(depositor1.address);
    expect(recipientReserve).to.equal(100);
    expect(depositor1Total).to.equal(1099); // off by one
  })

//   it("*T3 depositor2 deposits 1000 Tokens, \n he receives 909 bTokens back \n ", async function () {
//     depositor2VaultSigner = vault.connect(depositor2);
//     depositor2TokenSigner = token.connect(depositor2);
//     await depositor1TokenSigner.mint(depositor2.address, "1000");
//     await depositor2TokenSigner.approve(vault.address, "100000");
//     await depositor2VaultSigner.deposit("1000");
//     let depositor2Total = await vault.totalBalanceOf(depositor2.address);
//     let depositor1Total = await vault.totalBalanceOf(depositor1.address);
//     let bdepositor2 = await btoken.balanceOf(depositor2.address);
//     expect(depositor2Total).to.equal("999"); // loss of precision, should be fine for large 18 decimals
//     expect(depositor1Total).to.equal("1100");
//     expect(bdepositor2).to.equal("909");
//   })

//   it("*T4 Interests surplus accrued by 200 aTokens, \n recipient does not earn any aTokens, \n depositor1 earns 104 aTokens \n, depositor2 earns 95 aTokens", async function () {
//     await atoken.mint(vault.address, "200");
//     await token.mint(aavePool.address, "200");
//     await vault.manualTransition();
//     let depositor1Total = await vault.totalBalanceOf(depositor1.address);
//     let depositor2Total = await vault.totalBalanceOf(depositor2.address);
//     expect(depositor1Total).to.equal("1204");
//     expect(depositor2Total).to.equal("1095");
//   })

//   it("*T5 depositor1 and depositor2 withdraw their entire balance, \n depositor1 receives 1204 Tokens back, \n depositor2 receives 1096 Tokens back", async function () {
//     depositor1BtokenSigner = btoken.connect(depositor1);
//     depositor2BtokenSigner = btoken.connect(depositor2);
//     await depositor1BtokenSigner.approve(vault.address, "10000");
//     let bal = await atoken.balanceOf(aavePool.address);
//     await depositor1VaultSigner.withdraw();
//     let depositor1TokenBalance = await token.balanceOf(depositor1.address);
//     expect(depositor1TokenBalance).to.equal("1204");

//     let bal2 = await atoken.balanceOf(aavePool.address);
//     await depositor2BtokenSigner.approve(vault.address, "10000");
//     await depositor2VaultSigner.withdraw();
//     let depositor2TokenBalance = await token.balanceOf(depositor2.address);
//     expect(depositor2TokenBalance).to.equal("1096"); // TODO why is the returned balance off by one?
//   })

//   it("*T6 recipient withdraws his salary, \n recipient receives 100 Tokens back", async function () {
//     recipientVaultSigner = vault.connect(recipient);
//     await recipientVaultSigner.recipientWithdraw("100");
//     let recipientbalance = await token.balanceOf(recipient.address);
//     expect(recipientbalance).to.equal("100");
//   })
});
