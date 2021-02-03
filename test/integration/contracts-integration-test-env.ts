import { Contract, BigNumber } from "ethers";
import { HardhatPluginError } from "hardhat/plugins";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { toBaseUnit } from "./utils/numbers"



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
    DAI: { address: process.env.DAI_CONTRACT_ADDRESS, nameOrAbi: "ERC20UpgradeSafe" },
    ADAI: { address: process.env.ADAI_CONTRACT_ADDRESS, nameOrAbi: "ERC20UpgradeSafe" },
    AAVE_POOL: { address: process.env.AAVE_POOL_CONTRACT_ADDRESS, nameOrAbi: "ILendingPool" }
};


//
// Integration testing environment public interface below. It sets up 3 things:
// 
//   1. an `initialize()` function on to the HRE (HardhatRuntimeEnvironment)
//   2. a Contracts type with typed keys, eg: the keys of the contracts we are integrating with
//   3. initial test accounts are loaded with `process.env.INITIAL_DAI_AMOUNT` dai
//

export type Contracts = {
    [key in keyof typeof ContractDescriptorKeys]: Contract;
}

export function testEnvironment(hre: HardhatRuntimeEnvironment): void {
  let initialized = false;
  let contracts: Contracts;

  async function getContracts(): Promise<Contracts> {
    try {
        console.info(
            `bazaar-contracts-integration-test-env plugin: The following deployed contracts are being aysychronously fetched:`
        );

        const contractPromises = Object.keys(contractDescriptors).map(
            (contractDescriptorKey) => {
                console.info(
                  `bazaar-contracts-integration-test-env plugin:     ${contractDescriptorKey}: ${contractDescriptors[contractDescriptorKey].address}`
                );
                return hre.ethers.getContractAt(
                  contractDescriptors[contractDescriptorKey].nameOrAbi,
                  contractDescriptors[contractDescriptorKey].address
                );
        });

        const loadedContracts = await Promise.all(contractPromises);

        contracts = {
            DAI: loadedContracts[0],
            ADAI: loadedContracts[1],
            AAVE_POOL: loadedContracts[2],
        };
        
        return contracts;
    } catch (error: any) {
        console.error(`bazaar-contracts-integration-test-env", "Error getting contracts:\n  ${error}`);
        throw new HardhatPluginError("bazaar-contracts-integration-test-env", "Error getting contracts", error);
    }
  }

  async function addDaiToWallets(): Promise<void> {
    try {
        console.info(
            `bazaar-contracts-integration-test-env plugin: Test accounts are being loaded with Dai`
        );

        // impersonate/unlock a random user account containing dai
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [process.env.RICH_DAI_ACCOUNT_ADDRESS],
        });

        const unlockedRichDaiSigner = hre.ethers.provider.getSigner(process.env.RICH_DAI_ACCOUNT_ADDRESS);
        const daiFaucet = contracts.DAI.connect(unlockedRichDaiSigner);

        const accounts = await hre.ethers.getSigners();

        await Promise.all(
        accounts.map(
            async (account) =>
            await daiFaucet.transfer(
                account.address,
                toBaseUnit(process.env.INITIAL_DAI_AMOUNT)
            )
        ));

        // unimpersonate/lock a random user account containing dai
        await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [process.env.RICH_DAI_ACCOUNT_ADDRESS],
        });
    } catch (error: any) {
        console.error(`bazaar-contracts-integration-test-env", "Error adding dai to wallets:\n  ${error}`);
        throw new HardhatPluginError("bazaar-contracts-integration-test-env", "Error adding dai to wallets", error);
    }
  }

    async function simulateDAIInterests(to: string, amount: BigNumber): Promise<void> {
        try {
            // impersonate/unlock a random user account containing dai
            await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [process.env.RICH_ADAI_ACCOUNT_ADDRESS],
            });

            const unlockedRichADaiSigner = hre.ethers.provider.getSigner(
            process.env.RICH_ADAI_ACCOUNT_ADDRESS
            );
            const adaiFaucet = contracts.ADAI.connect(unlockedRichADaiSigner);

            await adaiFaucet.transfer(to, amount);

            // unimpersonate/lock a random user account containing dai
            await hre.network.provider.request({
            method: "hardhat_stopImpersonatingAccount",
            params: [process.env.RICH_DAI_ACCOUNT_ADDRESS],
            });
        } catch (error: any) {
            console.error(`bazaar-contracts-integration-test-env", "Error simulating dai interests:\n  ${error}`);
            throw new HardhatPluginError("bazaar-contracts-integration-test-env", "Error simulating dai interests", error);
        }
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
            console.error(`bazaar-contracts-integration-test-env", "Error initializing integration test environment:\n  ${error}`);
            throw new HardhatPluginError("bazaar-contracts-integration-test-env", "Error initializing integration test environment", error);
        }
    }

    // @ts-ignore
    hre.initializeEnvironment = initializeEnvironment;
    // @ts-ignore
    hre.simulateDAIInterests= simulateDAIInterests;
}
