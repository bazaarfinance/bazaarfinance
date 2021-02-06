import React from "react";
import ReactDOM from "react-dom";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import ThemeProvider from './theme'
import "./index.css";
import App from "./pages/App";

const Web3ProviderNetwork = createWeb3ReactRoot('NETWORK')

function getLibrary(provider) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 10000
  return library
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
    <ThemeProvider>
        <App />
      </ThemeProvider>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById("root"),
);
