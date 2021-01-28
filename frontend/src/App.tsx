import React from 'react';
import Router from 'Router';
import { Web3Provider } from 'providers/web3';

function App() {
  return (
    <div className="App">
      <Web3Provider>
        <Router />
      </Web3Provider>
    </div>
  );
}

export default App;
