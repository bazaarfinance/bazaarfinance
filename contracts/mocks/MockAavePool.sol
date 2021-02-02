//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import "../BazrToken.sol";

contract MockAavePool {
    bool public deposited;
    bool public withdrawn;

    BazrToken atoken;
    IERC20 token;

    constructor (address _token, address _atoken) public {
        atoken = BazrToken(_atoken);
        token = IERC20(_token);
    }

    function deposit(
                     address asset,
                     uint256 amount,
                     address onBehalfOf,
                     uint16 referralCode
                     ) external {
        require(asset == address(token));
        token.transferFrom(msg.sender, address(this), amount);
        atoken.mint(msg.sender, amount);
        deposited = true;
    }


    function withdraw(
                      address asset,
                      uint256 amount,
                      address to
                      ) external returns (uint256) {
        withdrawn = true;
        require(asset == address(token));
        atoken.transferFrom(msg.sender, address(this), amount);
        token.transfer(to, amount);
        return 200;
    }
}
