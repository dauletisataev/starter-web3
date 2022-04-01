import { expect } from "chai";
import { ethers } from "hardhat";

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });
let ParkingLotToken: any;
let parkingLotToken: any;
let carItem: any;
let owner: any;
let addr1: any;
let car1Id: any;
let car2Id: any;

beforeEach(async function () {
  ParkingLotToken = await ethers.getContractFactory("ParkingLotToken");
  [owner, addr1] = await ethers.getSigners();
  parkingLotToken = await ParkingLotToken.deploy(1000000000);
});

describe("PLT", function () {
  it("Should deployed successfully with balance of 1000000000", async function () {
    await parkingLotToken.deployed();
    const initialBalance = await parkingLotToken.balanceOf(owner.address);
    expect(initialBalance.value, "1000000000");
  });

  it("Should successfully send 1000000 to other account", async function () {
    await parkingLotToken.transfer(addr1.address, 1000000);
    const addr1Balance = await parkingLotToken.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(1000000);
  });

  it("Should successfully create cars", async function () {
    await parkingLotToken.transfer(addr1.address, 1000000);
    const CarItem = await ethers.getContractFactory("CarItem");
    carItem = await CarItem.deploy(parkingLotToken.address);
    await parkingLotToken.approve(carItem.address, 100000000);
    await parkingLotToken.connect(addr1).approve(carItem.address, 100000000);
    const car1Tx = await carItem.createCar(
      "https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&fit=crop"
    );
    const car2Tx = await carItem
      .connect(addr1)
      .createCar(
        "https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&fit=crop"
      );
    await expect(car1Tx).to.emit(carItem, "Created");
    await expect(car2Tx).to.emit(carItem, "Created");

    // get car1Id
    let rc = await car1Tx.wait();
    let createdEvent = rc.events.find((event: any) => {
      return event.event === "Created";
    });
    car1Id = createdEvent.args.carId;

    // get car1Id
    rc = await car2Tx.wait();
    createdEvent = rc.events.find((event: any) => {
      return event.event === "Created";
    });
    car2Id = createdEvent.args.carId;
  });

  it("Should successfully park cars and retrieve", async function () {
    await parkingLotToken.transfer(addr1.address, 1000000);

    const ParkingLot = await ethers.getContractFactory("ParkingLot");
    const parkingLot = await ParkingLot.deploy(
      parkingLotToken.address,
      carItem.address
    );

    carItem.approveFor(parkingLot.address);
    carItem.connect(addr1).approveFor(parkingLot.address);

    expect(await parkingLot.park(car1Id))
      .to.emit(parkingLot, "Parked")
      .withArgs(owner.address, car1Id);
    expect(await parkingLot.connect(addr1).park(car2Id))
      .to.emit(parkingLot, "Parked")
      .withArgs(addr1.address, car2Id);
    expect(await parkingLot.availableLots()).to.equal(198);
    expect((await parkingLot.parkedCars(owner.address)).length).to.equal(1);

    await parkingLotToken.approve(parkingLot.address, 100000);

    expect(await parkingLot.retrieve(car1Id))
      .to.emit(parkingLot, "Retrieved")
      .withArgs(owner.address, 200);
    expect(await parkingLot.retrieve(car2Id))
      .to.emit(parkingLot, "Retrieved")
      .withArgs(owner.address, 200);

    expect(await parkingLot.availableLots()).to.equal(200);
    expect((await parkingLot.parkedCars(owner.address)).length).to.equal(0);
  });
});
