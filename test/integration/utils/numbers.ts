import { utils, BigNumber } from "ethers";

// // turn ether unit into a wei base unit of 18 decimals
export function toBaseUnit(amount: string): BigNumber{
  return utils.parseEther(amount);
}

// comparison requires additional margin due to AAVE streamed interests
export function closeTo(amount: BigNumber): Function {
  return function(amount2: BigNumber): boolean{
    let dif = amount.gte(amount2) ? amount.mod(amount2) : amount2.mod(amount);
    return dif.lte(utils.parseEther("0.1"));
  }
}
