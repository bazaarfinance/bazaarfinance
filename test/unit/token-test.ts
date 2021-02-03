import * as hardhat from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { assert, expect } from "chai";

describe("Bazaar Token", function () {
  // @ts-ignore
  let deployer: SignerWithAddress;
  // @ts-ignore
  let vault: SignerWithAddress;
  // @ts-ignore
  let depositor1: SignerWithAddress;
  // @ts-ignore
  let depositor2: SignerWithAddress;

  let BazrToken: ContractFactory;
  let bazrToken: Contract;
  let vaultSigner;
  let depositor1Signer;
  let tokenName = "Bazaar Token";
  let tokenSymbol = "BAZR";
  let testAmount = "1000"

  before(async function () {
    [deployer, vault, depositor1, depositor2] = await hardhat.ethers.getSigners();
  });

  beforeEach(async function () {
    BazrToken = await hardhat.ethers.getContractFactory("BazrToken");

    bazrToken = await BazrToken.deploy();
    await bazrToken.deployed();

    await bazrToken.initialize(tokenName, tokenSymbol);
    await bazrToken.setVaultAddress(vault.address);
    vaultSigner = bazrToken.connect(vault);
    depositor1Signer = bazrToken.connect(depositor1);
  });

  describe("Deployment", function () {

    it("Should set the right token name and symbol", async function () {
      expect(await bazrToken.name()).to.equal(tokenName);
      expect(await bazrToken.symbol()).to.equal(tokenSymbol);
    });

    it("Should have an initial total supply of 0", async function () {
      expect(await bazrToken.totalSupply()).to.equal(0);
    });

    it("should allow vault to mint to depositor", async function () {
      await vaultSigner.mint(depositor1.address, testAmount);
      expect(await bazrToken.balanceOf(depositor1.address)).to.equal(testAmount)
    })

    it("should not allow wallet to send funds to non-vault address", async function () {
      await vaultSigner.mint(depositor1.address, testAmount);
      await expect(depositor1Signer.transfer(depositor2.address, testAmount)).to.be.revertedWith("Only allow to transfer to or from Vault");
    })

    it("should allow depositor to send funds back to vault", async function () {
      await vaultSigner.mint(depositor1.address, testAmount);
      await depositor1Signer.approve(vault.address, testAmount);
      await vaultSigner.transferFrom(depositor1.address, vault.address, testAmount);
      expect(await bazrToken.balanceOf(vault.address)).to.equal(testAmount)
    })

    it("should allow vault to burn funds", async function () {
      await vaultSigner.mint(vault.address, testAmount);
      await vaultSigner.burn(vault.address, testAmount);
      expect(await bazrToken.balanceOf(vault.address)).to.equal("0")
      expect(await bazrToken.totalSupply()).to.equal("0");
    })

  });
});

