//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.3;

import "../IMINTERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockAavePool {
    bool public deposited;
    bool public withdrawn;

    IMINTERC20 atoken;
    IERC20 token;

    constructor (address _token, address _atoken) {
        atoken = IMINTERC20(_atoken);
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
        atoken.transferFrom(msg.sender, address(0), amount);
        token.transfer(msg.sender, amount);
        return 200;
    }
}
