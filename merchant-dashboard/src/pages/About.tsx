import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
           <h1 className="text-4xl font-bold text-navy-950">About Aframp</h1>
          <p className="mt-4 text-gray-600 text-lg">
            Bringing financial privacy to the Stellar ecosystem through zero-knowledge cryptography.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-xl font-bold text-navy-900 mb-4">The Problem</h2>
            <p className="text-gray-600 leading-relaxed">
              Stellar is a fast, low-cost payment network — but every transaction is fully transparent. Amounts, addresses, and asset types are visible to anyone with access to the ledger. For merchants handling sensitive payments, this transparency is a liability.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Competitors can analyze your revenue. Customers lose financial privacy. Regulators require data protection that public blockchains don't natively provide.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy-900 mb-4">Our Solution</h2>
            <p className="text-gray-600 leading-relaxed">
              Aframp is a zero-knowledge privacy layer that wraps Stellar payments in cryptographic proofs. We use Groth16 — the same proving system powering major privacy protocols — to verify payment validity without exposing any sensitive data.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              The result: merchants accept payments with full confidentiality, regulators get selective disclosure via viewing keys, and the Stellar network processes transactions in seconds.
            </p>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-xl font-bold text-navy-900 mb-6">Technology Stack</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'arkworks 0.4', desc: 'Groth16 proving system on BN254' },
              { name: 'Soroban', desc: 'Stellar smart contract platform' },
              { name: 'BN254', desc: 'Elliptic curve with pairing support' },
              { name: 'Axum + Rust', desc: 'Merchant API backend' },
              { name: 'React + Vite', desc: 'Merchant console frontend' },
              { name: 'Tailwind CSS v4', desc: 'Utility-first styling' },
              { name: 'Chart.js', desc: 'Dashboard visualizations' },
              { name: 'React Query', desc: 'Real-time data sync' },
            ].map((tech) => (
              <div key={tech.name} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="font-semibold text-navy-900 text-sm">{tech.name}</p>
                <p className="text-xs text-gray-500 mt-1">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-10 rounded-2xl bg-gradient-to-br from-green-50 to-green-50 border border-green-100 text-center">
          <h2 className="text-2xl font-bold text-navy-950">Open Source</h2>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Aframp is fully open source under the MIT license. Audit the code, contribute improvements, or fork it for your own use case. Transparency is core to our mission.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-500 transition-colors"
            >
              Get Started
            </Link>
            <a
              href="https://github.com/kelly-musk/Aframpwallet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-green-200 text-green-700 font-medium hover:bg-green-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
