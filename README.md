# Ethereum Staking Application

## 🚀 Overview
The **Ethereum Staking Application** is a Web3-powered decentralized application (dApp) that allows users to stake and unstake Ethereum securely. It features an intuitive and interactive frontend with a fully functional dashboard, app bar, and real-time staking updates.

## ✨ Features
- **Stake ETH:** Users can stake their Ethereum into the smart contract.
- **Unstake ETH:** Withdraw staked Ethereum whenever needed.
- **Dashboard UI:** A modern and responsive dashboard showing staking status, rewards, and account balance.
- **Web3 Integration:** Connect with MetaMask or other Ethereum wallets.
- **Smart Contract Interaction:** Secure interaction with Ethereum smart contracts for staking and unstaking.
- **Live Updates:** Real-time updates on staking rewards and transaction status.

## 🏗 Tech Stack
- **Frontend:** React.js, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Blockchain:** Solidity, Hardhat, Ethereum Smart Contracts
- **Web3 Integration:** ethers.js, Web3.js
- **Database:** MongoDB (optional for user history storage)

## 🛠 Installation & Setup
### Prerequisites
Ensure you have the following installed:
- Node.js (>= 16.x)
- npm or yarn
- MetaMask (or any Web3 wallet)

### Clone the Repository
```sh
git clone https://github.com/Gruuttttt/Ethereum-Staking-App.git
cd Ethereum-Staking-App
```

### Install Dependencies
```sh
npm install  # or yarn install
```

### Run the Frontend
```sh
npm run dev  # or yarn dev
```

### Run the Backend
```sh
cd backend
npm install
npm start
```

### Deploy Smart Contract
1. Configure Hardhat
2. Run contract deployment script:
```sh
npx hardhat run scripts/deploy.js --network goerli
```
3. Update frontend with deployed contract address.

## 🔗 Smart Contract Details
- **Network:** Ethereum (Mainnet/Testnet)
- **Functions:**
  - `stake(uint256 amount)`: Stakes ETH into the contract.
  - `unstake(uint256 amount)`: Withdraws ETH from the contract.
  - `getRewards(address user)`: Returns staking rewards.

## 🎨 UI Design
- **App Bar:** Shows wallet connection status and navigation.
- **Dashboard:** Displays total staked ETH, rewards, and staking history.
- **Transaction Modals:** Interactive popups for staking/unstaking confirmations.

## 📌 Roadmap
- [x] Implement Staking/Unstaking Logic
- [x] Create Interactive Dashboard
- [ ] Add Historical Transactions Page
- [ ] Implement Multi-Wallet Support
- [ ] Deploy on Mainnet

## 🏦 Contributing
We welcome contributions! Feel free to fork the repo and submit a pull request.

## 📝 License
This project is licensed under the MIT License.

## 🌎 Connect with Us
- Twitter: [@Gruuttttt](https://x.com/Gruuttttt)

