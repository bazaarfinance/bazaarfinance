import * as hardhat from "hardhat";
import { Contract, ContractFactory, Signer } from "ethers";
import { assert, expect } from "chai";

describe("Bazaar Token", function () {
  let deployer: Signer;
  
  let BazrToken: ContractFactory;
  let bazrToken: Contract;

  before(async function () {
    [deployer] = await hardhat.ethers.getSigners();
  });

  beforeEach(async function () {
    BazrToken = await hardhat.ethers.getContractFactory("BazrToken");

    bazrToken = await BazrToken.deploy();
  });

  describe("Deployment", function () {
    it("Should set the correct roles for owner", async function () {
      const deployerAddress = await deployer.getAddress();

      expect(await bazrToken.hasRole(bazrToken.DEFAULT_ADMIN_ROLE(), deployerAddress)).to.be.true;
      expect(await bazrToken.hasRole(bazrToken.MINTER_ROLE(), deployerAddress)).to.be.true;
      expect(await bazrToken.hasRole(bazrToken.PAUSER_ROLE(), deployerAddress)).to.be.true;
    });

    it("Should set the right token name and symbol", async function () {
      expect(await bazrToken.name()).to.equal("Bazaar Token");
      expect(await bazrToken.symbol()).to.equal("BAZR");
    });

    it("Should have an initial total supply of 0", async function () {
      expect(await bazrToken.totalSupply()).to.equal(0);
    });
  });
});

