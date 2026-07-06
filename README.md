<p align="center">
  <img src="https://raw.githubusercontent.com/kelly-musk/Aframpwallet/master/merchant-dashboard/public/favicon.svg" width="80" />
</p>

<h1 align="center">Aframp</h1>

<p align="center">
  <strong>The Private Financial Infrastructure for Modern Commerce.</strong>
</p>

<p align="center">
  <a href="https://github.com/kelly-musk/Aframpwallet"><img src="https://img.shields.io/badge/Status-Development-yellow" /></a>
  <a href="https://github.com/kelly-musk/Aframpwallet"><img src="https://img.shields.io/badge/Stellar-Testnet-7B1FA2" /></a>
  <a href="https://github.com/kelly-musk/Aframpwallet"><img src="https://img.shields.io/badge/ZK-Groth16_Bn254-10b981" /></a>
  <a href="https://github.com/kelly-musk/Aframpwallet"><img src="https://img.shields.io/badge/WASM-Client_Side-FF6B35" /></a>
  <a href="https://github.com/kelly-musk/Aframpwallet"><img src="https://img.shields.io/badge/License-MIT-green" /></a>
</p>

> **⚠️ Development Status**: This project is still under active development and has not reached a full MVP release. Components are incomplete, unoptimized, and subject to breaking changes. Not ready for production use.

---

## Vision

Aframp is building the infrastructure that makes financial privacy the default across the entire movement of money — from entering digital assets, to making payments, to exiting back into local currencies.

Whether you're an individual buying coffee, a merchant accepting payments, or a business settling invoices, your financial activity should belong to you — not the public.

> **The Privacy Layer for Digital Finance.**

### Private Economics

This is the philosophy behind Aframp. Not just hiding transactions — protecting **economic relationships**. Salaries, payroll, supplier contracts, business revenue, invoices, subscriptions, donations, savings, treasury, loans, investments, commerce.

These reveal how people and businesses operate. That information has real value and should not be exposed by default.

---

## The Problem

Today's financial systems leak information everywhere. Banks, payment processors, public blockchains, analytics companies, and competitors all have visibility into your financial life.

Every payment reveals who paid, who received, the amount, frequency, business relationships, revenue, customers, suppliers, and spending behavior. **Money becomes surveillance.**

Financial privacy should work like encrypted messaging. When you send a message, no one expects the whole internet to read it. When you make a payment, no one should expect the whole internet to inspect your finances.

---

## What Aframp Is

Aframp is **not** simply an onramp. It is **not** simply an offramp. It is **not** simply a wallet.

Aframp is a **private financial operating system** built around the complete lifecycle of digital money:

```
Fiat → Onramp → Private Wallet → Private Payments →
Merchant Acceptance → Payroll → Invoices → Subscriptions →
Savings → Business Treasury → Offramp → Bank
```

Every step preserves privacy.

---

## Products

### 1. Private Onramp
Buy digital assets privately. No unnecessary financial exposure.

### 2. Private Wallet
Hold assets privately — hidden balances, hidden transaction history, hidden relationships.

### 3. Private Payments
Pay anyone. Reveal nothing except proof that payment happened.

### 4. Merchant Payments
Businesses receive payments privately — revenue hidden, customers hidden, suppliers hidden, invoices hidden.

### 5. Merchant Dashboard
Businesses see revenue, transactions, analytics, and reports without exposing anything publicly.

### 6. Viewing Keys
Businesses decide who can see what and when — not the blockchain, not the protocol, the merchant.

### 7. Compliance
Need an audit? Generate a proof. Need taxes? Generate a proof. Share only what is required. Nothing more.

### 8. Private Offramp
Convert digital assets back to local currency. Privacy preserved.

---

## Privacy Receipts

Instead of sending payment details, wallet history, balance, and metadata, Aframp sends:

```
✓ Payment completed
✓ Verified
✓ Cryptographically valid
```

Nothing else. Exactly what the recipient needs.

---

## Why Merchants Need Aframp

A merchant accepting payments on a transparent blockchain unintentionally publishes business intelligence. Competitors can estimate monthly revenue, customer growth, average order value, seasonal trends, supplier relationships, and high-value clients.

Aframp prevents this by making payment details private while still allowing verification where needed.

---

## Technical Foundation

| Component | Technology |
|-----------|-----------|
| Layer 1 | Stellar |
| Smart Contracts | Soroban |
| Proof System | Groth16 over BN254 |
| Client-Side ZK | WASM (wasm-bindgen, 237 KB) |
| Viewing Key Encryption | AES-256-GCM |
| Backend API | Rust + Axum |
| Frontend | React 19 + Vite + Tailwind v4 + framer-motion |
| Mobile | React Native (Expo) |
| POS Client | Rust + dialoguer TUI |

The cryptography stays behind the scenes so users get a familiar payment experience.

---

## Long-Term Vision

Aframp becomes the privacy layer for the entire financial ecosystem. Developers build on top of it:

