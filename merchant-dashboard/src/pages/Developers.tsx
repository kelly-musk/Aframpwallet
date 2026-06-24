import { Link } from 'react-router-dom';

const sections = [
  {
    title: 'Architecture Overview',
    content: `Aframp uses Groth16 zero-knowledge proofs on the BN254 elliptic curve. The prover (merchant) generates a proof that a payment is valid — correct merchant ID, unique nullifier, valid commitment, non-zero amount — without revealing any of these values to the blockchain. The Soroban smart contract verifies the proof using BN254 pairing checks exposed by Stellar Protocol 25+.`,
  },
  {
    title: 'Circuit Constraints',
    content: `The PaymentCircuit enforces four constraints:

1. merchant_id = secret × 2 (merchant identity derived from seed)
2. nullifier = secret + amount (unique per payment, prevents double-spend)
3. commitment = secret × amount × customer (binds payment to customer)
4. amount × amount_inv = 1 (non-zero amount check)`,
  },
  {
    title: 'Contract Interface',
    content: `The PrivacyPayment Soroban contract exposes four functions:

- initialize(vk) — Stores the verification key (called once during setup)
- verify_proof(proof, public_inputs) — Performs BN254 pairing check
- process_payment(merchant_id, nullifier, commitment, proof) — Verifies proof, checks nullifier, settles payment
- is_nullifier_used(nullifier) — Checks if a nullifier has been used`,
  },
  {
    title: 'Proof Format',
    content: `Groth16 proofs consist of three group elements:

- a: G1 point (64 hex bytes) — x || y
- b: G2 point (128 hex bytes) — x_im || x_re || y_im || y_re
- c: G1 point (64 hex bytes) — x || y

Public inputs are encoded as u256 decimal strings for contract submission.`,
  },
  {
    title: 'API Endpoints',
    content: `All endpoints are under /api/ prefix.

POST /api/merchant/create — Create a new merchant identity
POST /api/payment/generate-proof — Generate a ZK proof for a payment
POST /api/payment/verify — Verify a proof locally
POST /api/payment/submit-to-contract — Submit proof to Stellar contract
POST /api/compliance/report — Generate compliance report
POST /api/compliance/viewing-key — Generate viewing key for auditors
GET /api/dashboard/stats — Dashboard analytics
GET /api/merchant/:id — Merchant info
GET /api/balance/:id — Merchant balance
GET /api/export/transactions — CSV export`,
  },
  {
    title: 'CLI Usage',
    content: `The privacy-cli tool provides terminal-based interaction:

cargo run -p privacy-cli -- merchant
  Creates a new merchant and saves to .merchant/

cargo run -p privacy-cli -- init-contract <CONTRACT_ID>
  Initializes a deployed contract with the merchant's VK

cargo run -p privacy-cli -- proof
  Generates a proof for a payment (interactive prompts for amount and customer ID)

Environment variables:
  CONTRACT_ID — deployed contract address
  MERCHANT_SEED — fixed seed for deterministic merchant identity`,
  },
];

export default function Developers() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-navy-950">Developers</h1>
          <p className="mt-4 text-gray-600 text-lg">
            Integrate private Stellar payments into your application. Everything is open source and documented.
          </p>
        </div>
        <div className="space-y-12">
          {sections.map((s) => (
            <div key={s.title} className="prose prose-gray max-w-none">
              <h2 className="text-xl font-bold text-navy-900">{s.title}</h2>
              <pre className="whitespace-pre-wrap text-sm text-gray-600 leading-relaxed font-sans bg-gray-50 rounded-xl p-6 border border-gray-100 mt-4">
                {s.content}
              </pre>
            </div>
          ))}
        </div>
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 text-white text-center">
          <h2 className="text-2xl font-bold">Ready to build?</h2>
          <p className="mt-2 text-gray-300">Clone the repo and deploy your own privacy layer on Stellar testnet.</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/kelly-musk/Aframpwallet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-navy-900 font-medium hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </a>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-navy-700 text-white font-medium hover:bg-navy-600 transition-colors"
            >
              Launch Console
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
