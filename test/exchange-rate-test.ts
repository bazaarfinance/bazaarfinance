import { ethers } from "hardhat";
import { Signer } from "ethers";
import { assert, expect } from "chai";

describe("Exchange rate", function () {
  let tests;
  let ExchangeRate;
  let exchangerate;

  beforeEach(async function () {
    ExchangeRate = await ethers.getContractFactory("ExchangeRate");
    exchangerate = await ExchangeRate.deploy();
  });

  describe("tokenToBtoken", function () {
    tests = [
      {
        name: "should return the 1-1 token to Alice when interest is 0 ",
        input: ["1000", "0", "1000", "1000"],
        output: "1000000000000000000000"
      },
      {
        name: "should return correct amount to Bob when amount has repeating decimals",
        input: ["1000", "100", "1000", "1000"],
        output: "909090909090909090909"
      },
      {
        name: "should return correct amount to Bob when amount > supply",
        input: ["1000", "100", "1000", "10000"],
        output: "9090909090909090909090"
      },
    ]
    tests.forEach((test) => {
      it(test.name, async () => {
        let btokenamount = await exchangerate.tokenToBtoken(
          ethers.utils.parseEther(test.input[0]).toString(),
          ethers.utils.parseEther(test.input[1]).toString(),
          ethers.utils.parseEther(test.input[2]).toString(),
          ethers.utils.parseEther(test.input[3]).toString(),
        )
        assert.equal(test.output, btokenamount.toString() )
      })
    })
  });

  describe("tokenToBtoken", function () {
    tests = [
      {
        name: "should return the 1-1 token to Alice when interest is 0 ",
        input: ["1000", "0", "1000", "1000"],
        output: "1000000000000000000000"
      },
      {
        name: "should return correct amount to Alice when surplus is accrued",
        input: ["1000", "100", "1000", "1000"],
        output: "1100000000000000000000"
      },
      {
        name: "should return the correct amount for alice even when the supply is updated",
        input: ["2000", "100", "1909", "1000"],
        output: "1100052383446830801466"
      },
      {
        name: "should return the correcta amount for bob after he deposits",
        input: ["2000", "100", "1909", "909"],
        output: "999947616553169198533"
      },
      {
        name: "shuould return the correct amount for bob after interests accrued",
        input: ["2000", "300", "1909", "909"],
        output: "1095180722891566265060"
      },
      {
        name: "shuould return the correct amount for alice after interests accrued",
        input: ["2000", "300", "1909", "1000"],
        output: "1204819277108433734939"
      },
      {
        name: "shuould return the correct amount for bob after alice cashed out",
        input: ["795", "300", "909", "909"],
        output: "1095000000000000000000"
      },

    ]
    tests.forEach((test) => {
      it(test.name, async () => {
        let btokenamount = await exchangerate.btokenToToken(
          ethers.utils.parseEther(test.input[0]),
          ethers.utils.parseEther(test.input[1]),
          ethers.utils.parseEther(test.input[2]),
          ethers.utils.parseEther(test.input[3]),
        )
        assert.equal(test.output, btokenamount.toString())
      })
    })

  })
  ;

});

