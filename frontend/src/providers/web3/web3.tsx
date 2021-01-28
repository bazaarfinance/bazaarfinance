import React, { ReactNode, useEffect, useState } from 'react';
import { providers } from 'ethers';
import { Web3Context } from './context';

import {
  enableBrowserWallet,
  getAccountAddress,
  getEthereumNetwork,
} from 'services/networkService';

type Provider = providers.Web3Provider;

const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [address, setAddress] = useState<string>('');
  const [network, setNetwork] = useState<string>('');

  const initializeEthereumConnection = async (): Promise<void> => {
    const provider = await enableBrowserWallet();
    const currentAddress = await getAccountAddress(provider);
    const currentNetwork = await getEthereumNetwork(provider);
    
    setProvider(provider)
    setNetwork(currentNetwork.name);
    setAddress(currentAddress);
  };

  useEffect(() => {
    initializeEthereumConnection();
  });

  return (
    <Web3Context.Provider value={{ address, network, provider }}>{children}</Web3Context.Provider>
  );
};

export default Web3Provider;
