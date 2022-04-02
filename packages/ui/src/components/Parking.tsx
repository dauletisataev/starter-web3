import React, { useEffect, useState } from "react";
import { useConnect, useContract, useProvider, useAccount } from "wagmi";
import ParkingLotToken from "@parking-web3/hardhat/artifacts/contracts/ParkingLotToken.sol/ParkingLotToken.json";

function Parking() {
  const provider = useProvider();
  const [connected] = useConnect();
  const contract = useContract({
    addressOrName: "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
    contractInterface: ParkingLotToken.abi,
    signerOrProvider: provider,
  });
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  const [balance, setBalance] = useState();

  useEffect(() => {
    (async () => {
      if (connected) {
        const sup = await contract.balanceOf(accountData?.address);
        setBalance(sup.toString());
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return <div>Current account balance: {balance}</div>;
}

export default Parking;
