import { expect } from "chai";
import { Contract, utils, BigNumber } from "ethers";
import * as hre from "hardhat";
import { Contracts } from "./contracts-integration-test-env";

// base unit is 18 decimals
function toBaseUnit(amount: string): BigNumber{
  return utils.parseEther(amount);
}

// compare two numbers within a margin of error
function closeTo(amount) {
  return function(amount2) {
    let dif = amount.gte(amount2) ? amount.mod(amount2) : amount2.mod(amount);
    return dif.lte(utils.parseEther("0.1"));
  }
}

describe("Vault Contract Smoke Test with depositor1, depositor2 and recipient:", function () {
  let contracts: Contracts;

  // SignersWithAddress
  let deployer, depositor1, depositor2, recipient;

  let salary = toBaseUnit("100");
  let depositAmount = toBaseUnit("1000");


  let bTokenInstance: Contract;
  let vaultInstance: Contract;


  before(async function() {
    // @ts-ignore
    contracts = await hre.initializeEnvironment();
    const Token = await hre.ethers.getContractFactory("BazrToken");
    const btokenDepoymentTx = await Token.deploy();

    let btokenBlueprint = await btokenDepoymentTx.deployed();

    const Vault = await hre.ethers.getContractFactory("Vault");
    const vaultDepoymentTx = await Vault.deploy();
    
    let vaultBlueprint = await vaultDepoymentTx.deployed();

    const VaultFactory = await hre.ethers.getContractFactory("VaultFactory");
    const vaultFactoryDepoymentTx = await VaultFactory.deploy(contracts.AAVE_POOL.address, vaultBlueprint.address, btokenBlueprint.address);
    let vaultFactory = await vaultFactoryDepoymentTx.deployed();

    await vaultFactory.createBazrToken("BToken", "BZR");

    const bTokenAddress = await vaultFactory.projectIdToBToken(0);
    bTokenInstance = await hre.ethers.getContractAt("BazrToken", bTokenAddress);

    [deployer, depositor1, depositor2, recipient] = await hre.ethers.getSigners();

    await vaultFactory.createVault(recipient.address, contracts.DAI.address, salary, bTokenAddress, contracts.ADAI.address);
    const vaultAddress = await vaultFactory.bTokenToVault(bTokenAddress);

    vaultInstance = await hre.ethers.getContractAt("Vault", vaultAddress);
    [deployer, depositor1, depositor2, recipient].forEach(signer => {
      signer.DAI = contracts.DAI.connect(signer);
      signer.ADAI = contracts.ADAI.connect(signer);
      signer.VAULT = vaultInstance.connect(signer);
      signer.BDAI = bTokenInstance.connect(signer);
      signer.AAVE_POOL = contracts.AAVE_POOL.connect(signer);
    })
  });


  it("*T1 depositor1 deposits 1000 Tokens, \n she receives 1000 bTokens back", async function () {
    await depositor1.DAI.approve(vaultInstance.address, depositAmount);
    await depositor1.VAULT.deposit(depositAmount);
    let bbalance = await bTokenInstance.balanceOf(depositor1.address);
    expect(bbalance).to.satisfies(closeTo(depositAmount));
  })

  it("*T2 Interest surplus accrued by 200 aTokens, \n recipient earns 100 aTokens, \n 100 depositor1 earns 100 aTokens", async function () {
    // @ts-ignore
    await hre.addADaiToWallet(vaultInstance.address, toBaseUnit("200")); // simulate interests earned
    await vaultInstance.manualTransition();
    let recipientReserve = await vaultInstance.recipientReserve();
    let depositor1Total = await vaultInstance.totalBalanceOf(depositor1.address);
    expect(recipientReserve).to.equal(toBaseUnit("100"));
    expect(depositor1Total).to.satisfies(closeTo(toBaseUnit("1100"))); // off by one
  })

  it("*T3 depositor2 deposits 1000 Tokens, \n he receives 909 bTokens back \n ", async function () {
    await depositor2.DAI.approve(vaultInstance.address, depositAmount);
    await depositor2.VAULT.deposit(depositAmount);
    let depositor2Total = await vaultInstance.totalBalanceOf(depositor2.address);
    let depositor1Total = await vaultInstance.totalBalanceOf(depositor1.address);
    let bdepositor2 = await bTokenInstance.balanceOf(depositor2.address);
    expect(depositor2Total).to.satisfies(closeTo(toBaseUnit("1000")));
    expect(depositor1Total).to.satisfies(closeTo(toBaseUnit("1100")));
    expect(bdepositor2).to.satisfies(closeTo(toBaseUnit("909")));
  })

  it("*T4 Interests surplus accrued by 200 aTokens, \n recipient does not earn any aTokens, \n depositor1 earns 104 aTokens \n, depositor2 earns 95 aTokens", async function () {
    // @ts-ignore
    await hre.addADaiToWallet(vaultInstance.address, toBaseUnit("200")); // simulate interests earned
    await vaultInstance.manualTransition();
    let depositor1Total = await vaultInstance.totalBalanceOf(depositor1.address);
    let depositor2Total = await vaultInstance.totalBalanceOf(depositor2.address);
    expect(depositor1Total).to.satisfies(closeTo(toBaseUnit("1204.7")));
    expect(depositor2Total).to.satisfies(closeTo(toBaseUnit("1095.2")));
  })

  it("*T5 depositor1 and depositor2 withdraw their entire balance, \n depositor1 receives 1204 Tokens back, \n depositor2 receives 1096 Tokens back", async function () {
    await depositor1.BDAI.approve(vaultInstance.address, toBaseUnit("10000"));
    let bal = await contracts.ADAI.balanceOf(contracts.AAVE_POOL.address);
    await depositor1.VAULT.withdraw();
    let depositor1TokenBalance = await contracts.DAI.balanceOf(depositor1.address);
    expect(depositor1TokenBalance).to.satisfies(closeTo(toBaseUnit("1204.7")));

    await depositor2.BDAI.approve(vaultInstance.address, toBaseUnit("10000"));
    await depositor2.VAULT.withdraw();
    let depositor2TokenBalance = await contracts.DAI.balanceOf(depositor2.address);
    expect(depositor2TokenBalance).to.satisfies(closeTo(toBaseUnit("1095.2")));
  })

  it("*T6 recipient withdraws his salary, \n recipient receives 100 Tokens back", async function () {
    let balanceBefore = await contracts.DAI.balanceOf(recipient.address);
    await recipient.VAULT.recipientWithdraw(toBaseUnit("100"));
    let balanceAfter = await contracts.DAI.balanceOf(recipient.address);
    expect(balanceAfter.sub(balanceBefore)).to.satisfies(closeTo(toBaseUnit("100")));
  })
});
