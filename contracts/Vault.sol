// SPDX-License-Identifier: MIT
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./ILendingPool.sol";
import "./IMINTERC20.sol";


contract Vault {
    // address of the recipient
    address payable public recipient;

    // external smart contracts
    ILendingPool public aavePool;
    IERC20 public token;
    IERC20 public aToken;
    IMINTERC20 public bToken;  // btokens should be mintable

    uint256 public salary;
    uint256 public nextCheckpoint;
    uint256 public lastCheckpointInterest;  // last time the interest earned was measured

    bool public startedSurplus;

    uint256 public principal;
    uint256 public depositorReserve;
    uint256 public recipientReserve;
    mapping(address=>uint256) public AddressToPrincipal;  // keep track of the principal of every depositors to calculate withdraws

   constructor(address payable _recipient, address _token, address _aavePool, uint _salary, address _bToken, address _aToken) public {
       recipient = _recipient;
       salary = _salary;

       token = IERC20(_token);
       bToken = IMINTERC20(_bToken);
       aToken = IERC20(_aToken);
       aavePool = ILendingPool(_aavePool);

       nextCheckpoint = block.timestamp + 30 days;  // hardcoded 30 days for now
       lastCheckpointInterest = 0;

       depositorReserve = 0;
       recipientReserve = 0;
       principal = 0;
       startedSurplus = false;
   }

    // deposit tokens into aave pool and mint equivalent in bTokens
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

        uint256 bTokensToMint = tokenToBtoken(
            principal,
            depositorReserve,
            bToken.totalSupply(),
            _amount
        );
        bToken.mint(msg.sender, bTokensToMint);
        AddressToPrincipal[msg.sender] += _amount;  // we keep track of user's principal, not that with this design- we can't allow user to transfer bToken to each other
        updateCheckpointInterest();
    }

    // withdraw out the user's entire balance
    function withdraw() public {
        stateTransition();
        // decrement user's principal, principal and depositorReserve;
        uint256 balance = bToken.balanceOf(msg.sender);
        bToken.transferFrom(msg.sender, address(this), balance);
        uint256 atokenamount = btokenToToken(
            principal,
            depositorReserve,
            bToken.totalSupply(),
            balance
        );
        depositorReserve -= (atokenamount - AddressToPrincipal[msg.sender]); // subtract principal from user's atokens to get the interests earned
        principal -= AddressToPrincipal[msg.sender];
        AddressToPrincipal[msg.sender] = 0;
        // withdraw atokens
        bToken.burn(balance);
        aavePool.withdraw(
            address(token),
            atokenamount,
            msg.sender
        );
        updateCheckpointInterest();
    }

    function recipientWithdraw(uint256 _amount) public {
        stateTransition();
        require(msg.sender == recipient);
        require(_amount <= recipientReserve);
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
                }
                if (totalInterestEarned - lastCheckpointInterest < salary ) { 
                    return;  // we do nothing until the unallocated interest is more than salary
                }
            } else {
                depositorReserve += totalInterestEarned;
            }
        }

        if (block.timestamp >= nextCheckpoint){
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

    // update last seen interests to the contract state
    // this helps us define unallocated interests and should be called on every transactions that affect aToken balance of the contract
    // so that all unallocated interests is always positive
    function updateCheckpointInterest() private {
        uint256 totalInterestEarned = aToken.balanceOf(address(this)) - principal; 
        lastCheckpointInterest = totalInterestEarned;
    }

    function btokenToToken(uint256 _principal,
                           uint256 _surplus,
                           uint256 _tokenSupply,
                           uint256 btokens
                           ) pure public returns (uint256){
        return SafeMath.div(SafeMath.mul(btokens, SafeMath.add(_surplus, _principal)), _tokenSupply);
    }

    // calculates btokens amount from tokens
    function tokenToBtoken(uint256 _principal,
                           uint256 _surplus,
                           uint256 _tokenSupply,
                           uint256 _token
                           ) pure public returns (uint256){
        return SafeMath.div(SafeMath.mul(_token, (_tokenSupply)), SafeMath.add(_surplus, _principal));
    }
}