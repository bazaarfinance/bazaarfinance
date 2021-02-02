// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";

/**
 * @title ERC20 bToken interface contract
 */

interface IBazrToken is IERC20 {
    function mint(address depositor, uint256 amount) external;
    function burn(address withdrawer, uint256 amount) external;
    function setVaultAddress(address _vaultAddress) external;
}