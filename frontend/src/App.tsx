import React from 'react';
import Router from 'Router';
import { Symfoni } from 'hardhat/SymfoniContext';

function App() {
  return (
    <div className="App">
      <Symfoni autoInit>
          <Router />
      </Symfoni>
    </div>
  );
}

export default App;
