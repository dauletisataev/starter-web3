import React from "react";
import "./App.css";
import ConnectionView from "./components/ConnectionView";
import Parking from "./components/Parking";
import { useConnect, useAccount } from "wagmi";

function App() {
  const [{ data: accountData }] = useAccount({
    fetchEns: true,
  });

  return accountData ? <Parking /> : <ConnectionView />;
}

export default App;
