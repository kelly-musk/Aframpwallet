# Technical Architecture Document — Aframp

| Status | Version |
|--------|---------|
| Draft | 0.1 |

---

## 1. System Overview

Aframp is a zero-knowledge privacy layer for Stellar merchant payments. It uses **Groth16 proofs over BN254** to hide payment amounts, customer identities, and merchant relationships from the public ledger. The system is composed of seven crates working together:

| Layer | Crate | Role |
|-------|-------|------|
| **Circuit** | `privacy-circuits` | R1CS constraint system, prover, verifier |
| **Contract** | `privacy-contract` | Soroban smart contract (on-chain verifier) |
| **API** | `merchant-api` | Axum REST server (merchant backend) |
| **WASM** | `wallet-wasm` | Browser-compiled prover (wasm-bindgen) |
| **CLI** | `privacy-cli` | Terminal tool for merchant ops |
| **UI** | `merchant-dashboard` | React SPA (merchant frontend) |
| **POS** | `pos-client` | Terminal TUI for point-of-sale |
| **Mobile** | `wallet-app` | React Native (Expo) mobile wallet |

---

## 2. Cryptographic Design

### 2.1 Curve and Proof System

| Parameter | Choice |
|-----------|--------|
| Curve | BN254 (Barreto-Naehrig, `ark-bn254`) |
| Proof System | Groth16 (`ark-groth16`) |
| Field | `ark_bn254::Fr` (254-bit scalar field) |
| R1CS Library | `ark-r1cs-std` (FpVar) |
| Setup | Circuit-specific (`CircuitSpecificSetupSNARK`) |

### 2.2 Payment Circuit (`PaymentCircuit`)

The circuit has **3 public inputs** and **2 private witnesses**:

#### Public Inputs (verified by contract)
| Input | Type | Source |
|-------|------|--------|
| `merchant_id` | `Fr` | Merchant's 32-byte seed |
| `nullifier` | `Fr` | Computed as `secret + amount` |
| `commitment` | `Fr` | Computed as `secret × amount × merchant_id` |

#### Private Witnesses (known only to customer)
| Witness | Type | Source |
|---------|------|--------|
| `customer_secret` | `Fr` | Random 32 bytes, `crypto.getRandomValues()` |
| `amount` | `Fr` | Payment amount in smallest units |

#### Constraints (3 R1CS constraints)

```
Constraint 1: nullifier = customer_secret + amount
  Purpose: Uniqueness — deterministic from secret+amount, prevents double-spend

Constraint 2: commitment = customer_secret × amount × merchant_id
  Purpose: Binding — ties payment to a specific merchant

Constraint 3: amount × inv(amount) = 1
  Purpose: Non-zero check — rejects zero-value payments
```

#### Constraint Implementation (arkworks R1CS)

```rust
// Witness variables (private)
let secret = FpVar::new_witness(cs, || Ok(self.customer_secret));
let amount = FpVar::new_witness(cs, || Ok(self.amount));

// Public input variables
let merchant = FpVar::new_input(cs, || Ok(self.merchant_id));
let nullifier = FpVar::new_input(cs, || Ok(self.nullifier));
let commitment = FpVar::new_input(cs, || Ok(self.commitment));

// C1: nullifier = secret + amount
let computed_nullifier = secret.clone() + amount.clone();
computed_nullifier.enforce_equal(&nullifier);

// C2: commitment = secret × amount × merchant_id
let computed_commitment = secret.clone() * amount.clone() * merchant;
computed_commitment.enforce_equal(&commitment);

// C3: amount ≠ 0
let inv_amount = FpVar::new_witness(cs, || Ok(self.amount.inverse().unwrap()));
(amount * inv_amount).enforce_equal(&FpVar::constant(Fr::one()));
```

### 2.3 MerchantPaymentSystem

```rust
pub struct MerchantPaymentSystem {
    pub merchant_id: Fr,
    pub pk: ProvingKey<Bn254>,   // distributed to customers
    pub vk: VerifyingKey<Bn254>, // stored on-chain
}
```

