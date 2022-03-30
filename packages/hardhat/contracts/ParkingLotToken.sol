//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ParkingLotToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("ParkingLotToken", "PLT") {
        _mint(msg.sender, initialSupply);
    }
}
