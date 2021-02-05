// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

/// declare IVaultFactory as the Vault Contract has to check hasRole
interface IVaultFactory {
    function hasRole(bytes32 role, address account) external view returns (bool);
}
