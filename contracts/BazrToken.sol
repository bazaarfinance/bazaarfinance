//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";

contract BazrToken is Initializable, ERC20UpgradeSafe {

    address public vault;
    address public factory;
    
    function initialize(string memory name, string memory symbol) public initializer {
        ERC20UpgradeSafe.__ERC20_init(name, symbol);
        factory = msg.sender;
    }

    function mint(address to, uint256 amount) public {
        // should only be callable by VaultContract
        require(msg.sender == vault, "Only callable by associated Vault");
        _mint(to, amount);
    }

    function burn(address account, uint256 amount) public {
        // should only be callable by VaultContract
        require(msg.sender == vault, "Only callable by associated Vault");
        _burn(account, amount);
    }

    function setVaultAddress(address _vault) external {
        require(msg.sender == factory, "Only callable by Factory");
        vault = _vault;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal override {
        require(sender == vault || recipient == vault, "Only allow to transfer to or from Vault");
        super._transfer(sender, recipient, amount);
    }
}
