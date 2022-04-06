import React, { useState, useEffect } from "react";
import { useSigner, useContract, useAccount, useProvider } from "wagmi";
import { Card, TextInput, Button, Title } from "@mantine/core";
import CarItemContract from "@parking-web3/hardhat/artifacts/contracts/CarItem.sol/CarItem.json";
import ParkingLotToken from "@parking-web3/hardhat/artifacts/contracts/ParkingLotToken.sol/ParkingLotToken.json";

function CreateCar() {
  const [{ data: signer }] = useSigner();
  const provider = useProvider();
  const [{ data: accountData }] = useAccount({
    fetchEns: true,
  });
  const carRegistry = useContract({
    addressOrName: "0xD84379CEae14AA33C123Af12424A37803F885889",
    contractInterface: CarItemContract.abi,
    signerOrProvider: signer,
  });
  const pltContract = useContract({
    addressOrName: "0xBEc49fA140aCaA83533fB00A2BB19bDdd0290f25",
    contractInterface: ParkingLotToken.abi,
    signerOrProvider: signer,
  });
  const [url, setUrl] = useState("");

  const onCreateClick = async () => {
    await pltContract.approve(
      "0xD84379CEae14AA33C123Af12424A37803F885889",
      100000000
    );
    await pltContract.transfer(accountData?.address, 1000000);
    await carRegistry.createCar(url);
  };

  return (
    <Card shadow="sm" style={{ width: 340, margin: "auto", marginTop: 16 }}>
      <Title order={3}>Create new car</Title>
      <TextInput
        required
        label="Image url"
        value={url}
        onChange={(event) => setUrl(event.currentTarget.value)}
      />
      <Button onClick={onCreateClick}>Create</Button>
    </Card>
  );
}

export default CreateCar;
