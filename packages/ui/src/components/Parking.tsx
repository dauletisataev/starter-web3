import React from "react";
import CreateCar from "./CreateCar";
import CarList from "./CarList";
import ParkedCarList from "./ParkedCarList";
import AccountCard from "./AccountCard";

function Parking() {
  return (
    <>
      <AccountCard />
      <ParkedCarList />
      <CarList />
      <CreateCar />
    </>
  );
}

export default Parking;
