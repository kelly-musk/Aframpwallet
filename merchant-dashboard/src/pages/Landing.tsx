import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium text-emerald-400">Now Live on Stellar Testnet</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
              <span className="block">Private Payments</span>
              <span className="block bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                On Stellar
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Wrap Stellar payments in zero-knowledge proofs. The blockchain sees only a validity proof and nullifier—nothing else. Your revenue, customers, and business relationships stay hidden.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center"
              >
                Get Started
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="https://github.com/kelly-musk/Aframpwallet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3 rounded-lg border border-gray-700 text-white font-bold hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">3-5s</div>
                <p className="text-xs text-gray-500 mt-1">Settlement Time</p>
              </div>
              <div className="w-px h-12 bg-gray-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">~0</div>
                <p className="text-xs text-gray-500 mt-1">Transaction Fees</p>
              </div>
              <div className="w-px h-12 bg-gray-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">100%</div>
                <p className="text-xs text-gray-500 mt-1">Verifiable</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="relative py-24 border-t border-gray-800 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">The Problem</h2>
            <p className="text-gray-400 text-lg">Every Stellar transaction is visible to the entire network</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/5">
              <h3 className="font-bold text-red-400 mb-3">Without Privacy</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Amount, sender, receiver public</li>
                <li>• Competitors see your revenue</li>
                <li>• Customer data exposed</li>
                <li>• No regulatory compliance path</li>
              </ul>
            </div>
            <div className="p-6 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
              <h3 className="font-bold text-emerald-400 mb-3">With Aframp</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Only validity proof on-chain</li>
                <li>• Zero knowledge revealed</li>
                <li>• Merchant controls data</li>
                <li>• Selective disclosure to regulators</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Why Aframp</h2>
            <p className="text-gray-400 text-lg">Privacy without compromises</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🔐',
                title: 'Complete Privacy',
                desc: 'Payment amounts, customer identities, and merchant relationships stay cryptographically hidden.',
              },
              {
                icon: '✓',
                title: 'Fraud-Proof',
                desc: 'Zero-knowledge proofs ensure validity without revealing sensitive data. Double-spending prevented via on-chain nullifiers.',
              },
              {
                icon: '⚖️',
                title: 'Regulatory Ready',
                desc: 'Selective disclosure via viewing keys lets you share details with regulators when needed.',
              },
              {
                icon: '⚡',
                title: 'Instant Settlement',
                desc: 'Built on Stellar — 3-5 second settlements with near-zero fees. No expensive gas.',
              },
              {
                icon: '🔑',
                title: 'No Trust Assumptions',
                desc: 'Merchant runs their own proving system. Your secret never leaves your control.',
              },
              {
                icon: '🔓',
                title: 'Open Source',
                desc: 'Fully auditable codebase. Built with arkworks Groth16 on BN254.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl border border-gray-800 hover:border-emerald-500/50 transition-all group hover:bg-black/50">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Four steps from setup to settlement</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Generate Merchant Key',
                desc: 'Create your merchant identity with cryptographically secure keys.',
              },
              {
                step: '02',
                title: 'Deploy Contract',
                desc: 'Deploy the Groth16 verifier to Stellar testnet.',
              },
              {
                step: '03',
                title: 'Customer Pays',
                desc: 'Generate zero-knowledge proof of payment.',
              },
              {
                step: '04',
                title: 'Verify & Settle',
                desc: 'Contract verifies proof and settles payment privately.',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -top-10 left-0 text-6xl font-bold text-emerald-500/20">{item.step}</div>
                <h3 className="text-lg font-bold mb-3 relative z-10">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/4 w-6 h-6 border-r-2 border-t-2 border-gray-700 transform rotate-45" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative py-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Built for Real Merchants</h2>
            <p className="text-gray-400 text-lg">Where payment privacy is a requirement</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'B2B Payments',
                desc: 'Hide revenue and terms from competitors.',
              },
              {
                title: 'Healthcare & Legal',
                desc: 'Sensitive services require financial privacy.',
              },
              {
                title: 'Luxury Retail',
                desc: 'High-value purchases with confidentiality.',
              },
              {
                title: 'Cross-Border Trade',
                desc: 'Private settlement without exposing volumes.',
              },
            ].map((useCase, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-gray-950 border border-gray-800 hover:border-emerald-500/50 transition-all">
                <h3 className="font-bold mb-2 text-white">{useCase.title}</h3>
                <p className="text-gray-400 text-sm">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 border-t border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready for Private Payments?</h2>
          <p className="text-gray-400 text-lg mb-12">
            Deploy your privacy layer on Stellar testnet in minutes. Full control, no intermediaries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/30"
            >
              Launch Console
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="https://github.com/kelly-musk/Aframpwallet#quick-start"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-lg border border-gray-700 text-white font-bold hover:border-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
            >
              Read Documentation
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-gray-400 text-sm">© 2024 Aframp. Zero-knowledge privacy meets Stellar.</p>
            </div>
            <div className="flex gap-6">
              <a href="https://github.com/kelly-musk/Aframpwallet#quick-start" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">Documentation</a>
              <a href="https://github.com/kelly-musk/Aframpwallet" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">GitHub</a>
              <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">Built on Stellar</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
