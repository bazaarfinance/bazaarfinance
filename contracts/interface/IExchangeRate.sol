// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

interface IExchangeRate {

    // @notice returns tokens from btokens, pure function
    /* @param _principal amount in underlying asset deposited into the contract  */
    /* @param _surplus the interests earned that belong to the depositorReserve */
    /* @param _btokens the depositor's btokens amount to convert to underlying tokens */
    /* @return amount in underlying tokens to return to depositor */
    function btokenToToken(uint256 _principal,
                           uint256 _surplus,
                           uint256 _tokenSupply,
                           uint256 _btokens
                           ) pure external returns (uint256);

    // @notice returns btokens from tokens, pure function
    /* @param _principal amount in underlying asset deposited into the contract  */
    /* @param _surplus the interests earned that belong to the depositorReserve */
    /* @param _btokens the depositor's btokens amount to convert to underlying tokens */
    /* @return amount amount in btokens to mint to users */
    function tokenToBtoken(uint256 _principal,
                           uint256 _surplus,
                           uint256 _tokenSupply,
                           uint256 _token
                           ) pure external returns (uint256);
}
