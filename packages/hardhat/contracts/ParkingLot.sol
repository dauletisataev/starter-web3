//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "./ParkingLotToken.sol";
import "./CarItem.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract ParkingLot is IERC721Receiver {
    struct ParkedCar {
        uint256 carId;
        uint256 parkedAt;
    }
    using SafeERC20 for IERC20;
    uint256 totalLots = 200;
    mapping(address => ParkedCar[]) public userCars;
    ParkingLotToken private plt;
    CarItem private carRegistry;

    IERC20 private _token;

    // eslint-disable-next-line
    constructor(ParkingLotToken _plt, CarItem _carItem) {
        plt = _plt;
        carRegistry = _carItem;
    }

    function park(uint256 carId) public {
        carRegistry.approve(address(this), carId);
        carRegistry.safeTransferFrom(msg.sender, address(this), carId);
        userCars[msg.sender].push(ParkedCar(carId, block.timestamp));
        totalLots -= 1;
        emit Parked(carId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function parkedCars(address user) public view returns (ParkedCar[] memory) {
        return userCars[user];
    }

    function retrieve(uint256 carId) public returns (uint256) {
        uint256 index;
        bool ownsThisCar = false;
        uint256 _fee = 100;
        for (uint256 i = 0; i < userCars[msg.sender].length; i++) {
            if (userCars[msg.sender][i].carId == carId) {
                index = i;
                ownsThisCar = true;
                break;
            }
        }
        require(ownsThisCar == true, "user doesn't have this car");

        uint256 fee = (block.timestamp - userCars[msg.sender][index].parkedAt) *
            _fee;

        require(
            plt.balanceOf(msg.sender) >= fee,
            "user doesn't have sufficient balance"
        );

        // remove
        userCars[msg.sender][index] = userCars[msg.sender][
            userCars[msg.sender].length - 1
        ];
        userCars[msg.sender].pop();

        carRegistry.safeTransferFrom(address(this), msg.sender, carId);
        IERC20(plt).safeTransferFrom(msg.sender, address(this), fee);
        totalLots += 1;
        emit Retrieved(fee);
        return fee;
    }

    function availableLots() public view returns (uint256) {
        return totalLots;
    }

    event Retrieved(uint256 fee);
    event Parked(uint256 carId);
}
