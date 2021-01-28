//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.12;

import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";

contract MockERC20 is ERC20PresetMinterPauser {
    constructor(string memory name, string memory symbol) ERC20PresetMinterPauser(name, symbol) public {
    }

    function mint(address to, uint256 amount) override public {
        _mint(to, amount);
    }

    function burn(uint256 amount) override public {
        _burn(msg.sender, amount);
    }
}
