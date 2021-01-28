import { createContext } from 'react';
import { providers } from 'ethers';

type Provider = providers.Web3Provider;

interface Web3ContextType {
  provider: Provider | null;
  address: string;
  network: string;
}
export const Web3Context = createContext<Web3ContextType>({
  network: '',
  provider: null,
  address: '',
});
