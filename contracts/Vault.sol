// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./ILendingPool.sol";
import "./BazrToken.sol";
import "./ExchangeRate.sol";


contract Vault is ExchangeRate {
    /// @dev Vault parameters.
    address public recipient;
    uint256 public salary;

    /// @dev Associated external smart contracts. 
    ILendingPool public aavePool;
    IERC20 public token;
    IERC20 public aToken;
    BazrToken public bToken;  // btokens should be mintable

    uint256 public nextCheckpoint;
    uint256 public lastCheckpointInterest;  // last time the interest earned was measured

    bool public startedSurplus;

    uint256 public principal;
    uint256 public depositorReserve;
    uint256 public recipientReserve;
    mapping(address=>uint256) public AddressToPrincipal;  // keep track of the principal of every depositors to calculate withdraws


   /// @param _recipient The address of the recipient.
   /// @param _token The hexadecimal address of the salary and endowment token. 
   /// @param _aavePool The Aave pool generating interest.
   /// @param _salary The salary targeted for the recipient.
   /// @param _bToken The hexadecimal address of the associated bToken.
   /// @param _aToken The hexadecimal address of the associated aToken.
   constructor(address _recipient, address _token, address _aavePool, uint _salary, address _bToken, address _aToken)  {
       recipient = _recipient;
       salary = _salary;

       token = IERC20(_token);
       bToken = BazrToken(_bToken);
       aToken = IERC20(_aToken);
       aavePool = ILendingPool(_aavePool);

       nextCheckpoint = block.timestamp + 30 days;  // hardcoded 30 days for now
       lastCheckpointInterest = 0;

       depositorReserve = 0;
       recipientReserve = 0;
       principal = 0;
       startedSurplus = false;
   }

    /// @notice Deposits `_amount` of `token` into Aave pool and mints equivalent bTokens. 
    /// @param _amount The amount to deposit.
    function deposit(uint256 _amount) public {
        stateTransition();

        token.transferFrom(msg.sender, address(this), _amount);
        token.approve(address(aavePool), _amount);
        aavePool.deposit(
            address(token),
            _amount,
            address(this),
            0
        );
        uint256 bTokensToMint;
        if (depositorReserve > 0) {
            bTokensToMint = tokenToBtoken(
                          principal,
                          depositorReserve,
                          bToken.totalSupply(),
                          _amount
            );
        } else {
            bTokensToMint = _amount; // first deposit always 1-1
        }
        bToken.mint(msg.sender, bTokensToMint);
        AddressToPrincipal[msg.sender] += _amount;  // we keep track of user's principal, not that with this design- we can't allow user to transfer bToken to each other
        principal += _amount;
        updateCheckpointInterest();
    }

    /// @notice Withdraws the user's entire balance. 
    function withdraw() public {
        stateTransition();
        // decrement user's principal, principal and depositorReserve;
        uint256 balance = bToken.balanceOf(msg.sender);
        bToken.transferFrom(msg.sender, address(this), balance);
        uint256 atokenamount;
        if (depositorReserve > 0) {
            atokenamount = btokenToToken(
                principal,
                depositorReserve,
                bToken.totalSupply(),
                balance
            );
        } else {
            atokenamount = balance;
        }
        depositorReserve -= (atokenamount - AddressToPrincipal[msg.sender]); // subtract principal from user's atokens to get the interests earned
        principal -= AddressToPrincipal[msg.sender];
        AddressToPrincipal[msg.sender] = 0;
        // withdraw atokens
        bToken.burn(balance);
        aToken.approve(address(aavePool), atokenamount);
        aavePool.withdraw(
            address(token),
            atokenamount,
            msg.sender
        );
        updateCheckpointInterest();
    }

    /// @notice Withdraws salary to recipient address. Only callable by `recipient`.
    /// @param _amount The amount to withdraw.
    function recipientWithdraw(uint256 _amount) public {
        stateTransition();
        require(msg.sender == recipient);
        require(_amount <= recipientReserve);
        aToken.approve(address(aavePool), _amount);
        recipientReserve -= _amount;
        aavePool.withdraw(
            address(token),
            _amount,
            recipient
        );
        updateCheckpointInterest();
    }

    function stateTransition() private {
        // totalInterestEarned should always be >= to lastCheckpointInterest
        // totalInterestEarned - lastCheckpointInterest will give us the interests we need to allocate
        uint256 totalInterestEarned = aToken.balanceOf(address(this)) - principal;
        if (block.timestamp < nextCheckpoint){
            if (!startedSurplus) {
                if (totalInterestEarned - lastCheckpointInterest >= salary) {
                    recipientReserve += salary;  // gives salary to the recipientReserve
                    depositorReserve += ((totalInterestEarned - lastCheckpointInterest) - salary);  // send any leftover from salary to depositor
                    startedSurplus = true;  // set flag to true so that interest always go to depositorReserve from here on until we reach nextCheckpoint
                } else {
                    return;  // we do nothing until the unallocated interest is more than salary
                }
            } else {
                depositorReserve += totalInterestEarned - lastCheckpointInterest;
            }
        } else {
            if (!startedSurplus) {
                if (totalInterestEarned - lastCheckpointInterest >= salary) {
                    recipientReserve += salary;
                    depositorReserve += ((totalInterestEarned - lastCheckpointInterest) - salary);
                }
                if (totalInterestEarned - lastCheckpointInterest < salary ) {
                    recipientReserve += (totalInterestEarned - lastCheckpointInterest);  // if we never reached target salary, give all interests to recipient
                }
            } else {
                depositorReserve += totalInterestEarned - lastCheckpointInterest;  // assuming salary is already allocated to recipient, give interests to
            }
            reset();  // always reset when current time is higher than checkpoint
        }
    }

    function reset() private {
        nextCheckpoint = block.timestamp + 30 days;  // hardcoded 30 days for now
        startedSurplus = false;
    }

    // update the state manually at the end of the checkpoint
    // must also update the checkpoint interest
    function manualTransition() public {
        stateTransition();
        updateCheckpointInterest();
    }

    // calculate principal + interest earned by an address in atoken
    function totalBalanceOf(address wallet) public view returns (uint256){
        uint256 balance = bToken.balanceOf(wallet);
        uint256 atokenamount;
        if (depositorReserve > 0) {
            atokenamount = btokenToToken(
                principal,
                depositorReserve,
                bToken.totalSupply(),
                balance
            );
        } else {
            atokenamount = balance;
        }
        return atokenamount;
    }

    // update last seen interests to the contract state
    // this helps us define unallocated interests and should be called on every transactions that affect aToken balance of the contract
    // so that all unallocated interests is always positive
    function updateCheckpointInterest() private {
        uint256 totalInterestEarned = aToken.balanceOf(address(this)) - principal;
        lastCheckpointInterest = totalInterestEarned;
    }

}
