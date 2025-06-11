# StarPayKids - Allowance Sending dApp

A minimal allowance sending application built on Stellar Soroban blockchain.

## 🎯 Features

- **Freighter Wallet Integration**: Secure wallet connection
- **Send Allowance**: Send XLM allowance to child wallet addresses
- **Statistics Tracking**: Track total sent allowance and last recipient
- **Modern UI**: Responsive design with Tailwind CSS
- **Smart Contract**: Deployed on Stellar Testnet

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- [Rust](https://rustup.rs/) (for contract development)
- [Freighter Wallet Extension](https://freighter.app/)

### 1. Install Dependencies

```bash
npm install
```

### 2. Build Contract (Optional)

The contract is already deployed, but you can rebuild it if needed:

```bash
cd contract
cargo build --target wasm32-unknown-unknown --release
```

### 3. Start Frontend

```bash
npm run dev
```

The application will be available at `http://localhost:3002`.

## 📱 How to Use

### 1. Setup Freighter Wallet
- Install [Freighter Extension](https://freighter.app/)
- Switch to Stellar Testnet
- Get test XLM from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator)

### 2. Use the Application
1. Click "Connect with Freighter Wallet" on the homepage
2. Approve the connection in Freighter
3. On the main page:
   - Enter child wallet address
   - Enter allowance amount (XLM)
   - Click "Send Allowance"
   - Confirm the transaction in Freighter

## 🔧 Smart Contract

**Contract ID:** `CCQ3U57MVPIEQDUP2UFRVDY3LP5TQDJ4HJ2VE7ZJ6QWK7DAN6RBEJAEL`
**Network:** Stellar Testnet

### Contract Functions

#### `send_allowance(child_address, amount)`
- Sends allowance to the specified child address
- Updates total sent amount
- Records the last recipient address

#### `get_total_sent()`
- Returns total allowance sent (u32)

#### `get_last_child()`
- Returns the last child address that received allowance (Option<Address>)

## 🛠 Technical Details

### Frontend
- **Framework**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Stellar SDK + Freighter API
- **Network**: Stellar Testnet

### Smart Contract
- **Language**: Rust
- **Platform**: Stellar Soroban
- **Storage**: Persistent storage
- **Testing**: Tested with Cargo test
- **Deployment**: Live on Stellar Testnet

## 📁 Project Structure

```
StarPayKids/
├── pages/
│   ├── index.tsx        # Wallet connection page
│   ├── main.tsx         # Main allowance sending UI
│   └── _app.tsx         # Next.js app wrapper
├── utils/
│   └── contract.ts      # Contract integration functions
├── contract/
│   └── src/
│       ├── lib.rs       # Soroban contract code
│       └── test.rs      # Contract tests
├── globals.css          # Tailwind CSS
└── package.json
```

## ⚠️ Important Notes

- This application runs on **Stellar Testnet**
- Use test XLM only - do not use real funds
- Freighter wallet extension is required
- Contract is deployed and ready to use

## 🚀 Deployment Status

- ✅ Contract successfully compiled
- ✅ Contract deployed to Stellar Testnet
- ✅ Frontend integrated with deployed contract
- ✅ Wallet connection working
- ✅ UI properly displaying
- ✅ Ready for testing and usage

## 🔍 Test Scenarios

- ✅ Contract builds successfully
- ✅ Contract deployed to testnet
- ✅ Wallet connection works
- ✅ UI displays correctly
- ✅ Contract integration complete
- ✅ Frontend development server running

## 📞 Support

Built according to PDR (Project Design Requirements) documentation. For any issues, check the project documentation or contract deployment logs.