**CRS Generation:**
1. Creates a representative circuit with non-zero amounts
2. Calls `Groth16::<Bn254>::setup(circuit, rng)`
3. Serializes pk/vk compressed to disk

### 2.4 Proof Generation (customer side)

```rust
pub fn customer_generate_proof(
    pk: &ProvingKey<Bn254>,
    customer_secret: &[u8; 32],
    amount: u64,
    merchant_id: &[u8; 32],
) -> Result<(Proof<Bn254>, Fr, Fr), Box<dyn Error>>
```

1. Converts inputs to `Fr` field elements
2. Computes public values: `nullifier = secret_fr + amount_fr`, `commitment = secret_fr × amount_fr × merchant_fr`
3. Instantiates `PaymentCircuit` with all values
4. Calls `Groth16::<Bn254>::prove(pk, circuit, rng)`

### 2.5 Proof Verification (merchant side)

```rust
pub fn verify_proof(
    &self,
    proof: &Proof<Bn254>,
    merchant_id: &Fr,  // must match stored merchant_id
    nullifier: &Fr,
    commitment: &Fr,
) -> Result<bool, Box<dyn Error>>
```

Calls `Groth16::<Bn254>::verify(&self.vk, &[merchant_id, nullifier, commitment], proof)`.

---

## 3. Smart Contract Architecture (`privacy-contract`)

### 3.1 Contract Environment

| Property | Value |
|----------|-------|
| Platform | Soroban (Stellar Protocol 25+) |
| Language | Rust `#![no_std]` |
| SDK | `soroban-sdk` 27.0.0-rc.1 |
| Crypto | Built-in bn254 host functions |
| Deployment | Testnet: `CA23SNSLINP3SFVUUCRWNHDNKWYQ23UFURUOTZDZMNSOKM2O63V2MP2Y` |

### 3.2 Data Structures

```rust
pub struct VerificationKey {
    pub alpha: Bn254G1Affine,
    pub beta: Bn254G2Affine,
    pub gamma: Bn254G2Affine,
    pub delta: Bn254G2Affine,
    pub ic: Vec<Bn254G1Affine>,  // 2 elements (1 + 3 pub signals - 1)
}

pub struct Proof {
    pub a: Bn254G1Affine,
    pub b: Bn254G2Affine,
    pub c: Bn254G1Affine,
}

pub enum DataKey {
    Vk,                    // singleton VK storage
    Used(BytesN<32>),      // nullifier -> bool
}
```

### 3.3 Contract Functions

#### `initialize(vk: VerificationKey)`
Stores the verifying key in contract persistent storage under `DataKey::Vk`.

#### `verify_proof(vk, proof, pub_signals) -> Result<bool, VerifierError>`
Implements the Groth16 pairing check using Soroban's built-in bn254 host functions:

1. **MSM computation:** `vk_x = bn254.g1_msm(vk.ic, scalars)` where `scalars[0] = 1` followed by public signals
2. **Negation:** `neg_a = bn254.g1_neg(proof.a)`
3. **Pairing check:** Constructs two vectors and calls `bn254.pairing_check(vp1, vp2)`:
   ```
   vp1 = [neg_a, vk.alpha, vk_x, proof.c]
   vp2 = [proof.b, vk.beta, vk.gamma, vk.delta]
   ```

#### `process_payment(proof, merchant_id, nullifier, commitment) -> Result<bool, VerifierError>`
1. Loads VK from storage (errors if `NotInitialized`)
2. Calls `verify_proof` with `pub_signals = [merchant_id, nullifier, commitment]`
3. On success, checks `is_nullifier_used(nullifier)`
4. If unused, stores `DataKey::Used(nullifier_bytes) -> ()` and returns `true`
5. If used, returns `Err(NullifierAlreadyUsed)`

#### `is_nullifier_used(nullifier) -> bool`
Checks `DataKey::Used` in contract storage.

