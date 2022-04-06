import React, { useState, useEffect } from "react";
import {
  useContract,
  useAccount,
  useConnect,
  useContractRead,
  useSigner,
  useContractEvent,
} from "wagmi";
import {
  Card,
  Text,
  Button,
  Grid,
  Image,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import CarItemContract from "@parking-web3/hardhat/artifacts/contracts/CarItem.sol/CarItem.json";
import ParkingLotContract from "@parking-web3/hardhat/artifacts/contracts/ParkingLot.sol/ParkingLot.json";
import { showNotification } from "@mantine/notifications";

function CarList() {
  const [connected] = useConnect();
  const [{ data: signer }] = useSigner();

  const [{ data: accountData }] = useAccount({
    fetchEns: true,
  });

  const [{ data: carsCount }] = useContractRead(
    {
      addressOrName: "0xD84379CEae14AA33C123Af12424A37803F885889",
      contractInterface: CarItemContract.abi,
    },
    "balanceOf",
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

  const [carList, setCarList] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (carsCount && connected) {
      (async () => {
        setLoading(true);
        let cars: any[] = [];
        for (let i = 0; i < carsCount.toNumber(); i++) {
          const tokenId = await await carRegistry.tokenOfOwnerByIndex(
            accountData?.address,
            i
          );
          cars.push({
            img: await carRegistry.tokenURI(tokenId),
            id: tokenId,
          });
        }
        setCarList(cars);
        setLoading(false);
      })();
    }
  }, [carsCount]);

  const onParkCarClick = async (id: any) => {
    await carRegistry.approveFor(parkingRegistry.address);
    await parkingRegistry.park(id);
  };

  useContractEvent(
    {
      addressOrName: "0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5",
      contractInterface: ParkingLotContract.abi,
    },
    "Parked",
    (event) => {
      const [, ev] = event;
      showNotification({
        title: "Car parked",
        message: `Car #${ev.args.carId.toNumber()} is successfully parked`,
      });
    }
  );

  return (
    <Grid>
      <Grid.Col span={12}>
        <Title order={3}>Not Parked cars</Title>
      </Grid.Col>
      {carList.map((car) => (
        <Grid.Col span={4} key={car.id.toNumber()}>
          <Card
            shadow="sm"
            style={{ width: 340, margin: "auto", marginTop: 16 }}
          >
            <Card.Section>
              <Image src={car.img} height={160} alt="Norway" />
            </Card.Section>
            <Text>Car {`#${car.id.toNumber()}`}</Text>
            <Button onClick={() => onParkCarClick(car.id)}>Park</Button>
          </Card>
        </Grid.Col>
      ))}
      {<LoadingOverlay visible={loading} />}
    </Grid>
  );
}

export default CarList;
