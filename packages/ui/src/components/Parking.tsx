import React, { useEffect, useState } from "react";
import { useContract, useContractRead, useProvider } from "wagmi";
import ParkingLotToken from "@parking-web3/hardhat/artifacts/contracts/ParkingLotToken.sol/ParkingLotToken.json";

function Parking() {
  const provider = useProvider();
  const contract = useContract({
    addressOrName: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    contractInterface: ParkingLotToken.abi,
    signerOrProvider: provider,
  });

  const [totalSupply, setTotalSupply] = useState();

  useEffect(() => {
    (async () => {
      setTotalSupply(await contract.totalSupply());
    })();
  }, []);

  return <div>Parking lots totalSupply: {totalSupply}</div>;
}

export default Parking;
