import React from 'react';
import { Symfoni } from 'hardhat/SymfoniContext';
import { Greeter } from './components/Greeter';

function App() {
  return (
    <div className="App">
      <Symfoni autoInit>
        <Greeter></Greeter>
      </Symfoni>
    </div>
  );
}

export default App;
