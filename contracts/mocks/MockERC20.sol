//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

// import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {

    constructor(string memory name, string memory symbol) public ERC20(name, symbol) {
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
