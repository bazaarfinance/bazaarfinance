//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";
import "./interface/IBazrToken.sol";

contract BazrToken is IBazrToken, Initializable, ERC20UpgradeSafe {

    address vaultContract;
    
    function initialize(string memory name, string memory symbol) public initializer {
        ERC20UpgradeSafe.__ERC20_init(name, symbol);
    }

    function mint(address to, uint256 amount) public override {
        // should only be callable by VaultContract
        require(msg.sender == vaultContract, "Only callable by associated VaultContract");
        _mint(to, amount);
    }

    function burn(address account, uint256 amount) public override {
        // should only be callable by VaultContract
        require(msg.sender == vaultContract, "Only callable by associated VaultContract");
        _burn(account, amount);
    }
}