- E-commerce platforms
- Payroll systems
- Invoice platforms
- Donation platforms
- Subscription billing
- Lending and escrow
- Remittances
- Stablecoin payments
- Treasury management
- Cross-border commerce
- POS software
- Accounting integrations

---

## What Makes Aframp Different

Most fintech products focus on moving money faster. Most blockchain products focus on transparency. Aframp focuses on **protecting the information that money creates**.

The value isn't just in private transactions — it's in protecting the **economic graph**: the relationships between customers, merchants, suppliers, employees, partners, and institutions.

---

## Architecture

```
aframp/
├── privacy-circuits/       # ZK Circuit + Groth16 prover/verifier (arkworks)
│   └── src/lib.rs          # PaymentCircuit, MerchantPaymentSystem
├── privacy-contract/       # Soroban smart contract (no_std WASM)
│   └── src/lib.rs          # Groth16 verifier via BN254 pairing checks
├── privacy-cli/            # Terminal CLI for merchant ops
├── merchant-api/           # Axum REST API server (port 3000)
│   └── src/main.rs         # Merchant CRUD, proof relay, dashboard stats
├── pos-client/             # POS terminal TUI (dialoguer + ureq)
├── merchant-dashboard/     # React 19 + Vite + Tailwind + framer-motion
│   └── src/
│       ├── pages/          # Landing, Dashboard, Transactions, Compliance, Pay Demo, etc.
│       ├── components/     # Navbar, Footer, AppLayout, StatsCard
│       └── services/       # API client, WASM prover wrapper
├── wallet-wasm/            # WASM-compiled ZK prover (wasm-bindgen)
│   └── src/lib.rs          # generate_proof() exported to JS
└── wallet-app/             # React Native (Expo) mobile wallet for customers
```

---

## Quick Start

### Prerequisites

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install soroban-cli --version 27.0.0
soroban keys generate alice --network testnet
```

### Build & Run

```bash
git clone https://github.com/kelly-musk/Aframpwallet.git
cd Aframpwallet
cargo build
cd merchant-dashboard && npm install && npm run build && cd ..
CONTRACT_ID=CA23SNSLINP3SFVUUCRWNHDNKWYQ23UFURUOTZDZMNSOKM2O63V2MP2Y \
./target/debug/merchant-api
```

For local development, open **http://localhost:5173** (Vite dev server proxies API to port 3000).

### CLI Usage

```bash
cargo run -p privacy-cli -- merchant
cargo run -p privacy-cli -- init-contract <CONTRACT_ID>
cargo run -p privacy-cli -- proof
```

### Run Tests

```bash
cargo test
./test_e2e.sh
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/merchant/create` | Create merchant identity (generates seed, pk, vk) |
| GET | `/api/merchant/:seed_hex/pk` | Fetch proving key for client-side proof generation |
| GET | `/api/merchant/:seed_hex/payments` | List payment records |
| GET | `/api/merchant/:seed_hex/balance` | Merchant balance |
| GET | `/api/merchant/:seed_hex/qr-info` | QR code data for customer wallet |
| POST | `/api/payment/generate-proof` | Generate a zero-knowledge proof server-side |
| POST | `/api/payment/verify` | Verify a proof locally |
| POST | `/api/payment/submit-to-contract` | Submit proof to Soroban contract |
| POST | `/api/wallet/generate-proof` | Generate proof from raw proving key |
| POST | `/api/merchant/init-contract` | Initialize contract with verifying key |
| GET | `/api/dashboard/stats` | Dashboard analytics |
| POST | `/api/compliance/report` | Compliance report |
| POST | `/api/compliance/viewing-key` | Generate viewing key for decryption |
| GET | `/api/export/transactions` | CSV export |

---

## Smart Contract

Deployed on Stellar Testnet:

```
CA23SNSLINP3SFVUUCRWNHDNKWYQ23UFURUOTZDZMNSOKM2O63V2MP2Y
```

| Function | Description |
|----------|-------------|
| `initialize(vk)` | Store verifying key |
| `verify_proof(proof, pub_signals)` | Groth16 BN254 pairing check |
| `process_payment(proof, merchant_id, nullifier, commitment)` | Verify + nullifier check + record |
| `is_nullifier_used(nullifier)` | Check double-spend status |

---

## Repository Structure

| Directory | Lines | Description |
|---|---|---|
| `privacy-circuits/` | ~250 | ZK circuit with 3 R1CS constraints |
| `privacy-contract/` | ~390 | Soroban Groth16 verifier, 6 passing tests |
| `merchant-api/` | ~770 | Axum API server, 17 routes |
| `merchant-dashboard/` | ~2,000 | React SPA, 11 pages + landing with framer-motion |
| `wallet-wasm/` | ~65 | WASM-compiled prover (237 KB) |
| `privacy-cli/` | ~280 | Terminal CLI |
| `pos-client/` | ~330 | POS TUI |
| `wallet-app/` | ~900 | React Native mobile wallet |

---

## License

MIT — Built for the Stellar Hackathon.
