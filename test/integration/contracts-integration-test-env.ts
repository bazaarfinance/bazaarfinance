
import { Contract, Signer } from "ethers";
import { HardhatPluginError, lazyObject } from "hardhat/plugins";
import { HardhatRuntimeEnvironment } from "hardhat/types";

enum ContractDescriptorKeys {
    DAI,
    ADAI
};

type ContractDescriptor = {
    [key in keyof typeof ContractDescriptorKeys]: {
        address: string;
        nameOrAbi: string | any[];
    };
}

const contractDescriptors: ContractDescriptor = {
    DAI: { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", nameOrAbi: "ERC20" },
    ADAI: { address: "0x028171bCA77440897B824Ca71D1c56caC55b68A3", nameOrAbi: "ERC20" }
};


//
// Integration testing environment public interface below. It adds two things:
// 
//   1. a `getContracts()` function on to the HRE (HardhatRuntimeEnvironment)
//   2. a Contracts type with typed keys, eg: the keys of the contracts we are integrating with
//

export type Contracts = {
    [key in keyof typeof ContractDescriptorKeys]: Contract;
}

export function testEnvironment(hre: HardhatRuntimeEnvironment): void {
    let contractsLoaded = false;
    let contracts: Contracts;

    async function getContracts(): Promise<Contracts> {
        try {
            if (contractsLoaded) {
                console.info(`bazaar-contracts-integration-test-env plugin: Using cached deployed contracts that were previously fetched`);
                return contracts;
            }

            console.info(`bazaar-contracts-integration-test-env plugin: The following deployed contracts are being aysychronously fetched:`);
            const contractPromises = Object.keys(contractDescriptors).map(contractDescriptorKey => {
                console.info(`bazaar-contracts-integration-test-env plugin:     ${contractDescriptorKey}: ${contractDescriptors[contractDescriptorKey].address}`);
                return hre.ethers.getContractAt(contractDescriptors[contractDescriptorKey].nameOrAbi, contractDescriptors[contractDescriptorKey].address);
            });

            const loadedContracts = await Promise.all(contractPromises);
            
            contracts = {
                DAI: loadedContracts[0],
                ADAI: loadedContracts[1]
            };

            contractsLoaded = true;
        
            return contracts;
        } catch (error: any) {
            throw new HardhatPluginError("bazaar-contracts-integration-test-env", "Error initializing contracts", error);
        }
    }

    // @ts-ignore
    hre.getContracts = getContracts;
};
