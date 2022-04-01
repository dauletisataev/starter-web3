import React from "react";
import { useBalance, useConnect, useAccount } from "wagmi";

function ConnectionView() {
  const [{ data: connectData, error }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });
  const [{ data: balance }] = useBalance({
    addressOrName: accountData?.address,
  });

  console.log("connection data:", connectData);
  console.log("account balance: ", balance);

  return accountData ? (
    <div>
      <img src={accountData.ens?.avatar || undefined} alt="ENS Avatar" />
      <div>
        {accountData.ens?.name
          ? `${accountData.ens?.name} (${accountData.address})`
          : accountData.address}
      </div>
      <div>Connected to {accountData.connector?.name}</div>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  ) : (
    <div className="App">
      <div>
        {connectData.connectors.map((connector) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect(connector)}
          >
            {connector.name}
            {!connector.ready && " (unsupported)"}
          </button>
        ))}

        {error && <div>{error?.message ?? "Failed to connect"}</div>}
      </div>
    </div>
  );
}

export default ConnectionView;
