//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";

contract MockERC20 is ERC20PresetMinterPauser {
<<<<<<< HEAD
    constructor(string memory name, string memory symbol) ERC20PresetMinterPauser(name, symbol) public {
=======
    constructor(string memory name, string memory symbol) public ERC20PresetMinterPauser(name, symbol) {
>>>>>>> 5dbc850... depend on Aave's packages instead of copy/pasta'ing them
    }

    function mint(address to, uint256 amount) override public {
        _mint(to, amount);
    }

    function burn(uint256 amount) override public {
        _burn(msg.sender, amount);
    }
}
