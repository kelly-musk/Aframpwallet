import { Link } from 'react-router-dom';

const featureGroups = [
  {
    title: 'Core Protocol',
    features: [
      {
        name: 'Groth16 Zero-Knowledge Proofs',
        desc: 'Industry-standard proving system on BN254 curve. Circuit enforces payment validity: correct merchant ID, unique nullifier, correct commitment, non-zero amount.',
      },
      {
        name: 'On-Chain Verifier',
        desc: 'Soroban smart contract verifies proofs via BN254 pairing checks. Gas-optimized using Stellar host functions (g1_msm, pairing_check, Neg).',
      },
      {
        name: 'Nullifier-Based Double Spend Protection',
        desc: 'Each payment generates a unique nullifier = secret + amount. The contract tracks used nullifiers, rejecting replay attacks.',
      },
      {
        name: 'Non-Interactive Verification',
        desc: 'Merchant generates the proof, submits to the contract. No back-and-forth with customer. Single-transaction settlement.',
      },
    ],
  },
  {
    title: 'Merchant Infrastructure',
    features: [
      {
        name: 'Merchant API Server',
        desc: 'REST API for creating merchants, generating proofs, verifying locally, and submitting to contract. CORS-enabled for frontend integration.',
      },
      {
        name: 'POS Client',
        desc: 'Terminal-based interactive client for generating and submitting proofs. Supports create, proof generation, verification, and contract submission.',
      },
      {
        name: 'Merchant Console',
        desc: 'Web dashboard with analytics, transaction history, compliance reporting, and merchant settings. Real-time data via React Query.',
      },
    ],
  },
  {
    title: 'Security & Compliance',
    features: [
      {
        name: 'ZK Circuit Enforcement',
        desc: 'Four constraints: secret × 2 = merchant_id, secret + amount = nullifier, secret × amount × customer = commitment, amount ≠ 0 (inverse check).',
      },
      {
        name: 'Selective Disclosure',
        desc: 'Regulatory viewing keys allow authorized auditors to decrypt specific transactions without compromising the merchant\'s master secret.',
      },
      {
        name: 'Permanent Merchant Identity',
        desc: 'Deterministic merchant_id = seed × 2. Same seed always produces the same merchant ID. Key rotation is possible by changing seeds.',
      },
    ],
  },
];

export default function Features() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-navy-950">Features</h1>
          <p className="mt-4 text-gray-600">
            Everything you need to accept private payments on Stellar — from the proving system to the merchant console.
          </p>
        </div>
        {featureGroups.map((group) => (
          <div key={group.title} className="mb-20">
            <h2 className="text-2xl font-bold text-navy-900 mb-8">{group.title}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {group.features.map((f) => (
                <div key={f.name} className="p-6 rounded-xl border border-gray-100 bg-white hover:shadow-md hover:border-navy-200 transition-all">
                  <h3 className="text-base font-semibold text-navy-900 mb-2">{f.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="text-center py-12 border-t border-gray-100">
          <p className="text-gray-500 mb-6">Ready to try it?</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-navy-900 text-white font-medium hover:bg-navy-800 transition-colors"
          >
            Launch Console
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
