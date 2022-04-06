import React, { useState, useEffect } from "react";
import { useConnect, useContract, useProvider, useAccount } from "wagmi";
import ParkingLotToken from "@parking-web3/hardhat/artifacts/contracts/ParkingLotToken.sol/ParkingLotToken.json";
import { Card, Text, Avatar, Title, Grid, Button } from "@mantine/core";

function AccountCard() {
  const provider = useProvider();
  const [connected] = useConnect();

  const pltContract = useContract({
    addressOrName: "0xBEc49fA140aCaA83533fB00A2BB19bDdd0290f25",
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
        const sup = await pltContract.balanceOf(accountData?.address);
        setBalance(sup.toString());
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return (
    <Card shadow="sm" p="lg" style={{ width: 340, margin: "auto" }}>
      <Grid>
        <Grid.Col span={2}>
          <Avatar src={accountData?.ens?.avatar || undefined} />
        </Grid.Col>
        <Grid.Col span={10}>
          <Text size="sm">
            {accountData?.ens?.name
              ? `${accountData.ens?.name} (${accountData.address})`
              : accountData?.address}
          </Text>
          <Title order={3}>{balance}</Title>
          <Button onClick={disconnect}>disconnect</Button>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default AccountCard;