### 3.4 Pairing Check Equation

The Groth16 verification equation implemented on-chain:

```
e(proof.a, proof.b) = e(vk.alpha, vk.beta) × e(vk_x, vk.gamma) × e(proof.c, vk.delta)
```

Where `vk_x = vk.ic[0] + Σ(pub_signal[i] × vk.ic[i+1])`.

### 3.5 Error Handling

```rust
pub enum VerifierError {
    MalformedVerifyingKey = 0,
    VerificationFailed = 1,
    NotInitialized = 2,
    NullifierAlreadyUsed = 3,
}
```

---

## 4. API Architecture (`merchant-api`)

### 4.1 Server Configuration

| Property | Value |
|----------|-------|
| Framework | Axum (Tokio async) |
| Port | 3000 |
| CORS | All origins, GET+POST methods |
| Static files | Serves `merchant-dashboard/dist/` with SPA fallback |

### 4.2 Application State

```rust
struct AppState {
    merchants: Arc<Mutex<HashMap<SeedHex, MerchantPaymentSystem>>>,
    contract_id: Option<String>,  // from CONTRACT_ID env var
    fixed_seed: Option<String>,   // from MERCHANT_SEED env var
}
```

### 4.3 Route Table (18 endpoints)

| Method | Route | Handler | Description |
|--------|-------|---------|-------------|
| POST | `/api/merchant/create` | `create_merchant` | Create identity + CRS |
| GET | `/api/merchant/:merchant_id` | `get_merchant_info` | Static merchant info |
| GET | `/api/merchant/:seed_hex/pk` | `get_merchant_pk` | Serve proving key |
| GET | `/api/merchant/:seed_hex/payments` | `get_merchant_payments` | Decrypted payment list |
| GET | `/api/merchant/:seed_hex/balance` | `get_merchant_balance` | Balance + note count |
| GET | `/api/merchant/:seed_hex/qr-info` | `get_merchant_qr_info` | QR data for wallet |
| POST | `/api/payment/generate-proof` | `api_generate_proof` | Server-side proof gen |
| POST | `/api/payment/verify` | `api_verify_proof` | Local proof verification |
| POST | `/api/payment/submit-to-contract` | `submit_to_contract` | Relay proof → Soroban |
| POST | `/api/wallet/generate-proof` | `api_wallet_generate_proof` | Proof from raw PK |
| POST | `/api/merchant/init-contract` | `init_contract` | Deploy VK to contract |
| GET | `/api/dashboard/stats` | `get_dashboard_stats` | Analytics |
| POST | `/api/compliance/report` | `generate_compliance_report` | Compliance PDF |
| POST | `/api/compliance/viewing-key` | `generate_viewing_key` | New viewing key |
| GET | `/api/balance/:merchant_id` | `get_balance` | Raw balance string |
| GET | `/api/export/transactions` | `export_transactions` | CSV download |

### 4.4 Serialization Layer

| Function | Input | Output | Hex Length |
|----------|-------|--------|-----------|
| `fr_to_hex` | `Fr` | 64-char hex | 32 bytes |
| `g1_to_hex` | `G1Affine` | 128-char hex | x (32B) + y (32B) |
| `g2_to_hex` | `G2Affine` | 256-char hex | x.c1 + x.c0 + y.c1 + y.c0 |
| `hex_to_g1` | 128-char hex | `G1Affine` | — |
| `hex_to_g2` | 256-char hex | `G2Affine` | — |

### 4.5 Payment Encryption

```
encrypt_payment_data(viewing_key, amount, customer_id, timestamp)
  → AES-256-GCM(nonce || ciphertext)
  → hex-encoded

decrypt_payment_data(viewing_key, encrypted_hex)
  → parse(amount | customer_id | timestamp)
```

### 4.6 Storage Layer

