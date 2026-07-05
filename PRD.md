# PRD: Aframp — Private Economic Infrastructure

| Status | Owner | Version |
|--------|-------|---------|
| Draft | — | 0.1 |

---

## 1. Executive Summary

Aframp is a zero-knowledge privacy layer for Stellar merchant payments. It lets economic activity remain private by default while still allowing users to prove what needs to be proven.

> HTTPS for money.

Today a payment reveals wallet balance, transaction history, spending habits, income, suppliers, customers, and business revenue. Aframp replaces data exposure with **proof exposure** — counterparties and the blockchain learn only what is cryptographically necessary.

The long-term vision is **private financial infrastructure**: not just a wallet, but a platform on which developers can build payroll, commerce, lending, subscriptions, invoices, accounting, and marketplaces — all with privacy by default.

---

## 2. Problem Statement

### 2.1 What's Broken

Every Stellar transaction — amount, sender, receiver — is visible to the entire network. For merchants this is a business liability:

- Competitors track revenue and customer activity
- Customers lose financial privacy on every purchase
- Regulations (GDPR, data protection) require confidentiality that public blockchains don't provide
- High-value B2B payments expose sensitive business relationships
- Receipts leak metadata beyond what's necessary

### 2.2 Anti-Goals

| Anti-Goal | Rationale |
|-----------|-----------|
| Total anonymity | Not building anonymous crime-friendly systems |
| Public transaction history | Blockchain explorers should not expose everything |
| Metadata leakage | Receipts should not reveal more than necessary |
| Third-party-controlled disclosure | If someone else can unilaterally authorize disclosure, it isn't truly private |

### 2.3 Design Tenets

- Privacy by default
- Proof instead of disclosure
- Mathematics instead of trust
- Infrastructure instead of another wallet
- Disclosure remains under the user's control

---

## 3. Target Users

### 3.1 Consumer

Should be able to:
- Receive money privately
- Send money privately
- Hide balances, history, and counterparties
- Prove a payment happened without revealing details
- Selectively disclose information when desired

### 3.2 Merchant

Should be able to:
- Receive payments privately
- Keep revenue, customer lists, and suppliers confidential
- Keep business activity private
- Prove revenue, taxes, compliance, or fund ownership — without exposing everything

### 3.3 Developer

Should be able to:
- Build payment applications on private infrastructure
- Integrate ZK proofs via SDK without cryptographic expertise
- Offer privacy features to end users

---

## 4. Product Principles

1. **Privacy by default** — optimal privacy is the default, not an opt-in setting
2. **Consumer-grade UX** — complexity must be hidden from end users
3. **Merchants first** — solving merchant pain drives adoption
4. **Proof instead of disclosure** — the system proves facts without revealing data
5. **Self-sovereign disclosure** — the user controls what is revealed, to whom, and when
6. **Infrastructure platform** — not another wallet; a foundation for others to build on

---

## 5. Product Scope

### 5.1 MVP: Private Merchant Payments on Stellar (Hackathon Demo)

| Capability | Status |
|-----------|--------|
| ZK circuit with 3 R1CS constraints (nullifier, commitment, non-zero amount) | ✅ |
| Groth16 prover/verifier over BN254 (arkworks) | ✅ |
| Client-side WASM prover (237 KB, wasm-bindgen) | ✅ |
| Soroban smart contract with BN254 pairing checks | ✅ Deployed (testnet) |
| Merchant API (Axum, 17 routes) | ✅ |
| Merchant dashboard (React 19, Vite, Tailwind) | ✅ Deployed (Vercel) |
| POS terminal TUI | ⚠️ Needs fix |
| CLI for merchant ops | ✅ |
| E2E integration test | ⚠️ Fixed |

### 5.2 Phase 2: Privacy Receipts

Cryptographic evidence that an obligation has been satisfied — proves only the necessary fact ("payment completed") without exposing balances, history, or unrelated financial information.

### 5.3 Phase 3: Private Financial Infrastructure

Enable developers to build on top of private payments:

- Payroll
- Commerce platforms
- Lending
- Subscriptions
- Invoices
- Accounting systems
- Marketplaces

### 5.4 Out of Scope (v1)

- Layer-1 consensus changes
- Non-Stellar chains
- Anonymous transfers (privacy ≠ anonymity)
- Mobile wallet production release

---

## 6. User Stories

### Consumer

```
As a customer
I want to pay a merchant without revealing my balance or identity
So that my financial activity stays private.

As a customer
I want to prove I paid for an item
So that I can dispute if the merchant doesn't deliver
Without revealing my total balance or payment history.
```

### Merchant

```
As a merchant
I want to receive payments without competitors seeing my revenue
So that my business intelligence stays confidential.

As a merchant
I want to prove my revenue is over $10,000 USDC
So that I can qualify for a loan
Without revealing my exact revenue or transaction details.
```

### Developer

```
As a developer
I want to integrate private payments into my app
So that my users get privacy by default
Without needing to understand ZK cryptography.
```

---

## 7. Functional Requirements

### 7.1 Core Protocol

