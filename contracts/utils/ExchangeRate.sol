//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

/* @title exchange rate calculation */
/* @notice from bTokens to aTokens and vice versa */
/* @dev the equation is exchangeRate = principal + surplusInterest / bTokenTotalSupply */
contract ExchangeRate {

    // @notice returns tokens from btokens, pure function
    /* @param _principal amount in underlying asset deposited into the contract  */
    /* @param _surplus the interests earned that belong to the depositorReserve */
    /* @param _tokenSupply the total supply for the Bazr Token*/
    /* @param _btokens the depositor's btokens amount to convert to underlying tokens */
    /* @return amount in underlying tokens to return to depositor */
    function btokenToToken(uint256 _principal,
                           uint256 _surplus,
                           uint256 _tokenSupply,
                           uint256 _btokens
                           ) pure public returns (uint256){
        return SafeMath.div(SafeMath.mul(_btokens, SafeMath.add(_surplus, _principal)), _tokenSupply);
    }

    // @notice returns btokens from tokens, pure function
    /* @param _principal amount in underlying asset deposited into the contract  */
    /* @param _surplus the interests earned that belong to the depositorReserve */
    /* @param _tokenSupply the total supply for the Bazr Token*/
    /* @param _tokens the depositor's btokens amount to convert to underlying tokens */
    /* @return amount amount in btokens to mint to users */
    function tokenToBtoken(uint256 _principal,
                           uint256 _surplus,
                           uint256 _tokenSupply,
                           uint256 _token
                           ) pure public returns (uint256){
        return SafeMath.div(SafeMath.mul(_token, (_tokenSupply)), SafeMath.add(_surplus, _principal));
    }
}
