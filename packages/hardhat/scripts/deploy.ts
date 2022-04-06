// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const ParkingLotToken = await ethers.getContractFactory("ParkingLotToken");
  const parkingLotToken = await ParkingLotToken.deploy(1000000000);
  await parkingLotToken.deployed();

  const CarItem = await ethers.getContractFactory("CarItem");
  const carItem = await CarItem.deploy(parkingLotToken.address);
  await carItem.deployed();

  const ParkingLot = await ethers.getContractFactory("ParkingLot");
  const parkingLot = await ParkingLot.deploy(
    parkingLotToken.address,
    carItem.address
  );
  await parkingLot.deployed();

  console.log("ParkingLotToken deployed to:", parkingLotToken.address);
  console.log("CarItem deployed to:", carItem.address);
  console.log("ParkingLot deployed to:", parkingLot.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