| ID | Requirement | Priority |
|----|-------------|----------|
| F1 | Customer can generate a ZK proof client-side without their secret leaving the device | P0 |
| F2 | Merchant can verify a proof without learning the customer's secret | P0 |
| F3 | The contract prevents double-spending via nullifier storage | P0 |
| F4 | Merchange can decrypt payment metadata via a viewing key (AES-256-GCM) | P0 |
| F5 | Payments are bound to a specific merchant (commitment includes merchant_id) | P0 |
| F6 | Amount zero is rejected by the circuit | P0 |

### 7.2 API

| ID | Requirement | Priority |
|----|-------------|----------|
| A1 | Create merchant identity (generates seed, pk, vk) | P0 |
| A2 | Serve proving key for client-side proof generation | P0 |
| A3 | Accept proof and relay to Soroban contract | P0 |
| A4 | Generate proof server-side (for testing) | P1 |
| A5 | Verify proof locally via stored VK | P1 |
| A6 | Generate proof from raw PK hex (POS/mobile clients) | P1 |
| A7 | Serve merchant balance, payments, QR info | P0 |
| A8 | Dashboard stats endpoint | P1 |
| A9 | Compliance report generation | P2 |
| A10 | Viewing key generation | P2 |

### 7.3 Frontend

| ID | Requirement | Priority |
|----|-------------|----------|
| U1 | Landing page explaining the product | P0 |
| U2 | Onboarding wizard for merchant setup | P0 |
| U3 | Dashboard with volume, transactions, charts | P0 |
| U4 | Transaction history with status tracking | P1 |
| U5 | Compliance report UI and CSV export | P2 |
| U6 | Live WASM proof generation demo | P0 |
| U7 | Settings and QR code display | P1 |
| U8 | Analytics distribution page | P2 |

### 7.4 Smart Contract

| ID | Requirement | Priority |
|----|-------------|----------|
| C1 | Initialize contract with merchant VK | P0 |
| C2 | Verify Groth16 proof via BN254 pairing checks | P0 |
| C3 | Process payment: verify + nullifier check + record | P0 |
| C4 | Query nullifier usage (double-spend check) | P0 |

---

## 8. Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| N1 | Proof generation time (WASM, browser) | < 2 seconds |
| N2 | Proof verification time (contract) | < 1 second |
| N3 | WASM bundle size | < 300 KB |
| N4 | API response time (p95) | < 200 ms |
| N5 | Frontend Lighthouse score | > 85 |
| N6 | Contract deployment | Stellar Testnet (v1) → Mainnet (v2) |

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| Proof generation < 2s in browser | ✅ |
| 9 unit tests passing | ✅ |
| Contract deployed and verified | ✅ Testnet |
| E2E test (12 checks) passing | ⚠️ |
| Merchant dashboard usable | ✅ |
| API serving 17 endpoints | ✅ |

### Future Metrics

- Time to onboard a merchant: < 5 min
- Number of transactions processed
- Developer integrations built on the platform
- Compliance request turnaround

---

## 10. Current Build Status

| Area | Progress |
|------|----------|
| Strategic Vision | ~90% |
| Problem Definition | ~95% |
| Product Positioning | ~85% |
| Technical Architecture | ~40% |
| User Experience | ~35% |
| Proof System Design | ~15% |
| Compliance & Disclosure Model | ~25% |
| Business Model | ~15% |
| Investor Materials | ~10% |
| **Overall** | **~30-35%** |

The largest gap is execution: translating the thesis into complete architecture, engineering plans, and working implementation.

---

## 11. Remaining Work

1. Technical Architecture Document
2. Cryptographic protocol specification
3. User experience and design system
4. API and SDK specification
5. Backend services and data flow
6. Client application implementation
7. Merchant dashboard
8. Privacy Receipt specification
9. Selective disclosure framework
10. Developer SDK
11. Security and threat model
12. Compliance and governance model
13. Business model and pricing
14. Go-to-market strategy
15. Investor pitch deck
16. Demo implementation
17. Documentation
18. Testing and security review
19. Pilot deployment and user validation

---

## 12. Technical Architecture

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

### Flow

```
1. Merchant creates identity → generates PK, VK, CRS
2. Customer fetches PK via GET /api/merchant/:id/pk
3. Customer generates random secret (32 bytes, stays in browser)
4. WASM computes: nullifier = secret + amount, commitment = secret × amount × merchant_id
5. WASM generates Groth16 proof
6. Customer submits proof (a, b, c, nullifier, commitment) to POST /api/payment/submit-to-contract
7. API relays to Soroban contract → verifies BN254 pairings → stores nullifier
8. Payment note encrypted with viewing key → merchant dashboard decrypts and displays
```

---

## 13. Tech Stack

| Component | Technology |
|-----------|-----------|
| Proving System | arkworks 0.4 + Groth16 (BN254) |
| Smart Contracts | Soroban (Stellar Protocol 25+) |
| Backend API | Rust + Axum + Tokio |
| Frontend | React 19 + Vite + TypeScript + Tailwind v4 + framer-motion |
| Client-Side ZK | WASM (wasm-bindgen, 237 KB) |
| Data Fetching | TanStack React Query |
| Charts | Chart.js + Recharts |
| Mobile | React Native (Expo) |
| POS Client | Rust + dialoguer TUI |
