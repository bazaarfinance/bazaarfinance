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
    uint256 public interestEarnedAtLastCheckpoint;  // last time the interest earned was measured

    bool public startedSurplus;

    uint256 public principal;
    uint256 public depositorReserve;
    uint256 public recipientReserve;
    mapping(address=>uint256) public depositorToPrincipal;  // keep track of the principal of every depositors to calculate withdraws


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
       interestEarnedAtLastCheckpoint = 0;

       depositorReserve = 0;
       recipientReserve = 0;
       principal = 0;
       startedSurplus = false;
   }

    /// @notice Deposits `_amount` of `token` into Aave pool and mints equivalent bTokens. 
    /// @param _amount The amount to deposit.
    function deposit(uint256 _amount) public {
        _stateTransition();

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
        depositorToPrincipal[msg.sender] = SafeMath.add(depositorToPrincipal[msg.sender], _amount);
        // we keep track of user's principal, not that with this design- we can't allow user to transfer bToken to each other
        _updateCheckpointInterest();
    }

    /// @notice Withdraws the user's entire balance. 
    function withdraw() public {
        _stateTransition();
        // decrement user's principal, principal and depositorReserve;
        uint256 balance = bToken.balanceOf(msg.sender);
        bToken.transferFrom(msg.sender, address(this), balance);
        uint256 aTokenAmount;
        if (depositorReserve > 0) {
            aTokenAmount = btokenToToken(
                principal,
                depositorReserve,
                bToken.totalSupply(),
                balance
            );
        } else {
            aTokenAmount = balance;
        }

        depositorReserve = SafeMath.sub(
            depositorReserve, 
            SafeMath.sub(aTokenAmount, depositorToPrincipal[msg.sender])
            );
        principal = SafeMath.sub(principal, depositorToPrincipal[msg.sender]);
        depositorToPrincipal[msg.sender] = 0;
        // withdraw atokens
        bToken.burn(balance);
        aToken.approve(address(aavePool), aTokenAmount);
        aavePool.withdraw(
            address(token),
            aTokenAmount,
            msg.sender
        );
        _updateCheckpointInterest();
    }

    /// @notice Withdraws salary to recipient address. Only callable by `recipient`.
    /// @param _amount The amount to withdraw.
    function recipientWithdraw(uint256 _amount) public {
        _stateTransition();
        require(msg.sender == recipient);
        require(_amount <= recipientReserve);
        aToken.approve(address(aavePool), _amount);
        recipientReserve = SafeMath.sub(recipientReserve, _amount);
        aavePool.withdraw(
            address(token),
            _amount,
            recipient
        );
        _updateCheckpointInterest();
    }

    /// @notice Calculates the principal plus interest earned by _address in aTokens.
    /// @param _address The address to query the balance for. 
    function totalBalanceOf(address _address) public view returns (uint256){
        uint256 balance = bToken.balanceOf(_address);
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

    /// @notice Convenience function to execute a state transition.
    function manualTransition() public {
        _stateTransition();
        _updateCheckpointInterest();
    }



    function _stateTransition() private {
        // totalInterestEarned should always be >= to interestEarnedAtLastCheckpoint
        // totalInterestEarned - interestEarnedAtLastCheckpoint will give us the interests we need to allocate
        uint256 totalInterestEarned = aToken.balanceOf(address(this)) - principal;
        if (block.timestamp < nextCheckpoint){
            if (!startedSurplus) {
                /* Check if interest earned exceeds salary. If true, adds salary to recipient reserve and any surplus to depositor reserve. */
                if (totalInterestEarned - interestEarnedAtLastCheckpoint >= salary) {
                    recipientReserve = SafeMath.add(recipientReserve, salary);
                    depositorReserve = SafeMath.add(
                        depositorReserve, 
                        SafeMath.sub(
                            SafeMath.sub(
                                totalInterestEarned,
                                interestEarnedAtLastCheckpoint
                            ), salary));
                    startedSurplus = true;  /* Set flag to true to direct interest to depositor reserver until next checkpoint */
                } else {
                    /* Do nothing until the unallocated interest exceeds the salary */ 
                    return; 
                }
            } else {
                depositorReserve = SafeMath.add(
                    depositorReserve,
                    SafeMath.sub(totalInterestEarned, interestEarnedAtLastCheckpoint)
                    );
            }
        } else {
            if (!startedSurplus) {
                if (totalInterestEarned - interestEarnedAtLastCheckpoint >= salary) {
                    recipientReserve = SafeMath.add(recipientReserve, salary);
                    depositorReserve = SafeMath.add(
                        depositorReserve, 
                        SafeMath.sub(
                            SafeMath.sub(
                                totalInterestEarned,
                                interestEarnedAtLastCheckpoint
                            ), salary));                }
                if (totalInterestEarned - interestEarnedAtLastCheckpoint < salary ) {
                    recipientReserve = SafeMath.add(
                        recipientReserve, 
                        SafeMath.sub(totalInterestEarned, interestEarnedAtLastCheckpoint)
                        );
                }
            } else {
                depositorReserve = SafeMath.add(
                    depositorReserve,
                    SafeMath.sub(totalInterestEarned, interestEarnedAtLastCheckpoint)
                );
            }
            _reset();  // always _reset when current time is higher than checkpoint
        }
    }

    function _reset() private {
        nextCheckpoint = block.timestamp + 30 days;  // hardcoded 30 days for now
        startedSurplus = false;
    }



    // update last seen interests to the contract state
    // this helps us define unallocated interests and should be called on every transactions that affect aToken balance of the contract
    // so that all unallocated interests is always positive
    function _updateCheckpointInterest() private {
        uint256 totalInterestEarned = aToken.balanceOf(address(this)) - principal;
        interestEarnedAtLastCheckpoint = totalInterestEarned;
    }

}
