//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/ERC20.sol";

import "hardhat/console.sol";

contract BazrToken is Initializable, ERC20UpgradeSafe {

    address public vault;
    address public factory;

    function initialize(string memory name, string memory symbol) public initializer {
        console.log("** BazrToken.initialize: msg.sender", msg.sender);

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

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        require(msg.sender == vault, "Only allow vault to call transferFrom");
        super.transferFrom(sender, recipient, amount);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        require(msg.sender == vault, "Only allow vault to call transfer");
        super.transfer(recipient, amount);
    }
}
