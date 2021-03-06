import { expect } from "chai";
import { Contract, utils, BigNumber } from "ethers";
import * as hre from "hardhat";
import { Contracts } from "./contracts-integration-test-env";
import { toBaseUnit, closeTo } from "./utils/numbers";


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
      signer.AAVE_POOL = contracts.AAVE_POOL.connect(signer);
      signer.VAULT = vaultInstance.connect(signer);
      signer.BDAI = bTokenInstance.connect(signer);
    })
  });


  it("*T1 depositor1 deposits 1000 Tokens, \n depositor1 can immediately withdraw and redeposit", async function () {
    await depositor1.DAI.approve(vaultInstance.address, depositAmount);
    await depositor1.VAULT.deposit(depositAmount);

    expect(await contracts.DAI.balanceOf(depositor1.address)).to.equal("0");
    expect(await bTokenInstance.balanceOf(depositor1.address)).to.satisfies(closeTo(depositAmount));
    expect(await vaultInstance.principal()).to.satisfies(closeTo(depositAmount));
    expect(await vaultInstance.totalBalanceOf(depositor1.address)).to.satisfies(closeTo(depositAmount))
    // withdraw
    await depositor1.BDAI.approve(vaultInstance.address, depositAmount);
    await depositor1.VAULT.withdraw();

    expect(await contracts.DAI.balanceOf(depositor1.address)).to.satisfies(closeTo(depositAmount));
    // redeposits
    await depositor1.DAI.approve(vaultInstance.address, depositAmount);
    await depositor1.VAULT.deposit(depositAmount);

    expect(await contracts.DAI.balanceOf(depositor1.address)).to.equal("0");
    expect(await bTokenInstance.balanceOf(depositor1.address)).to.satisfies(closeTo(depositAmount));
    expect(await vaultInstance.principal()).to.satisfies(closeTo(depositAmount));
    expect(await vaultInstance.totalBalanceOf(depositor1.address)).to.satisfies(closeTo(depositAmount))
  })

  it("*T2 Interest surplus accrued by 200 aTokens, \n recipient earns 100 aTokens, \n 100 depositor1 earns 100 aTokens", async function () {
    // @ts-ignore
    await hre.simulateDAIInterests(vaultInstance.address, toBaseUnit("200"));
    await vaultInstance.manualTransition();

    expect(await vaultInstance.interestEarnedAtLastCheckpoint()).to.satisfies(closeTo(toBaseUnit("200")));
    expect(await vaultInstance.recipientReserve()).to.satisfies(closeTo(toBaseUnit("100")));
    expect(await vaultInstance.depositorReserve()).to.satisfies(closeTo(toBaseUnit("100")));
    expect(await vaultInstance.totalBalanceOf(depositor1.address)).to.satisfies(closeTo(toBaseUnit("1100")));
  })

  it("*T3 depositor2 deposits 1000 Tokens, \n he receives 909 bTokens back \n ", async function () {
    await depositor2.DAI.approve(vaultInstance.address, depositAmount);
    await depositor2.VAULT.deposit(depositAmount);

    expect(await vaultInstance.totalBalanceOf(depositor2.address)).to.satisfies(closeTo(toBaseUnit("1000")));
    expect(await vaultInstance.totalBalanceOf(depositor1.address)).to.satisfies(closeTo(toBaseUnit("1100")));
    expect(await vaultInstance.principal()).to.satisfies(closeTo(toBaseUnit("2000")));
    expect(await bTokenInstance.balanceOf(depositor2.address)).to.satisfies(closeTo(toBaseUnit("909")));
  })

  it("*T4 Interests surplus accrued by 200 aTokens, \n recipient does not earn any additional aTokens, \n depositor1 earns 105 aTokens \n, depositor2 earns 95 aTokens", async function () {
    // @ts-ignore
    await hre.simulateDAIInterests(vaultInstance.address, toBaseUnit("200"));
    await vaultInstance.manualTransition();

    expect(await vaultInstance.interestEarnedAtLastCheckpoint()).to.satisfies(closeTo(toBaseUnit("400")));
    expect(await vaultInstance.totalBalanceOf(depositor1.address)).to.satisfies(closeTo(toBaseUnit("1204.7")));
    expect(await vaultInstance.totalBalanceOf(depositor2.address)).to.satisfies(closeTo(toBaseUnit("1095.2")));
  })

  it("*T5 depositor1 and depositor2 withdraw their entire balance, \n depositor1 receives 1204 Tokens back, \n depositor2 receives 1096 Tokens back", async function () {
    await depositor1.BDAI.approve(vaultInstance.address, toBaseUnit("10000"));
    await depositor1.VAULT.withdraw();

    expect(await contracts.DAI.balanceOf(depositor1.address)).to.satisfies(closeTo(toBaseUnit("1204.7")));
    expect(await bTokenInstance.balanceOf(depositor1.address)).to.equal("0");
    expect(await vaultInstance.principal()).to.satisfies(closeTo(toBaseUnit("1000")));

    await depositor2.BDAI.approve(vaultInstance.address, toBaseUnit("10000"));
    await depositor2.VAULT.withdraw();

    expect(await contracts.DAI.balanceOf(depositor2.address)).to.satisfies(closeTo(toBaseUnit("1095.2")));
    expect(await bTokenInstance.balanceOf(depositor2.address)).to.equal("0");
    expect(await bTokenInstance.totalSupply()).to.equal("0");
    expect(await vaultInstance.principal()).to.equal("0")
  })

  it("*T6 recipient withdraws his salary, \n recipient receives 100 Tokens back", async function () {
    await recipient.VAULT.recipientWithdraw(toBaseUnit("100"));

    expect(await vaultInstance.recipientReserve()).to.equal(toBaseUnit("0"));
    expect(await contracts.DAI.balanceOf(recipient.address)).to.satisfies(closeTo(toBaseUnit("1100")));
  })

  it("*T7 depositor1 deposits again and then withdraw", async function () {
    await depositor1.DAI.approve(vaultInstance.address, depositAmount);
    await depositor1.VAULT.deposit(depositAmount);

    expect(await contracts.DAI.balanceOf(depositor1.address)).to.satisfies(closeTo(toBaseUnit("204.7")));
    expect(await bTokenInstance.balanceOf(depositor1.address)).to.satisfies(closeTo(depositAmount));

    expect(await vaultInstance.principal()).to.satisfies(closeTo(depositAmount));
    expect(await vaultInstance.totalBalanceOf(depositor1.address)).to.satisfies(closeTo(depositAmount))

    let balance = await bTokenInstance.balanceOf(depositor1.address)
    await depositor1.BDAI.approve(vaultInstance.address, balance);
    await depositor1.VAULT.withdraw();
    expect(await contracts.DAI.balanceOf(depositor1.address)).to.satisfies(closeTo(toBaseUnit("1204.7")));
    expect(await bTokenInstance.balanceOf(depositor1.address)).to.equal("0");
    expect(await vaultInstance.principal()).to.equal("0");
  })
});
