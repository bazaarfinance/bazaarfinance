
import { Contract, Signer } from "ethers";
import { HardhatPluginError } from "hardhat/plugins";
import { HardhatRuntimeEnvironment } from "hardhat/types";


const initialDaiAmount = 1000;
const richDaiAccountAddress = '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE';
const richADaiAccountAddress = '0x62e41b1185023bcc14a465d350e1dde341557925';


enum ContractDescriptorKeys {
    DAI,
    ADAI,
    AAVE_POOL
};

type ContractDescriptor = {
    [key in keyof typeof ContractDescriptorKeys]: {
        address: string;
        nameOrAbi: string | any[];
    };
}

const contractDescriptors: ContractDescriptor = {
    DAI: { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", nameOrAbi: "ERC20" },
    ADAI: { address: "0x028171bCA77440897B824Ca71D1c56caC55b68A3", nameOrAbi: "ERC20" },
    AAVE_POOL: { address: "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9", nameOrAbi: "ILendingPool" }
};


//
// Integration testing environment public interface below. It sets up 3 things:
// 
//   1. an `initialize()` function on to the HRE (HardhatRuntimeEnvironment)
//   2. a Contracts type with typed keys, eg: the keys of the contracts we are integrating with
//   3. initial test accounts are loaded with `initialDaiAmount` dai
//

export type Contracts = {
    [key in keyof typeof ContractDescriptorKeys]: Contract;
}

export function testEnvironment(hre: HardhatRuntimeEnvironment): void {
    let initialized = false;
    let contracts: Contracts;

    async function getContracts(): Promise<Contracts> {
        console.info(`bazaar-contracts-integration-test-env plugin: The following deployed contracts are being aysychronously fetched:`);
        
        const contractPromises = Object.keys(contractDescriptors).map(contractDescriptorKey => {
            console.info(`bazaar-contracts-integration-test-env plugin:     ${contractDescriptorKey}: ${contractDescriptors[contractDescriptorKey].address}`);
            return hre.ethers.getContractAt(contractDescriptors[contractDescriptorKey].nameOrAbi, contractDescriptors[contractDescriptorKey].address);
        });

        const loadedContracts = await Promise.all(contractPromises);
        
        contracts = {
            DAI: loadedContracts[0],
            ADAI: loadedContracts[1],
            AAVE_POOL: loadedContracts[2]
        };
    
        return contracts;
    }

    async function addDaiToWallets(): Promise<void> {
        console.info(`bazaar-contracts-integration-test-env plugin: Test accounts are being loaded with Dai`);

        // impersonate/unlock a random user account containing dai
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [richDaiAccountAddress]
        });

        const unlockedRichDaiSigner = hre.ethers.provider.getSigner(richDaiAccountAddress);
        const daiFaucet = contracts.DAI.connect(unlockedRichDaiSigner);

        const accounts = await hre.ethers.getSigners();

        await Promise.all(accounts.map(async account => await daiFaucet.transfer(account.address, initialDaiAmount)));

        // unimpersonate/lock a random user account containing dai
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [richDaiAccountAddress]
        });
    }

  async function addADaiToWallet(to: string, amount: string): Promise<void> {
    // impersonate/unlock a random user account containing dai
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [richADaiAccountAddress]
    });

    const unlockedRichADaiSigner = hre.ethers.provider.getSigner(richADaiAccountAddress);
    const adaiFaucet = contracts.ADAI.connect(unlockedRichADaiSigner);

    await adaiFaucet.transfer(to, amount);

    // unimpersonate/lock a random user account containing dai
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [richDaiAccountAddress]
    });
  }

    async function initializeEnvironment(): Promise<Contracts> {
        try {
            if (initialized) {
                return contracts;
            }
            
            contracts = await getContracts();
            await addDaiToWallets();
    
            initialized = true;

            return contracts;
        } catch (error: any) {
            throw new HardhatPluginError("bazaar-contracts-integration-test-env", "Error initializing integration test environment", error);
        }
    }

    // @ts-ignore
    hre.initializeEnvironment = initializeEnvironment;
    // @ts-ignore
    hre.addADaiToWallet = addADaiToWallet;
};
