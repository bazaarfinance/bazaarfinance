// SPDX-License-Identifier: MIT
pragma solidity ^0.6.12;

import "@aave/protocol-v2/contracts/interfaces/ILendingPool.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/utils/Pausable.sol";
import "./interface/IBazrToken.sol";
import "./interface/IVaultFactory.sol";
import "./utils/ExchangeRate.sol";


/* @title vault contract for bazaar finance */
contract Vault is ExchangeRate, OwnableUpgradeSafe, PausableUpgradeSafe {

    using SafeMath for uint256;

    /***************
    CONSTANTS
    ***************/

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    /***************
    STATE VARIABLES
    ***************/

    /// @dev Vault parameters.
    address public recipient;
    uint256 public salary;

    /// @dev Associated external smart contracts.
    IVaultFactory public factory;
    ILendingPool public aavePool;
    IERC20 public token;
    IERC20 public aToken;
    IBazrToken public bToken;

    uint256 public nextCheckpoint;
    uint256 public interestEarnedAtLastCheckpoint;  // @dev last time the interest earned was measured, always increase

    bool public startedSurplus;

    uint256 public principal;
    uint256 public depositorReserve;
    uint256 public recipientReserve;
    mapping(address=>uint256) public depositorToPrincipal;  // keep track of the principal of every depositors to calculate withdraws

    /***************
    EVENTS
    ***************/

    event NewDeposit(address indexed depositor, uint256 indexed amount);
    event RecipientWithdraw(uint256 indexed amount);
    event DepositorWithdraw(address indexed depositor, uint256 indexed amount);

    /***************
    FUNCTIONS
    ***************/

   /// @param _recipient The address of the recipient.
   /// @param _token The hexadecimal address of the salary and endowment token.
   /// @param _aavePool The Aave pool generating interest.
   /// @param _salary The salary targeted for the recipient.
   /// @param _bToken The hexadecimal address of the associated bToken.
   /// @param _aToken The hexadecimal address of the associated aToken.
   function initialize(address _recipient, address _token, address _aavePool, uint _salary, address _bToken, address _aToken, address _owner) public initializer {
       __Ownable_init();
        OwnableUpgradeSafe.transferOwnership(_owner);

       recipient = _recipient;
       salary = _salary;

       factory = IVaultFactory(msg.sender);
       token = IERC20(_token);
       bToken = IBazrToken(_bToken);
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
    function deposit(uint256 _amount) public whenNotPaused {
        require(_amount > 0, "amount to deposit cannot be zero");
        _stateTransition();

        token.transferFrom(msg.sender, address(this), _amount);
        token.approve(address(aavePool), _amount);
        uint256 beforeBalance = aToken.balanceOf(address(this));
        aavePool.deposit(
            address(token),
            _amount,
            address(this),
            0
        );
        uint256 afterBalance = aToken.balanceOf(address(this));
        require(afterBalance >= beforeBalance, "atoken balance after deposit must be more than before");
        uint256 atokenAmount = afterBalance.sub(beforeBalance);
        uint256 bTokensToMint;
        if (principal > 0) {
            bTokensToMint = tokenToBtoken(
                          principal,
                          depositorReserve,
                          bToken.totalSupply(),
                          atokenAmount
            );
        } else {
            bTokensToMint = atokenAmount; // @dev first deposit always 1-1
        }
        bToken.mint(msg.sender, bTokensToMint);
        depositorToPrincipal[msg.sender] = depositorToPrincipal[msg.sender].add(atokenAmount);
        principal = principal.add(atokenAmount);
        // @dev we keep track of user's principal, note that with this design- we can't allow user to transfer bToken to each other
        _updateCheckpointInterest();
        emit NewDeposit(msg.sender, atokenAmount);
    }


    /// @notice Withdraws the user's entire balance.
    /// @dev withdrawal less than the entire balance requires a complex check of how much pricipal to withdraw vs the interests
    function withdraw() public whenNotPaused {
        _stateTransition();
        // decrement user's principal, principal and depositorReserve;
        uint256 balance = bToken.balanceOf(msg.sender);
        bToken.transferFrom(msg.sender, address(this), balance);
        uint256 aTokenAmount;
        if (principal > 0) {
            aTokenAmount = btokenToToken(
                principal,
                depositorReserve,
                bToken.totalSupply(),
                balance
            );
        } else {
            aTokenAmount = balance;
        }

        require(aTokenAmount > 0, "amount to withdraw cannot be zero");
        bToken.burn(address(this), balance);
        require(aTokenAmount >= depositorToPrincipal[msg.sender], "atoken must be more than depositorPrincipal");
        require(depositorReserve >= aTokenAmount.sub(depositorToPrincipal[msg.sender]), "atoken must be more than depositorPrincipal");
        depositorReserve = depositorReserve.sub(
            aTokenAmount.sub(depositorToPrincipal[msg.sender])
        );
        require(principal >= depositorToPrincipal[msg.sender], "principal must be over depositorPrincipal");
        principal = principal.sub(depositorToPrincipal[msg.sender]);
        depositorToPrincipal[msg.sender] = 0;
        // withdraw atokens
        aToken.approve(address(aavePool), aTokenAmount);
        uint256 aTokenBalance = aToken.balanceOf(address(this));

        // @dev in an edge case where the btokenToToken() math is imprecise,
        // @dev aTokenAmount could be higher than total aToken balance when the withdraw is owned by single owner
        if (aTokenAmount >= aTokenBalance) {
            aavePool.withdraw(
                address(token),
                aTokenBalance,
                msg.sender
            );
        } else {
            aavePool.withdraw(
                address(token),
                aTokenAmount,
                msg.sender
            );
        }
        _updateCheckpointInterest();
        emit DepositorWithdraw(msg.sender, aTokenAmount);
    }

    /// @notice Withdraws salary to recipient address. Only callable by `recipient`.
    /// @param _amount The amount to withdraw.
    function recipientWithdraw(uint256 _amount) public {
        _stateTransition();
        require(msg.sender == recipient);
        require(_amount <= recipientReserve);
        require(_amount > 0, "amount to withdraw cannot be zero");
        aToken.approve(address(aavePool), _amount);
        require(recipientReserve >= _amount, "recipient reserve must be over amount");
        recipientReserve = recipientReserve.sub(_amount);
        aavePool.withdraw(
            address(token),
            _amount,
            recipient
        );
        _updateCheckpointInterest();
        emit RecipientWithdraw(_amount);
    }

    /// @notice Pauses the contract. Only callable by admin
    function pause() external {
        require(factory.hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only callable by admin");
        _pause();
    }

    /// @notice Unpauses the contract. Only callable by admin
    function unpause() external {
        require(factory.hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only callable by admin");
        _unpause();
    }

    /// @notice Calculates the principal plus interest earned by _address in aTokens.
    /// @param _address The address to query the balance for.
    /// @return Balance of the _address in aTokens.
    function totalBalanceOf(address _address) public view returns (uint256){
        uint256 balance = bToken.balanceOf(_address); uint256 atokenamount;
        if (principal > 0) {
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
    /// @dev currently contract transition without manualTransition with the assumption that there are enough deposits or withdraw for constant state changes.
    /// @dev manual transition could be called any time if enough interests are earned, or if it's time to move onto the next checkpoint.
    function manualTransition() public {
        _stateTransition();
        _updateCheckpointInterest();
    }

    /* @notice move the contract state forward */
    /* @dev manages interests allocation of the contract */
    /* @dev reset the contract to new month if the current block reaches the checkpoint */
    function _stateTransition() private {
        // @dev totalInterestEarned should always be >= to interestEarnedAtLastCheckpoint
        // @dev totalInterestEarned - interestEarnedAtLastCheckpoint will give us the interests we need to allocate
        uint256 totalInterestEarned = aToken.balanceOf(address(this)).sub(principal);
        if (block.timestamp < nextCheckpoint){
            if (!startedSurplus) {
                /* @dev Check if interest earned exceeds salary. If true, adds salary to recipient reserve and any surplus to depositor reserve. */
                require(totalInterestEarned >= interestEarnedAtLastCheckpoint, "totalInterestEarned must be over interestEarnedAtLastCheckpoint");
                if (totalInterestEarned.sub(interestEarnedAtLastCheckpoint) >= salary) {
                    recipientReserve = recipientReserve.add(salary);
                    depositorReserve = depositorReserve.add(totalInterestEarned.sub(interestEarnedAtLastCheckpoint).sub(salary));
                    startedSurplus = true;  /* @dev Set flag to true to direct interest to depositor reserver until next checkpoint */
                } else {
                    return;
                }
            } else {
                require(totalInterestEarned >= interestEarnedAtLastCheckpoint, "totalInterestEarned must be over interestEarnedAtLastCheckpoint");
                depositorReserve = depositorReserve.add(totalInterestEarned.sub(interestEarnedAtLastCheckpoint));
            }
        } else {
            if (!startedSurplus) {
                if (totalInterestEarned.sub(interestEarnedAtLastCheckpoint) >= salary) {
                    recipientReserve = recipientReserve.add(salary);
                    depositorReserve = depositorReserve.add(totalInterestEarned.sub(interestEarnedAtLastCheckpoint).sub(salary));
                }
                else {
                    recipientReserve = recipientReserve.add(totalInterestEarned.sub(interestEarnedAtLastCheckpoint));
                }
            } else {
                depositorReserve = depositorReserve.add(totalInterestEarned.sub(interestEarnedAtLastCheckpoint));
            }
            _reset();
        }
    }

    /* @notice reset the checkpoint of the contract to the new month*/
    function _reset() private {
        nextCheckpoint = block.timestamp + 30 days;  // @dev hardcoded 30 days for now
        startedSurplus = false;
    }

    // @notice update last seen interests to the contract state
    // @dev this helps us define unallocated interests and should be called on every transactions that affect aToken balance of the contract
    // @dev so that all unallocated interests is always positive
    function _updateCheckpointInterest() private {
        if(startedSurplus) {
            uint256 aBalance = aToken.balanceOf(address(this));
            require(aBalance >= principal, "aToken balance must be more than principal");
            interestEarnedAtLastCheckpoint = aBalance.sub(principal);
        } else {
            return;
        }
    }

}
