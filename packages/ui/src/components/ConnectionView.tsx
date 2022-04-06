import React from "react";
import { useConnect } from "wagmi";
import { Card, Title, Button } from "@mantine/core";

function ConnectionView() {
  const [{ data: connectData, error }, connect] = useConnect();
  return (
    <Card shadow="sm" style={{ width: 340, margin: "auto" }}>
      <Title order={4}>Connect your MetaMask wallet</Title>
      {connectData.connectors.map((connector) => (
        <Button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect(connector)}
          style={{ margin: "auto" }}
        >
          {connector.name}
          {!connector.ready && " (unsupported)"}
        </Button>
      ))}

      {error && <div>{error?.message ?? "Failed to connect"}</div>}
    </Card>
  );
}

export default ConnectionView;