```
merchant_data/
└── <seed_hex>/
    ├── pk                  # Compressed ProvingKey (binary)
    ├── vk                  # Compressed VerifyingKey (binary)
    ├── merchant_id         # hex seed (plaintext)
    ├── viewing_key         # 32 bytes (binary)
    └── payment_notes/
        └── <nullifier>.enc # AES-256-GCM encrypted payment data
```

### 4.7 Contract Interaction

The API shells out to the `soroban` CLI tool for contract operations:

```bash
# Process payment
soroban contract invoke --id <CONTRACT_ID> --source alice --network testnet -- \
    process_payment \
    --merchant_id 0x<merchant_id> \
    --nullifier 0x<nullifier> \
    --commitment 0x<commitment> \
    --proof-file-path <temp_proof.json>

# Initialize contract
soroban contract invoke --id <CONTRACT_ID> --source alice --network testnet -- \
    initialize \
    --vk-file-path <temp_vk.json>
```

---

## 5. WASM Prover (`wallet-wasm`)

### 5.1 Build Configuration

| Property | Value |
|----------|-------|
| Crate type | `cdylib` |
| Bundle size | 237 KB |
| Target | Browser (wasm-bindgen) |
| RNG | `getrandom` with `js` feature |

### 5.2 Exported API

```typescript
// JavaScript binding
function generate_proof(
    pk_hex: string,           // merchant's proving key (hex)
    customer_secret_hex: string, // random 32 bytes (hex)
    amount: number,           // u64
    merchant_id_hex: string   // merchant identifier (hex)
) -> {
    a: string,          // 128 hex chars (G1 point)
    b: string,          // 256 hex chars (G2 point)
    c: string,          // 128 hex chars (G1 point)
    nullifier: string,  // 64 hex chars (Fr)
    commitment: string  // 64 hex chars (Fr)
}
```

### 5.3 Internal Flow

1. Decode `pk_hex` → `ProvingKey<Bn254>` (deserialize_compressed)
2. Decode 32-byte hex inputs → `[u8; 32]`
3. Call `privacy_circuits::customer_generate_proof()`
4. Serialize result → JSON via `serde-wasm-bindgen`

---

## 6. Frontend Architecture (`merchant-dashboard`)

### 6.1 Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 8 |
| CSS | Tailwind CSS v4 |
| Animation | framer-motion |
| Data Fetching | TanStack React Query |
| Charts | Chart.js + Recharts |
| WASM | vite-plugin-wasm |
| Type Safety | TypeScript |

### 6.2 Route Map

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Landing | Marketing hero, marquee, FAQ accordion |
| `/home` | Home | Static marketing |
| `/features` | Features | Product features |
| `/developers` | Developers | API documentation |
| `/about` | About | Project info |
| `/onboard` | Onboarding | 5-step merchant setup wizard |
| `/dashboard` | Dashboard | Stats grid, activity feed |
| `/transactions` | Transactions | Payment history table |
| `/distribution` | Reports | Analytics distribution |
| `/compliance` | Compliance | Reports, CSV export, viewing keys |
| `/settings` | Settings | Config, QR code |
| `/pay` | PaymentDemo | Live WASM proof generation |

### 6.3 WASM Integration

The WASM prover is loaded dynamically via `vite-plugin-wasm`:

```typescript
import init, { generate_proof } from 'wallet-wasm'

await init()
const result = generate_proof(pk_hex, secret_hex, amount, merchant_id_hex)
```

### 6.4 Dev Proxy

```
Vite dev server (:5173)
  └── /api/* → proxy to localhost:3000 (merchant-api)
```

---

## 7. CLI Architecture (`privacy-cli`)

### 7.1 Commands

| Command | Function | Description |
|---------|----------|-------------|
| `merchant` / `m` | — | Generate seed + CRS, save to `.merchant/` |
| `proof` / `p` | — | Generate proof from saved keys |
| `init-contract` / `init` | — | Merchant + deploy VK to contract |
| `process-payment` / `pay` | — | Submit proof to contract |

### 7.2 Storage

```
.merchant/
├── seed    # hex seed (text)
├── pk      # compressed ProvingKey (binary)
└── vk      # compressed VerifyingKey (binary)
```

