import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { chain, defaultChains, Provider } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { providers } from "ethers";

const connectors = () => {
  return [
    new InjectedConnector({
      chains: [...defaultChains, chain.hardhat],
      options: { shimDisconnect: true },
    }),
  ];
};

ReactDOM.render(
  <React.StrictMode>
    <Provider
      autoConnect
      connectors={connectors}
      provider={({ chainId }) => {
        return chainId === chain.hardhat.id
          ? new providers.JsonRpcProvider("http://localhost:8545")
          : providers.getDefaultProvider();
      }}
    >
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
