import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider, defaultChains } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const chains = defaultChains;

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
  ]
}

ReactDOM.render(
  <React.StrictMode>
    <Provider autoConnect connectors={connectors}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
