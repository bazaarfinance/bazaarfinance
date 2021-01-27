import { ethers, network } from "hardhat";
import { HardhatPluginError, lazyObject } from "hardhat/plugins";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Signer } from "ethers";
import { assert, expect } from "chai";


describe("Vault Contract Smoke Test with alice (depositor1), bob (depositor2) and charlie (recipient):", function () {
  let alice;
  let bob;
  let charlie;
  let aavePool;
  let token;
  let atoken;
  let btoken;
  let vaultFactory;
  let vaultTx;
  let vault;
  let aliceVaultSigner
  let bobVaultSigner
  let charlieVaultSigner
  let aliceTokenSigner
  let bobTokenSigner
  let aliceBtokenSigner
  let bobBtokenSigner
  let loadedDAI
  let loadedADAI
  let loadedPOOL
  let contractsLoaded = false;
  let contracts

  before(async function () {
    const contracts = {
      DAI: { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", nameOrAbi: "ERC20" },
      ADAI: { address: "0x028171bCA77440897B824Ca71D1c56caC55b68A3", nameOrAbi: "ERC20" },
      AAVE_POOL: { address: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9", nameOrAbi: "ILendingPool" }
    }
    loadedDAI = await ethers.getContractAt(contracts.DAI.nameOrAbi, contracts.DAI.address);
    loadedADAI = await ethers.getContractAt(contracts.ADAI.nameOrAbi, contracts.ADAI.address);
    loadedPOOL = await ethers.getContractAt(contracts.AAVE_POOL.nameOrAbi, contracts.AAVE_POOL.address);

    const accounts = [charlie, alice, bob] = await ethers.getSigners();


    const richDaiAccountAddress = '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE';

    // impersonate/unlock a random user account containing dai
    await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [richDaiAccountAddress]
    });

    const unlockedRichDaiSigner = await ethers.provider.getSigner(richDaiAccountAddress);
    const daiFaucet = loadedDAI.connect(unlockedRichDaiSigner);

    const transferPromises = accounts.map(async account => {
        return await daiFaucet.transfer(account.address, 100);
    });

    await Promise.all(transferPromises);


    const balance = await loadedDAI.balanceOf(alice.address);
    console.log(`alices balance of DAI: ${balance.toString()}`);

    // unimpersonate/lock a random user account containing dai
    await network.provider.request({
        method: "hardhat_stopImpersonatingAccount",
        params: [richDaiAccountAddress]
    });
  });

  before(async function() {
    let tokenFactory = await ethers.getContractFactory("MockERC20"); // need erc20 with a mint/burn methods
    let btokenTx = await tokenFactory.deploy("bDAI", "bDAI");

    btoken = await btokenTx.deployed();

    vaultFactory = await ethers.getContractFactory("Vault");
    vaultTx = await vaultFactory.deploy(
      charlie.address,
      loadedDAI.address,
      loadedPOOL.address,
      "100",
      btoken.address,
      loadedADAI.address
    );

    vault = await vaultTx.deployed();
  })

  it("*T1 Alice deposits 1000 Tokens, \n she receives 1000 bTokens back", async function () {
    aliceVaultSigner = vault.connect(alice);
    aliceTokenSigner = loadedDAI.connect(alice);
    await aliceTokenSigner.approve(vault.address, "100000");
    await aliceVaultSigner.deposit("100");
    let bbalance = await btoken.balanceOf(alice.address);
    expect(bbalance.toString()).to.equal("100");
  })

//   it("*T2 Interest surplus accrued by 200 aTokens, \n charlie earns 100 aTokens, \n 100 alice earns 100 aTokens", async function () {
//     await atoken.mint(vault.address, "200");
//     await token.mint(aavePool.address, "200");
//     await vault.manualTransition();
//     let recipientReserve = await vault.recipientReserve();
//     let aliceTotal = await vault.totalBalanceOf(alice.address);
//     expect(recipientReserve).to.equal(100);
//     expect(aliceTotal).to.equal(1100);
//   })

//   it("*T3 Bob deposits 1000 Tokens, \n he receives 909 bTokens back \n ", async function () {
//     bobVaultSigner = vault.connect(bob);
//     bobTokenSigner = token.connect(bob);
//     await aliceTokenSigner.mint(bob.address, "1000");
//     await bobTokenSigner.approve(vault.address, "100000");
//     await bobVaultSigner.deposit("1000");
//     let bobTotal = await vault.totalBalanceOf(bob.address);
//     let aliceTotal = await vault.totalBalanceOf(alice.address);
//     let bbob = await btoken.balanceOf(bob.address);
//     expect(bobTotal).to.equal("999"); // loss of precision, should be fine for large 18 decimals
//     expect(aliceTotal).to.equal("1100");
//     expect(bbob).to.equal("909");
//   })

//   it("*T4 Interests surplus accrued by 200 aTokens, \n charlie does not earn any aTokens, \n alice earns 104 aTokens \n, bob earns 95 aTokens", async function () {
//     await atoken.mint(vault.address, "200");
//     await token.mint(aavePool.address, "200");
//     await vault.manualTransition();
//     let aliceTotal = await vault.totalBalanceOf(alice.address);
//     let bobTotal = await vault.totalBalanceOf(bob.address);
//     expect(aliceTotal).to.equal("1204");
//     expect(bobTotal).to.equal("1095");
//   })

//   it("*T5 Alice and Bob withdraw their entire balance, \n Alice receives 1204 Tokens back, \n Bob receives 1096 Tokens back", async function () {
//     aliceBtokenSigner = btoken.connect(alice);
//     bobBtokenSigner = btoken.connect(bob);
//     await aliceBtokenSigner.approve(vault.address, "10000");
//     let bal = await atoken.balanceOf(aavePool.address);
//     await aliceVaultSigner.withdraw();
//     let aliceTokenBalance = await token.balanceOf(alice.address);
//     expect(aliceTokenBalance).to.equal("1204");

//     let bal2 = await atoken.balanceOf(aavePool.address);
//     await bobBtokenSigner.approve(vault.address, "10000");
//     await bobVaultSigner.withdraw();
//     let bobTokenBalance = await token.balanceOf(bob.address);
//     expect(bobTokenBalance).to.equal("1096"); // TODO why is the returned balance off by one?
//   })

//   it("*T6 Charlie withdraws his salary, \n Charlie receives 100 Tokens back", async function () {
//     charlieVaultSigner = vault.connect(charlie);
//     await charlieVaultSigner.recipientWithdraw("100");
//     let charliebalance = await token.balanceOf(charlie.address);
//     expect(charliebalance).to.equal("100");
//   })
})
