import { providers } from 'ethers';

type Web3Provider = providers.Web3Provider;
type Network = providers.Network;

export const enableBrowserWallet = async (): Promise<Web3Provider> => {
  await window.ethereum.enable();
  const provider = new providers.Web3Provider(window.ethereum);
  return provider;
};

export const getAccountAddress = async (provider: Web3Provider): Promise<string> => {
  const accounts = await provider.listAccounts();
  return accounts[0];
};

export const getEthereumNetwork = async (provider: Web3Provider): Promise<Network> => {
  const network = await provider.getNetwork();
  return network;
};
