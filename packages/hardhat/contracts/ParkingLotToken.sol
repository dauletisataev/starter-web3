//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract ParkingLotToken is ERC20 {
    using SafeERC20 for ERC20;

    constructor(uint256 initialSupply) ERC20("ParkingLotToken", "PLT") {
        _mint(msg.sender, initialSupply);
    }
}
