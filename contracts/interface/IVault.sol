// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";
import "./IExchangeRate.sol";

/**
 * @title Vault contract interface
 */

interface IVault is IExchangeRate {
    /* @notice emitted on new deposit */
    /* @param depositor the hexadecimal address of the depositor */
    /* @param amount the amount of the deposit in native aTokens*/
    event NewDeposit(address indexed depositor, uint256 indexed amount);

    /* @notice emitted on withdrawals by recipient */
    /* @param amount the amount of the withdraw in aTokens*/
    event RecipientWithdraw(uint256 indexed amount);

    /* @notice emitted on withdrawals by a depositor */
    /* @param depositor the hexadecimal address of the depositor */
    /* @param amount of the withdrawal in native aTokens */
    event DepositorWithdraw(address indexed depositor, uint256 indexed amount);

    /* @notice Deposits `_amount` of `token` into Aave pool and mints equivalent bTokens.  */
    /* @param _amount The amount to deposit. */
    function deposit(uint256 _amount) external;

    /* @notice Withdraws the user's entire balance.  */
    function withdraw() external;

    /* @notice Withdraws salary to recipient address. Only callable by `recipient`. */
    /* @param _amount The amount to withdraw. */
    function recipientWithdraw(uint256 _amount) external;

    /* @notice Calculates the principal plus interest earned by _address in aTokens. */
    /* @param _address The hexadecimal address to query the balance for.  */
    /* @return Balance of the _address in aTokens. */
    function totalBalanceOf(address _address) external view returns (uint256);

    /* @notice Convenience function to execute a state transition. */
    function manualTransition() external;
}
