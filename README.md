# Reservation NFT
## Overview
Reservation NFT is a decentralized application (dApp) that allows users to create, manage, and reserve time slots at various restaurants using non-fungible tokens (NFTs). The dApp is built using Next.js, Solidity, The Graph Protocol, and Foundry.

# Key Features
Create and manage restaurants with customizable time slots and reservation windows.
Mint NFTs representing reservations for specific time slots at a restaurant.
View and manage your reservations in a user-friendly interface.
Query and display reservation data efficiently using The Graph Protocol.
Technologies Used
Next.js
Next.js is a React-based framework for building server-rendered and static web applications. It provides features such as server-side rendering (SSR), static site generation (SSG), and API routes. In this dApp, Next.js is used to create the front-end user interface and handle client-side interactions.

# Solidity
Solidity is a statically-typed programming language used for writing smart contracts on the Ethereum blockchain. The dApp includes Solidity smart contracts that define the logic for creating restaurants, managing reservation windows, and minting reservation NFTs. These smart contracts are deployed to the Ethereum network and interacted with using Web3.js.

# The Graph Protocol
The Graph Protocol is a decentralized protocol for indexing and querying data from blockchains. It allows developers to define GraphQL schemas (subgraphs) to extract and organize data from smart contracts. In this dApp, The Graph is used to index reservation data from the Ethereum blockchain, making it easily accessible and queryable for the front-end.

# Foundry
Foundry is a development framework for building, testing, and deploying smart contracts on Ethereum. It provides a set of tools and utilities for smart contract development, including a local development blockchain, automated testing, and deployment scripts. In this dApp, Foundry is used to streamline the development process for the Solidity smart contracts.

# Getting Started
## Prerequisites
Node.js and yarn installed on your system.
An Ethereum wallet (e.g., MetaMask) set up and funded with testnet ETH (Polygon Mumbai)
## Installation
### Clone the repository:
git clone https://github.com/kevinsheth/duke-blockchain564-reservation.git

### Change to the project directory:
cd backend

### Install the dependencies:
yarn

### Compile the Solidity smart contracts:
make build

### Deploy the smart contracts to a local development blockchain:

make deploy-anvil
### Start the Next.js development server:
yarn run dev

Open your browser and navigate to http://localhost:3000 to access the dApp.