---

## 8. Data Flow Diagrams

### 8.1 Payment Lifecycle

```
MERCHANT SETUP:
  Merchant CLI/API → MerchantPaymentSystem::new(seed)
    ├── merchant_id = Fr::from_le_bytes_mod_order(seed)
    ├── (pk, vk) = Groth16::setup(circuit, rng)
    └── pk → /api/merchant/:seed/pk
    └── vk → contract.initialize(vk)

CUSTOMER PAYS:
  Browser/App                     Merchant API                    Soroban Contract
  ───────────                     ────────────                    ────────────────
  1. GET /api/merchant/:id/pk ──►
     ◄── pk_hex                
  2. Generate random secret (32B)
  3. nullifier = secret + amount
     commitment = secret × amount × merchant_id
  4. Groth16::prove(pk, circuit)
  5. POST /api/payment/submit-to-contract ──►
     { a, b, c, nullifier, commitment }     6. soroban contract invoke process_payment ──►
                                               ├── bn254.pairing_check(...)
                                               ├── DataKey::Used(nullifier) check
                                               └── Store nullifier
     ◄── tx_hash                             ◄── success
  7. Encrypt payment note (AES-256-GCM) ──►
     Store merchant_data/<seed>/payment_notes/<nullifier>.enc

MERCHANT VIEWS:
  Dashboard GET /api/merchant/:seed/payments
    └── Read + decrypt payment_notes/*.enc
    └── Return decrypted payment list
```

### 8.2 Proof Format

```
Groth16 Proof (arkworks):
  a: G1Affine → 64 bytes uncompressed → 128 hex chars
  b: G2Affine → 128 bytes uncompressed → 256 hex chars
  c: G1Affine → 64 bytes uncompressed → 128 hex chars

Public Signals:
  nullifier: Fr → 32 bytes → 64 hex chars
  commitment: Fr → 32 bytes → 64 hex chars
  merchant_id: Fr → 32 bytes → 64 hex chars
```

---

## 9. Security Model

### 9.1 Threat Model

| Threat | Mitigation |
|--------|-----------|
| Double-spending | Nullifier stored on-chain, uniqueness enforced |
| Forged proofs | Groth16 knowledge soundness (pairing checks) |
| Secret leakage | Secret generated client-side, never transmitted |
| Merchant impersonation | Payment commitment bound to merchant_id |
| Zero-value payments | Circuit constraint rejects amount = 0 |
| Replay attacks | Nullifier unique per (secret, amount) pair |

### 9.2 Trust Assumptions

- Customer trusts their own device (secret generation + proof generation)
- Merchant trusts their own API/CLI (key generation, viewing key storage)
- Both parties trust the Stellar network for contract execution
- No trusted setup ceremony (CRS generated per-merchant)

### 9.3 Data Privacy

| Data | Where Stored | Visibility |
|------|-------------|-----------|
| Customer secret | Browser memory only | Never stored or transmitted |
| Amount | Encrypted payment note | Merchant only (viewing key) |
| Customer ID | Encrypted payment note | Merchant only |
| Nullifier | Contract storage | Public (prevents double-spend) |
| Proof | Contract (via relay) | Public (no private info) |
| Merchant seed | Merchant filesystem | Merchant only |
| Viewing key | Merchant filesystem | Merchant only |

---

## 10. Key Design Decisions

### 10.1 Why Groth16 (not Plonk, Bulletproofs, etc.)

- Smallest proof size (3 group elements = 256 bytes compressed)
- Fastest verification (single pairing check)
- Well-supported in arkworks
- Constant-size proofs regardless of circuit size

### 10.2 Why BN254 (not BLS12-381, etc.)

- Native Soroban support for BN254 pairing checks
- Widely deployed in ZK ecosystems (Ethereum, etc.)
- Sufficient security level (128-bit)

### 10.3 Why Per-Merchant CRS (not universal setup)

