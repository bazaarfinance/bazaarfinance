# Bazaar Finance

Bazaar Finance allows developers to capture value for their work in open-source software though decentralized finance (DeFi) protocols. Thanks to lending protocols, users around the globe now have a new avenue to fund the open-source tools they find valuable. Not by dipping into their wallets, but via interest earned on their savings. Instead of having to actively give lump sums or set up recurring monthly donations, people can allocate a portion of interest they earn, passively and transparently, with the ability to withdraw their principle at any time.

**Depositors** pool their contributions towards an OSS project, and the interest earned on the total of deposits gets allocated to the developer that maintains it. This interest is withdrawable by the developer (the **recipient**) at any time. Any additional interest that is surplus to the recipient's stated desired **salary** gets reallocated to depositors.

### 📖 How it Works (above the hood)
1. An open-source project is added to Bazaar Finance. The `recipient` can decide on the `token` they want to be paid in, and the goal amount they wish to be paid each month (`salary`).
2. Individuals who wish to fund the project can `deposit` a specified amount of the project's chosen `token`, e.g. DAI
3. The depositor gets minted the project's `bToken`, redeemable for underlying funds when they `withdraw` their principal (and any additional interest) from the `Vault`
4. Interest on deposits accrues to the project's `Vault`. Every 30 days, the accrued interest gets allocated to be `recipient`, available to be withdrawn.
5. If the interest accrued from the sum of deposited funds exceeds the recipient's desired monthly `salary` for that month, additional interest earned for the remainder of that month gets allocated to depositors.
6. Recipients can `withdraw` a specified `amount` at any time.
7. Depositors can `withdraw` their principal (and any additional interest) at any time.

Example scenario:
- Alice is working on a popular open-source tool, she hopes to earn 1000 DAI/month for maintaining this project. She creates a project on Bazaar Finance
- Bob is an avid user of Alice's tool and wants to help fund its maintenance. He deposits 100 DAI to Alice's project
- Bob receives 100 bTokens* for his deposit
- More users and supporters of Alice's tool deposit their funds, inflating the supply of Alice's project's bToken
- If the interest accrued from the sum of deposited funds exceeds Alice's goal of 1000 DAI, additional interest gets allocated to Bob and other depositors
- Alice can withdraw a specified `amount` of her funds, earned through interest accrual of deposited funds, at any time.
- Bob can withdraw his principle of 100 DAI at any time. If Alice's salary goal has been reached, he will also receive his share of the interest that has been reallocated to depositors. This process burns Bob's balance of bTokens.

\* The 1-1 exchange rate only applies to the initial deposit into the `Vault`. The exchange rate for a project's bToken is dynamic depending on how much has already been deposited into its `Vault`, which is why each project necessarily has its own `bToken` in addition to its own `Vault`. See the [bTokenExchangeRate](#bToken-Exchange-Rate) section for more info.

## 🛠 Technology
- This project was built on Ethereum using [Hardhat](https://hardhat.org/) and [Symfoni](https://github.com/symfoni/hardhat-react-boilerplate)
- Deposited funds accrue interest through the [AAVE Liquidity Protocol](https://aave.com/)
- bTokens deployed for each recipient project adhere to the [ERC20 Token Standard](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.3.0/contracts/token/ERC20/IERC20.sol)

### 📖 How it Works (under the hood)
1. An open-source project is added to Bazaar Finance through the deployment of a new `Vault` and its associated `bToken` contract. For the MVP, this is done by calling `createVault` and `createBToken` in the `VaultFactory` contract. 
  - The project's `bToken` is deployed first, and then its `Vault` is deployed with the following parameters
    - `recipient` address
    - `salary` desired amount the recipient wants to earn each month for working on the project
    - `token` address of the ERC20 the recipient wishes to be paid in (e.g. DAI)
    - `aToken` address the interest-accruing version of the `token`, issued through Aave
    - `bToken` address of the project's bToken, created through `createBToken`
2. Individuals who wish to contribute the interest on their savings to fund the project can `deposit` a specified `amount` of the projects `token` into its `Vault`.
3. The deposit gets automatically swapped to the interest-accruing equivalent on Aave, and is stored in the `Vault`.
4. The depositor gets minted the project's `bToken`, redeemable for underlying funds when they `withdraw` their principal (and any additional interest) from the `Vault`
5. Interest on deposits accrues to the project's `Vault`. Every 30 days, the accrued interest gets allocated to be `recipient`, available to be withdrawn.
6. If the interest accrued from the sum of deposited funds exceeds the recipient's desired monthly `salary` for that month, additional interest earned for the remainder of that month gets allocated to depositors.
7. Recipients can `withdraw` a specified `amount` at any time.
8. Depositors can `withdraw` their principal (and any additional interest) at any time.

Note: The `Vault` has sole access to `mint` and `burn` on its associated `bToken`, as these functions need only be called during `deposit` and `withdraw`

### bToken Exchange Rate

The 1-1 exchange rate only applies to the initial deposit because any subsequent deposits has to take into account (1) the interest already accrued and (2) whether salary goals have been met. Each bToken is convertible into a dynamic quantity of the underlying asset, as depositors deposit and withdraw from the project's `Vault`.

The exchange rate between a bToken and the underlying asset is calculated as follows:

`exchangeRate = principal + surplusInterest / bTokenTotalSupply`

## 👩🏻‍💻 Development

### Prerequisites
- Node v10.21.0
- Solidity v0.6.12 (solc-js)

### Setup
- Clone the repo using `git clone https://github.com/bazaarfinance/bazaarfinance.git && cd bazaarfinance`
- Install deps with yarn `yarn` or npm `npm install`
- To start the client locally, start hardhat `npx hardhat node --watch`
- From a new terminal window and install dependencies `cd frontend && yarn install` or `cd frontend && npm install`
- Import seed phrase in Metamask. The default mnemonic currently used by hardhat is `test test test test test test test test test test test junk`
- Ensure Metamask RPC is set to `http://localhost:8545` and chainID `31337`.
- Run `yarn start` or npm `npm start` and a new browser window should open up at http://localhost:3000/

## ✅ Testing
- Run unit tests `npx hardhat test`
- Run integration tests `npx hardhat --config hardhat.integration-test-config.ts test ./test/integration/*.ts` from the main directory

Since the tests fork mainnet for interaction with AAVE, you'll need to interact with a node service such as [Alchemy](http://alchemyapi.io/), which requires an API Key, for tests to work. See `.env-sample` for instructions on setting up a local `.env` file that stores the mainnet `FORKING_URL`

If you encounter this error:

```bash
eth_sendRawTransaction
  Invalid nonce. Expected X but got X.
```

Reset your account in Metamask.

## 🚀 Future Goals & TODOs
- Host immutable footballer data for a given season on IPFS
- Add ENS capability to resolve human-readable names to Ethereum addresses
- Implement upgradable design or autodeprecation
- Add league admin features to the client web app

## ✍🏼 Authors
Made with ❤️ and ☕️ at [MarketMake hackathon](https://mm.ethglobal.co/) by:
- Jacob Hite (@jrhite)
- Nichanan Kesonpat (@nichanank)
- Omar Kalouti (@kalouo)
- Pong Cheecharern (@Pongch)