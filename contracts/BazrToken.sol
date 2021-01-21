//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.3;

import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";

contract BazrToken is ERC20PresetMinterPauser {
    constructor() ERC20PresetMinterPauser("Bazaar Token", "BAZR") {
    }
}
