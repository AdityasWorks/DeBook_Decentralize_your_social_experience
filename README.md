# DeBook

DeBook is a decentralized book lending platform built on Solidity, JavaScript, and Ethers, utilizing technologies such as Hardhat for development and IPFS for metadata storage. It offers a seamless experience for users to borrow and lend books securely on the blockchain.

## Technology Stack & Tools

- **Solidity**: Writing smart contracts to manage book lending transactions.
- **JavaScript (React & Testing)**: Frontend development and testing.
- **Ethers**: Interacting with the blockchain for book transactions.
- **Hardhat**: Development framework for Ethereum smart contracts.
- **IPFS**: Storing metadata of books in a decentralized manner.
- **React Routers**: Navigational components for the frontend.

## Requirements For Initial Setup

- Install Node.js (Compatible with any version below 16.5.0).
- Install Hardhat.

## Setting Up

### 1. **Clone/Download the Repository**.

### 2. **Install Dependencies**:
```bash
cd debook
npm install
```

### 3. **Change Credentials in .env File**
- Rename the '.env.exaple' file to just '.env'
- Paste your credentials in the inverted commas('')

### 4. **Boot up Local Development Blockchain:**
```bash
cd debook
npx hardhat node
```
### 5. **Connect Development Blockchain Accounts to Metamask:**

- Copy private keys of the addresses and import them to Metamask.
- Connect Metamask to Hardhat blockchain with network 127.0.0.1:8545.
- If Hardhat is not listed in Metamask networks:
- Open Metamask in your browser.
- Click the fox icon.
- Click the top center dropdown button listing all available networks.
- Click "Add Network" and fill in the following details:
- Network Name: Hardhat
- New RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Click "Save".
### 6. **Run Deploy Script to Migrate Smart Contracts:**
```bash
npx hardhat run scripts/deploy.js --network localhost
```
### or
```bash
npx hardhat run scripts/deploy.js --network sepolia
```
### 7. **Run Tests:**
```bash
npx hardhat test
```
### 8. **Launch Frontend:**
```bash
npm run start
```