- No trusted setup ceremony required
- Merchant controls their own keys
- Simpler deployment for hackathon scope
- Trade-off: each merchant needs unique proving key storage

### 10.4 Why AES-256-GCM for Payment Notes

- Viewing key encryption enables selective disclosure
- Merchant controls decryption, not the blockchain
- Compliant with regulatory audit requirements
- Decoupled from ZK circuit (can change independently)

### 10.5 Why CLI-based Contract Interaction (not SDK)

- `soroban` CLI handles key management and network configuration
- Simpler than embedding Stellar SDK in the API
- Trade-off: requires `soroban` binary on the server

---

## 11. Performance Characteristics

| Operation | Environment | Estimated Time |
|-----------|-------------|---------------|
| CRS generation | Server (Rust native) | < 1 second |
| Proof generation | Browser (WASM) | < 2 seconds |
| Proof generation | Server (Rust native) | < 100 ms |
| Proof verification | Server (Rust native) | < 50 ms |
| Proof verification | Contract (Soroban) | < 1 second |
| AES-256 encrypt/decrypt | Server | < 1 ms |
| API response (no contract) | Server | < 50 ms |
| WASM module load | Browser | < 500 ms |

---

## 12. Dependencies

### 12.1 Workspace Dependencies

| Crate | Version |
|-------|---------|
| `ark-bn254` | 0.4.0 |
| `ark-groth16` | 0.4.0 |
| `ark-serialize` | 0.4.0 |
| `ark-ff` | 0.4.2 |
| `ark-relations` | 0.4.0 |
| `ark-r1cs-std` | 0.4.0 |
| `ark-std` | 0.4.0 |
| `soroban-sdk` | 27.0.0-rc.1 |
| `axum` | 0.7 |
| `tokio` | 1.0 (full) |
| `serde` / `serde_json` | 1.0 |
| `hex` | 0.4 |
| `rand` | 0.8 |
| `wasm-bindgen` | 0.2 |

### 12.2 Crate Dependency Graph

```
wallet-wasm
  └── privacy-circuits
        └── ark-bn254, ark-groth16, ark-r1cs-std, ark-relations

merchant-api
  ├── privacy-circuits
  ├── axum, tokio, tower-http
  ├── aes-gcm, chrono
  └── (shell: soroban CLI)

privacy-cli
  └── privacy-circuits
      └── (shell: soroban CLI)

privacy-contract (no_std WASM)
  └── soroban-sdk
      └── bn254 host functions

privacy-utils (unused stubs)
```

---

## 13. Deployment Architecture

```
                    ┌─────────────────┐
                    │   Vercel CDN    │
                    │  (dashboard)    │
                    └────────┬────────┘
                             │ HTTPS
                    ┌────────▼────────┐
                    │  merchant-api   │
                    │  (Axum :3000)   │
                    │  Rust binary    │
                    └───┬────────┬───┘
                        │        │
               ┌────────▼──┐ ┌──▼──────────┐
               │ Soroban   │ │ Filesystem   │
               │ Contract  │ │ merchant_data│
               │ (testnet) │ │              │
               └───────────┘ └──────────────┘
```

### Future Deployment

```
Cloud provider (Railway/Render/Fly):
  - merchant-api as a web service
  - CONTRACT_ID env var pointing to mainnet
  - Persistent volume for merchant_data/
  - soroban CLI bundled in Docker image

Frontend:
  - Vercel or Cloudflare Pages
  - VITE_API_URL pointing to cloud API
  - VITE_CONTRACT_ID for contract address
```

---

## 14. Error Handling Strategy

| Layer | Strategy |
|-------|----------|
| Circuit | `SynthesisError` on constraint failure, `Result` returns |
| Contract | `VerifierError` enum, panics via `require!()` macro |
| API | Axum `IntoResponse` with JSON error bodies |
| WASM | `Result<JsValue, JsValue>` → JavaScript exception |
| CLI | `eprintln!` error messages, process exit codes |
