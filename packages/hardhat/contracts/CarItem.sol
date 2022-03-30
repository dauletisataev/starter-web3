// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ParkingLotToken.sol";
import "./ParkingLot.sol";

contract CarItem is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    ParkingLotToken private _plt;

    constructor(ParkingLotToken plt) ERC721("CarItem", "CNFT") {
        _plt = plt;
    }

    function createCar(string memory imgUri) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, imgUri);

        _plt.transferFrom(msg.sender, address(this), 100);
        emit Created(newItemId);
        return newItemId;
    }

    function approveFor(address pl) public {
        setApprovalForAll(pl, true);
    }

    event Created(uint256 carId);
}
