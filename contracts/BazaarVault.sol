//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.3;

import "hardhat/console.sol";

import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";

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
contract BazaarVault {
    IERC20 dai;
    IERC20 aDai;
    ERC20PresetMinterPauser bazrToken;
    address recipient;
    address token;
    uint256 salary;

    constructor(IERC20 _dai, IERC20 _aDai, ERC20PresetMinterPauser _bazrToken, address _recipient, uint256 _salary) {
        dai = _dai;
        aDai = _aDai;
        bazrToken = _bazrToken;
        recipient = _recipient;
        salary = _salary;

        // need payout frequency here as well I think
    }

    //
    // Events...
    //

    function deposit(address depositor, uint256 amount) external {
        // assume that this contract is approved in the ERC-20 contract to spend caller tokens
        // transferFrom(address(this), amount) <- send ERC20 to this contract
        // approve(address(pool), amount) <- approve the pool to spend
        // pool.deposit() <- deposit ERC20 token into Aave pool and get aTokens
        // updateExchangeRate()
        // bToken.mint(msg.sender, amount * exchangeRate)

        bazrToken.mint(depositor, amount);
    }

    function withdraw(address withdrawer, uint256 amount) external {
        // updateExchangeRate()
        // uint bTokenAmount = amount / exchangeRate;
        // bToken.approve(address(this), bTokenAmount);
        // bToken.transferFrom(msg.sender, address(0x), amount)
        // aToken.approve(address(pool), amount);

        // send 'amount' of dai back to withdrawer
        bazrToken.burn(amount);
    }

    function withdrawRecipient(uint256 amount) external {
        // updateExchangeRate()
        // uint bTokenAmount = amount / exchangeRate;
        // bToken.approve(address(this), bTokenAmount);
        // bToken.transferFrom(msg.sender, address(0x), amount)
        // aToken.approve(address(pool), amount);

        // send 'amount' of dai back to recipient
        bazrToken.burn(amount);
    }

    function updateExchangeRate() private {
        // interestEarned = a.tokenBalanceOf(address(this)) - principal;
        // exchangeRate = aToken.balanceOf(address(this)) / bToken.totalSupply();
    }
}
