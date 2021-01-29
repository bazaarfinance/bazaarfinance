// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

/**
 * @title ERC20 bToken interface contract
 */

interface IVaultFactory {
    function hasRole(bytes32 role, address account) external view returns (bool);
}