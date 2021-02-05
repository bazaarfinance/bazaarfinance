import { Contract } from "@ethersproject/contracts";
import { abis } from "@project/contracts";

export function getProviderOrSigner(library, account="") {
    return account !== "" ? getSigner(library, account) : library
}

export function getVaultContract(address, library, account) {
    return new Contract(address, abis.vault, getProviderOrSigner(library, account));
}

export function getVaultFactoryContract(address, library, account) {
    return new Contract(address, abis.vaultFactory, getProviderOrSigner(library, account));
}

export function getERC20Contract(address, library, account) {
    return new Contract(address, abis.erc20, getProviderOrSigner(library, account));
}

// account is not optional
export function getSigner(library, account="") {
    return library.getSigner(account).connectUnchecked();
}

export async function getEvents(library, filter) {
    return library.getLogs(filter);
}

export async function getProjects(address, library, account) {
    const vaultFactory = getVaultFactoryContract(address, library, account)
    const filter = vaultFactory.filters.VaultCreated(null, null);
    filter.fromBlock = 0;
    filter.toBlock = "latest";
    return getEvents(library, filter);
}