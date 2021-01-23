// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

/**
 * @title ERC20 bToken interface contract
 */

interface IBazrToken {
    function mint(address depositor, uint256 amount) external;
    function burn(address withdrawer, uint256 amount) external;
}