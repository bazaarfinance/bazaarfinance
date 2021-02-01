//SPDX-License-Identifier: Unlicense                                                                                                                                         [0/0]
pragma solidity ^0.6.12;

import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
/* exchangeRate = principal + surplusInterest / bTokenTotalSupply */

contract ExchangeRate {

    // calculates token from btoken amount
    function btokenToToken(uint256 _principal,
                           uint256 _surplus,
                           uint256 _tokenSupply,
                           uint256 btokens
                           ) pure public returns (uint256){
        return SafeMath.div(SafeMath.mul(btokens, SafeMath.add(_surplus, _principal)), _tokenSupply);
    }

    // calculates btokens amount from tokens
    function tokenToBtoken(uint256 _principal,
                           uint256 _surplus,
                           uint256 _tokenSupply,
                           uint256 token
                           ) pure public returns (uint256){
        return SafeMath.div(SafeMath.mul(token, (_tokenSupply)), SafeMath.add(_surplus, _principal));
    }
}
