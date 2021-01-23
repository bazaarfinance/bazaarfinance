//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import "hardhat/console.sol";

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import '@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./interface/IBazrToken.sol";

/*
 State variables from Miro: https://miro.com/app/board/o9J_lYIOBLw=/

 InInterestsEarned  (inbound interests earned) = TotalInterest - LastCheckpointInterest
 var goalAmount uint256
 var LastCheckpointInterest uint256
 var surplusBucket uint256
 var recipientBucket uint256;
 var StartSurplus bool
 var epoch uint256
*/

/*
 Based on HackMD Smart Contract Pseudo Code Section: https://hackmd.io/NDJs1AmJTPShtek-PwjNRw#Smart-Contract-Pseudo-Code

 Barebones class, noteably missing things like Ownable, proxy pattern for upgradeability, etc..
 */
contract BazaarVault is Initializable, OwnableUpgradeSafe {

    using SafeMath for uint256;

    IBazrToken bToken;
    address dai;
    address aDai;
    address public recipient;
    uint256 public goalAmount;

    /***************
    EVENTS
    ***************/

    /***************
    FUNCTIONS
    ***************/
    /// @dev Creates a pool (proxy) which points to this logic contract
    /// @param _dai address of the DAI stablecoin contract
    /// @param _aDai address of the aDai interest-accruing token contract
    /// @param _recipient address of the beneficiary
    /// @param _goalAmount desired recipient payout for a given time period
    /// @param _owner The address of the pool owner
    function initialize(address _dai, address _aDai, address _recipient, uint256 _goalAmount, address _owner) public initializer {
        __Ownable_init();
        OwnableUpgradeSafe.transferOwnership(_owner);
        dai = _dai;
        aDai = _aDai;
        recipient = _recipient;
        goalAmount = _goalAmount;

        // need payout frequency here as well I think
    }

    function deposit(address depositor, uint256 amount) external {
        // assume that this contract is approved in the ERC-20 contract to spend caller tokens
        // transferFrom(address(this), amount) <- send ERC20 to this contract
        // approve(address(pool), amount) <- approve the pool to spend
        // pool.deposit() <- deposit ERC20 token into Aave pool and get aTokens
        // updateExchangeRate()
        // bToken.mint(msg.sender, amount * exchangeRate)

        bToken.mint(depositor, amount);
    }

    function withdraw(address withdrawer, uint256 amount) external {
        // updateExchangeRate()
        // uint bTokenAmount = amount / exchangeRate;
        // bToken.approve(address(this), bTokenAmount);
        // bToken.transferFrom(msg.sender, address(0x), amount)
        // aToken.approve(address(pool), amount);

        // send 'amount' of dai back to withdrawer
        bToken.burn(withdrawer, amount);
    }

    function withdrawRecipient(uint256 amount) external {
        // updateExchangeRate()
        // uint bTokenAmount = amount / exchangeRate;
        // bToken.approve(address(this), bTokenAmount);
        // bToken.transferFrom(msg.sender, address(0x), amount)
        // aToken.approve(address(pool), amount);

        // send 'amount' of dai back to recipient
        bToken.burn(recipient, amount);
    }

    function updateExchangeRate() private {
        // interestEarned = a.tokenBalanceOf(address(this)) - principal;
        // exchangeRate = aToken.balanceOf(address(this)) / bToken.totalSupply();
    }
}
