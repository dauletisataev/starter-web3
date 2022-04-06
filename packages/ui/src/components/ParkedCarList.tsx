import React, { useState, useEffect } from "react";
import {
  useContract,
  useAccount,
  useContractRead,
  useSigner,
  useContractEvent,
} from "wagmi";
import { Card, Text, Button, Grid, Image, Title } from "@mantine/core";
import CarItemContract from "@parking-web3/hardhat/artifacts/contracts/CarItem.sol/CarItem.json";
import ParkingLotContract from "@parking-web3/hardhat/artifacts/contracts/ParkingLot.sol/ParkingLot.json";
import ParkingLotToken from "@parking-web3/hardhat/artifacts/contracts/ParkingLotToken.sol/ParkingLotToken.json";
import moment from "moment";
import { showNotification } from "@mantine/notifications";

function ParkedCarList() {
  const [{ data: signer }] = useSigner();

  const [{ data: accountData }] = useAccount({
    fetchEns: true,
  });

  const [{ data: parkedCars }] = useContractRead(
    {
      addressOrName: "0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5",
      contractInterface: ParkingLotContract.abi,
    },
    "parkedCars",
    {
      args: accountData?.address,
      watch: true,
    }
  );

  const carRegistry = useContract({
    addressOrName: "0xD84379CEae14AA33C123Af12424A37803F885889",
    contractInterface: CarItemContract.abi,
    signerOrProvider: signer,
  });

  const parkingRegistry = useContract({
    addressOrName: "0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5",
    contractInterface: ParkingLotContract.abi,
    signerOrProvider: signer,
  });

  const pltContract = useContract({
    addressOrName: "0xBEc49fA140aCaA83533fB00A2BB19bDdd0290f25",
    contractInterface: ParkingLotToken.abi,
    signerOrProvider: signer,
  });

  const [parkedCarList, setParkedCarList] = useState<any[]>([]);

  useEffect(() => {
    if (parkedCars)
      (async () => {
        let pCars: any[] = [];
        for (let i = 0; i < parkedCars.length; i++) {
          const car: any = parkedCars[i];
          const img = await carRegistry.tokenURI(car.carId);
          pCars.push({
            id: car.carId,
            parkedAt: car.parkedAt,
            img,
          });
        }
        setParkedCarList(pCars);
      })();
  }, [parkedCars]);

  const onRetrieveCarClick = async (id: any) => {
    await pltContract.approve(parkingRegistry.address, 10000000);
    await parkingRegistry.retrieve(id);
  };

  useContractEvent(
    {
      addressOrName: "0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5",
      contractInterface: ParkingLotContract.abi,
    },
    "Retrieved",
    (event) => {
      const [, ev] = event;
      showNotification({
        title: "Car retrieved",
        message: `Fee for parking is ${ev.args.fee.toNumber()}`,
      });
    }
  );

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={3}>Parked cars</Title>
      </Grid.Col>
      {parkedCarList.map((car) => (
        <Grid.Col span={4} key={car.id.toNumber()}>
          <Card
            shadow="sm"
            style={{ width: 340, margin: "auto", marginTop: 16 }}
          >
            <Card.Section>
              <Image src={car.img} height={160} alt="Norway" />
            </Card.Section>
            <Text>Car {`#${car.id.toNumber()}`}</Text>
            <Text>
              Parked at:{" "}
              {moment(car.parkedAt.toNumber() * 1000).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
            </Text>
            <Button onClick={() => onRetrieveCarClick(car.id)}>Retrieve</Button>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
}

export default ParkedCarList;
