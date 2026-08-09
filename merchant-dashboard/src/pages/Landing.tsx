import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const heroImage = 'https://images.pexels.com/photos/14433577/pexels-photo-14433577.jpeg?auto=compress&cs=tinysrgb&h=900&w=700';
const marketImage = 'https://images.pexels.com/photos/30019690/pexels-photo-30019690.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const merchantWoman = 'https://images.pexels.com/photos/37323281/pexels-photo-37323281.jpeg?auto=compress&cs=tinysrgb&h=900&w=700';
const electronicsShop = 'https://images.pexels.com/photos/11297769/pexels-photo-11297769.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const navItems = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Products', href: '#products' },
  { label: 'Cross-Border', href: '#cross-border' },
  { label: 'Vision', href: '#vision' },
  { label: 'MVP', href: '#mvp' },
];

const problems = [
  { icon: 'Multiple currencies', desc: 'Different money systems across borders' },
  { icon: 'High fees', desc: 'Intermediaries take a cut at every step' },
  { icon: 'Slow settlement', desc: 'Payments can take days to arrive' },
  { icon: 'Bank restrictions', desc: 'Limited access to international rails' },
  { icon: 'Complex onboarding', desc: 'Hard for merchants to accept foreign payments' },
  { icon: 'Missing infrastructure', desc: 'No bridge between digital assets and physical commerce' },
];

const products = [
  {
    name: 'Aframp Pay',
    tagline: 'The merchant-facing payment system',
    description: 'Merchants generate payment requests, display QR codes, receive Stellar payments, view transactions, issue digital receipts, track revenue, and manage multiple payment methods.',
    features: ['Payment request generation', 'QR code display', 'Receive Stellar payments', 'Digital receipts', 'Revenue tracking', 'Multiple payment methods'],
  },
  {
    name: 'Aframp Wallet',
    tagline: 'A wallet built for spending, not just holding',
    description: 'A consumer wallet designed around actually using digital assets. Hold supported assets, send payments, scan merchant QR codes, receive payments, and view transaction history.',
    features: ['Hold supported assets', 'Send payments', 'Scan merchant QR codes', 'Receive payments', 'Transaction history', 'Pay businesses'],
  },
  {
    name: 'Aframp Business',
    tagline: 'For businesses that need more than a terminal',
    description: 'A merchant dashboard with sales analytics, transaction history, payment reconciliation, employee accounts, multiple merchant locations, invoices, and settlement management.',
    features: ['Sales analytics', 'Payment reconciliation', 'Employee accounts', 'Multiple locations', 'Invoices', 'Settlement management'],
  },
  {
    name: 'Aframp API',
    tagline: 'The infrastructure layer',
    description: 'Other African fintechs, marketplaces, wallets, and businesses can integrate Aframp instead of building their own Stellar payment infrastructure from scratch.',
    features: ['REST API access', 'Payment processing', 'Settlement services', 'Enterprise infrastructure', 'Cross-border payments', 'Custom integrations'],
  },
];

const steps = [
  { num: '01', title: 'Merchant creates a request', desc: 'The merchant enters the amount — say ₦10,000 for electronics. Aframp generates a payment request and QR code instantly.' },
  { num: '02', title: 'Customer scans the QR code', desc: 'The customer opens a compatible Stellar wallet and scans the code. No addresses, no network details, no complexity.' },
  { num: '03', title: 'Payment settles through Stellar', desc: 'The transaction is submitted to the Stellar network. Aframp detects and verifies it on the merchant\'s behalf.' },
  { num: '04', title: 'Merchant gets instant confirmation', desc: 'The merchant sees "Payment received" with the naira equivalent. No blockchain explorer needed.' },
];

const stellarUses = [
  'Payment settlement',
  'Cross-border transfers',
  'Stablecoin transactions',
  'Merchant payment addresses',
  'Transaction verification',
  'Asset transfers',
];

const visionPlaces = [
  'Shops', 'Restaurants', 'Hotels', 'Pharmacies',
  'Market businesses', 'Service providers', 'Online merchants', 'Freelancers',
  'Cross-border businesses',
];

const revenueStreams = [
  'Merchant transaction fees',
  'Payment processing fees',
  'Business subscriptions',
  'API usage',
  'Settlement services',
  'Enterprise merchant infrastructure',
  'Cross-border payment services',
];

const mvpFeatures = [
  'Merchant account',
  'Payment request generation',
  'QR-based payment',
  'Stellar transaction creation',
  'Transaction monitoring',
  'Payment confirmation',
  'Merchant transaction history',
];

const stats = [
  { value: '5M+', label: 'Potential merchants across Africa' },
  { value: '<5s', label: 'Stellar settlement time' },
  { value: '12', label: 'African countries in scope' },
  { value: '0', label: 'Blockchain knowledge required' },
];

const footerGroups = [
  { title: 'Products', links: ['Aframp Pay', 'Aframp Wallet', 'Aframp Business', 'Aframp API'] },
  { title: 'Developers', links: ['Documentation', 'API Reference', 'Integration Guide', 'Status'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
  { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance'] },
];

export default function Landing() {
  return (
    <main className="w-full bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <a href="#" className="inline-flex shrink-0 items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f2e1a]">
              <svg className="h-5 w-5 text-[#13ec5b]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35M7.5 21V5.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21M2.25 9.35l8.78-5.79a.75.75 0 01.85 0l8.78 5.79" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0f2e1a]">Aframp</span>
          </a>
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-medium text-gray-600 transition-colors hover:text-[#0f2e1a]">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="inline-flex shrink-0 items-center gap-3">
            <Link to="/dashboard">
              <Button type="button" variant="ghost" className="h-10 rounded-lg px-5 text-sm font-semibold text-[#0f2e1a] hover:bg-gray-50">
                Log In
              </Button>
            </Link>
            <Link to="/onboard">
              <Button type="button" className="h-10 rounded-lg bg-[#0f2e1a] px-5 text-sm font-semibold text-white hover:bg-[#1a4530] transition-colors">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f0fdf4] via-white to-white">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#13ec5b]/5 blur-[100px]" />
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:items-center lg:gap-16 lg:py-28 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex w-full max-w-xl flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0f2e1a]/10 bg-[#0f2e1a]/5 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#13ec5b]" />
              <span className="text-xs font-semibold text-[#0f2e1a]">Building the POS Network for Stellar in Africa</span>
            </div>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[#0f2e1a] sm:text-5xl lg:text-6xl">
              The payment network
              <br />for everyday
              <br /><span className="text-[#16a34a]">African commerce</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-gray-600">
              Aframp brings Stellar-powered payments into the physical shops, restaurants, and markets
              that Nigerians already use every day. Merchants generate a QR code. Customers scan and pay.
              No blockchain knowledge required.
            </p>
            <div className="flex w-full flex-wrap items-center gap-3 pt-2">
              <Link to="/onboard">
                <Button className="h-12 min-w-[160px] rounded-xl bg-[#0f2e1a] px-7 text-base font-semibold text-white hover:bg-[#1a4530] transition-colors">
                  Become a Merchant
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="outline" className="h-12 min-w-[160px] rounded-xl border-gray-200 bg-white px-7 text-base font-semibold text-[#0f2e1a] hover:bg-gray-50">
                  See How It Works
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-3 pt-4">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#0f2e1a]/10">
                    <span className="text-xs font-bold text-[#0f2e1a]">{String.fromCharCode(65 + i)}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">Join thousands of businesses accepting digital payments</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative flex w-full max-w-md flex-col items-center">
            <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl shadow-gray-300/50">
              <img src={heroImage} alt="Merchant in a Nigerian market" className="h-[480px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2e1a]/40 via-transparent to-transparent" />
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="absolute bottom-6 left-6 right-6">
                <Card className="border-0 bg-white/95 shadow-xl backdrop-blur-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#16a34a]/10">
                      <svg className="h-6 w-6 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs font-medium text-gray-500">Payment Received</p>
                      <p className="text-lg font-bold text-[#0f2e1a]">₦10,000.00</p>
                      <p className="text-xs text-gray-400">Settled via Stellar · just now</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }} className="absolute -right-4 top-8 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
              <svg className="h-5 w-5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" /></svg>
              <span className="text-xs font-semibold text-[#0f2e1a]">Scan to Pay</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full border-y border-gray-100 bg-[#0f2e1a] py-12">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 px-6 lg:flex-row lg:justify-between lg:px-10">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <p className="text-3xl font-bold text-[#13ec5b] sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Problem */}
      <section className="w-full bg-white py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex max-w-2xl flex-col items-center text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">The Problem</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
              The infrastructure connecting digital assets
              <br />to physical commerce is still missing
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Africa has huge everyday commerce through physical businesses, but most payment infrastructure
              is built around individual national payment systems. Accepting money from another country — or
              from abroad — can be complicated, slow, and expensive.
            </p>
          </motion.div>
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((p, i) => (
              <motion.div key={p.icon} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="h-full rounded-2xl border border-gray-100 bg-[#f7faf8] transition-all hover:border-[#16a34a]/30 hover:shadow-lg">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f2e1a] text-[#13ec5b]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0f2e1a]">{p.icon}</h3>
                      <p className="mt-1 text-sm text-gray-600">{p.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex max-w-3xl items-center gap-4 rounded-2xl border border-[#16a34a]/20 bg-[#f0fdf4] p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#16a34a]/15">
              <svg className="h-6 w-6 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            </div>
            <p className="text-sm leading-relaxed text-[#0f2e1a]">
              <span className="font-bold">Stablecoins and blockchain networks have shown that money can move globally faster and more efficiently.</span> Aframp is designed to be the bridge between those digital assets and everyday physical commerce.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Aframp Does */}
      <section id="how-it-works" className="w-full bg-[#f7faf8] py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex max-w-2xl flex-col items-center text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">What Aframp Does</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
              Customer scans. Payment settles.
              <br />Merchant gets paid.
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Aframp sits between the merchant, the consumer, and the Stellar network. The technology
              underneath is Stellar. The experience feels like any payment terminal a Nigerian merchant
              already knows.
            </p>
          </motion.div>

          {/* Lagos merchant example */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl shadow-gray-300/50">
                <img src={merchantWoman} alt="Merchant in Lagos" className="h-[420px] w-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 flex flex-col gap-1 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-xl">
                <p className="text-xs text-gray-500">A small merchant in Lagos</p>
                <p className="text-lg font-bold text-[#0f2e1a]">₦10,000 — Electronics</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold text-[#0f2e1a]">From the merchant's perspective</h3>
              <div className="flex flex-col gap-4">
                {[
                  { step: 'Merchant opens Aframp Pay', detail: 'Enters ₦10,000 — Payment for electronics' },
                  { step: 'Aframp generates a QR code', detail: 'Payment request displayed instantly' },
                  { step: 'Customer scans with their wallet', detail: 'Payment sent through Stellar' },
                  { step: 'Aframp verifies and confirms', detail: 'Merchant sees instant payment confirmation' },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0f2e1a] text-xs font-bold text-[#13ec5b]">{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-[#0f2e1a]">{s.step}</p>
                      <p className="text-sm text-gray-500">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-[#0f2e1a] px-5 py-4">
                <span className="text-sm font-semibold text-white">Customer</span>
                <svg className="h-4 w-8 text-[#13ec5b]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                <span className="text-sm font-semibold text-white">Scan</span>
                <svg className="h-4 w-8 text-[#13ec5b]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                <span className="text-sm font-semibold text-white">Pay</span>
                <svg className="h-4 w-8 text-[#13ec5b]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                <span className="text-sm font-semibold text-[#13ec5b]">Confirmed</span>
              </div>
            </div>
          </motion.div>

          {/* Steps */}
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative flex flex-col items-start">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f2e1a] text-sm font-bold text-[#13ec5b]">{step.num}</span>
                  {i < steps.length - 1 && <div className="hidden h-px flex-1 bg-gradient-to-r from-[#0f2e1a]/20 to-transparent lg:block" />}
                </div>
                <h3 className="mt-4 text-base font-bold text-[#0f2e1a]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Start With POS */}
      <section className="w-full bg-white py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex max-w-2xl flex-col items-center text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">Why Start With POS?</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
              Upgrading a behavior
              <br />Nigerians already understand
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Aframp isn't trying to convince Africa to completely change how it pays. The technology
              underneath changes, but the experience remains familiar.
            </p>
          </motion.div>
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { quote: 'Give me your account number.', label: 'What Nigerians know' },
              { quote: 'Transfer to this account.', label: 'What Nigerians know' },
              { quote: 'Use the POS.', label: 'What Nigerians know' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full rounded-2xl border border-gray-100 bg-[#f7faf8]">
                  <CardContent className="flex h-full flex-col items-start gap-3 p-7">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{item.label}</span>
                    <p className="text-lg font-medium text-[#0f2e1a]">"{item.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex w-full max-w-2xl flex-col items-center gap-4 rounded-3xl border-2 border-[#16a34a] bg-[#f0fdf4] p-10 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#16a34a]">Aframp introduces another option</p>
            <p className="text-3xl font-bold text-[#0f2e1a]">"Scan and pay."</p>
            <p className="text-sm text-gray-600">This could allow Stellar to move from being something primarily used by crypto users into infrastructure supporting real-world transactions between merchants and consumers.</p>
          </motion.div>
        </div>
      </section>

      {/* Cross-Border Commerce */}
      <section id="cross-border" className="w-full bg-[#0f2e1a] py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex max-w-2xl flex-col items-center text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#13ec5b]">Cross-Border Commerce</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pay across borders
              <br />like a local POS payment
            </h2>
            <p className="mt-5 text-lg text-gray-400">
              The larger opportunity is cross-border payments. A customer from Ghana visiting Nigeria
              could pay a Nigerian merchant using a supported Stellar asset — no currency exchange,
              no bank intermediaries.
            </p>
          </motion.div>

          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <img src={marketImage} alt="African market merchant" className="h-[400px] w-full object-cover" />
              </div>
              <div className="absolute -bottom-4 left-6 flex gap-2">
                {['NG', 'GH', 'KE', 'ZA'].map((code, i) => (
                  <motion.div key={code} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0f2e1a] px-3 py-2 shadow-lg">
                    <span className="h-2 w-2 rounded-full bg-[#13ec5b]" />
                    <span className="text-xs font-bold text-white">{code}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col gap-6">
              <h3 className="text-2xl font-bold text-white">This changes the role of a blockchain wallet</h3>
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Instead of</p>
                  <p className="mt-2 text-lg font-semibold text-gray-300">Wallet → Hold assets</p>
                </div>
                <div className="flex items-center justify-center">
                  <svg className="h-6 w-6 text-[#13ec5b]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
                </div>
                <div className="rounded-2xl border border-[#13ec5b]/30 bg-[#13ec5b]/10 p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#13ec5b]">Aframp is aiming for</p>
                  <p className="mt-2 text-lg font-semibold text-white">Wallet → Pay merchants → Buy goods → Pay services → Move money across borders</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">That is a much larger payment network.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="w-full bg-white py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex max-w-2xl flex-col items-center text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">Aframp Is Not Just a Wallet</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
              A complete payment infrastructure
              <br />for African commerce
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              The wallet is only one component. The long-term Aframp platform consists of several layers —
              from the merchant terminal to the consumer wallet to the API that powers other fintechs.
            </p>
          </motion.div>

          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            {products.map((product, i) => (
              <motion.div key={product.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="group h-full overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-[#16a34a]/30 hover:shadow-xl hover:shadow-gray-200/60">
                  <CardContent className="flex h-full flex-col items-start gap-5 p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f2e1a] text-[#13ec5b]">{i + 1}</div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0f2e1a]">{product.name}</h3>
                        <p className="text-sm font-medium text-[#16a34a]">{product.tagline}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
                    <ul className="mt-auto grid w-full grid-cols-2 gap-2 pt-2">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="h-4 w-4 shrink-0 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Where Stellar Fits */}
      <section className="w-full bg-[#f7faf8] py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex max-w-2xl flex-col items-center text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">Where Stellar Fits</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
              Stellar is the infrastructure.
              <br />Aframp is the experience.
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Aframp isn't trying to make merchants become blockchain experts. The application layer
              hides the blockchain complexity from the merchant.
            </p>
          </motion.div>

          <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-[#0f2e1a]">Aframp uses Stellar for:</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {stellarUses.map((use) => (
                  <div key={use} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#16a34a]/10">
                      <svg className="h-4 w-4 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <span className="text-sm font-medium text-[#0f2e1a]">{use}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 rounded-2xl border border-[#16a34a]/20 bg-[#f0fdf4] p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16a34a]/15">
                    <svg className="h-5 w-5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 11.833L18 12l-.259-.167a2.25 2.25 0 01-.824-.824L16.75 10.5l.167-.259a2.25 2.25 0 01.824-.824L18 9.25l.259.167a2.25 2.25 0 01.824.824l.167.259-.167.259a2.25 2.25 0 01-.824.824z" /></svg>
                  </div>
                  <p className="text-sm font-bold text-[#0f2e1a]">The central distinction</p>
                </div>
                <p className="text-lg font-bold text-[#0f2e1a]">Stellar should be the infrastructure. Aframp should be the experience.</p>
                <p className="text-sm text-gray-600">A merchant shouldn't have to think "I'm accepting a Stellar transaction." They should think "My customer just paid me."</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Example: Nigerian Merchant */}
      <section className="w-full bg-white py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex max-w-2xl flex-col items-center text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">Example: A Nigerian Merchant</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
              An electronics merchant in Abuja
            </h2>
          </motion.div>

          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="overflow-hidden rounded-3xl shadow-2xl shadow-gray-300/50">
                <img src={electronicsShop} alt="Electronics shop" className="h-[380px] w-full object-cover" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-[#0f2e1a]">Today, the merchant accepts:</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Cash', 'Bank transfers', 'Card payments', 'POS payments'].map((m) => (
                    <span key={m} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">{m}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f2e1a]">With Aframp, they additionally have:</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-[#16a34a]/30 bg-[#f0fdf4] px-3 py-1.5 text-xs font-bold text-[#16a34a]">Stellar payment option</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-[#f7faf8] p-6">
                {[
                  'A customer wants to buy a phone accessory',
                  'The merchant enters the amount',
                  'Aframp creates a QR code',
                  'The customer scans it',
                  'The Stellar transaction is submitted',
                  'Aframp monitors and confirms settlement',
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#0f2e1a] text-[10px] font-bold text-[#13ec5b]">{i + 1}</span>
                    <p className="text-sm text-gray-600">{s}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[#0f2e1a] px-5 py-4">
                <svg className="h-6 w-6 text-[#13ec5b]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                <p className="text-sm font-bold text-white">Payment received — ₦ equivalent</p>
              </div>
              <p className="text-sm text-gray-500">The merchant doesn't need to manually check a blockchain explorer. The experience feels like using any modern payment terminal.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Example: Cross-Border Payment */}
      <section className="w-full bg-[#f7faf8] py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex max-w-2xl flex-col items-center text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">Example: Cross-Border Payment</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
              An African customer buys from
              <br />a Nigerian business
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Customer has a Stellar stablecoin', desc: 'An African customer purchasing goods from a Nigerian business has a supported Stellar stablecoin in their wallet.' },
              { title: 'Merchant generates a request', desc: 'The Nigerian merchant generates a payment request through Aframp Pay.' },
              { title: 'Customer scans the QR code', desc: 'The customer scans the merchant\'s QR code with their compatible wallet.' },
              { title: 'Payment travels through Stellar', desc: 'The payment moves through the Stellar network — no intermediaries, no bank rails.' },
              { title: 'Aframp verifies the transaction', desc: 'Aframp detects and verifies the transaction on the merchant\'s behalf.' },
              { title: 'Merchant receives settlement', desc: 'The merchant receives the appropriate settlement representation. No international banking complexity.' },
            ].map((item, i) => (
              <Card key={i} className="h-full rounded-2xl border border-gray-100 bg-white">
                <CardContent className="flex h-full flex-col items-start gap-3 p-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16a34a]/10 text-xs font-bold text-[#16a34a]">{i + 1}</span>
                  <h3 className="text-sm font-bold text-[#0f2e1a]">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex max-w-2xl items-center gap-4 rounded-2xl border border-[#16a34a]/20 bg-[#f0fdf4] p-6">
            <svg className="h-8 w-8 shrink-0 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
            <p className="text-sm leading-relaxed text-[#0f2e1a]">This is where Aframp becomes more interesting than simply building another crypto wallet — the entire experience happens without the merchant managing international banking rails.</p>
          </motion.div>
        </div>
      </section>

      {/* Long-Term Vision */}
      <section id="vision" className="w-full bg-white py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex max-w-2xl flex-col items-center text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">The Long-Term Vision</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
              A merchant acceptance network
              <br />for Stellar across Africa
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Today, Stellar has wallets. Aframp wants to help create more places where those wallets
              can actually be used. Every merchant becomes another point where the Stellar ecosystem
              interacts with the real economy.
            </p>
          </motion.div>

          <div className="flex w-full flex-wrap items-center justify-center gap-3">
            {visionPlaces.map((place, i) => (
              <motion.div key={place} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <span className="rounded-xl border border-gray-200 bg-[#f7faf8] px-5 py-2.5 text-sm font-semibold text-[#0f2e1a]">{place}</span>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="rounded-2xl border border-gray-100 bg-[#f7faf8]">
              <CardContent className="flex flex-col items-start gap-3 p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">The goal is not</p>
                <p className="text-xl font-semibold text-gray-500">"Get people to download Aframp."</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-2 border-[#16a34a] bg-[#f0fdf4]">
              <CardContent className="flex flex-col items-start gap-3 p-8">
                <p className="text-xs font-bold uppercase tracking-wider text-[#16a34a]">The goal is</p>
                <p className="text-xl font-bold text-[#0f2e1a]">"Make Stellar payments useful in everyday African commerce."</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Initial Market & Business Model */}
      <section className="w-full bg-[#f7faf8] py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Initial Market */}
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col gap-5">
              <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">Initial Market</p>
              <h2 className="text-2xl font-bold tracking-tight text-[#0f2e1a] sm:text-3xl">Starting with Nigeria</h2>
              <p className="text-base leading-relaxed text-gray-600">
                Nigeria is the starting point because of its large digital-payment ecosystem and widespread
                use of POS and bank-transfer payments. The first version focuses on validating the physical
                merchant payment experience.
              </p>
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white p-5">
                <span className="rounded-lg bg-[#0f2e1a] px-3 py-1.5 text-xs font-bold text-[#13ec5b]">Merchant</span>
                <svg className="h-4 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                <span className="rounded-lg bg-[#0f2e1a] px-3 py-1.5 text-xs font-bold text-[#13ec5b]">QR / Payment request</span>
                <svg className="h-4 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                <span className="rounded-lg bg-[#0f2e1a] px-3 py-1.5 text-xs font-bold text-[#13ec5b]">Stellar</span>
                <svg className="h-4 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                <span className="rounded-lg bg-[#16a34a] px-3 py-1.5 text-xs font-bold text-white">Confirmation</span>
              </div>
              <p className="text-sm text-gray-500">Start narrow, prove the merchant experience, then expand the network into other African markets and cross-border corridors.</p>
            </motion.div>

            {/* Business Model */}
            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col gap-5">
              <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">Business Model</p>
              <h2 className="text-2xl font-bold tracking-tight text-[#0f2e1a] sm:text-3xl">Revenue through payment infrastructure</h2>
              <p className="text-base leading-relaxed text-gray-600">
                Aframp generates revenue through payment infrastructure rather than simply charging consumers
                for holding or sending money — keeping payment costs low enough for small African merchants.
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {revenueStreams.map((stream) => (
                  <div key={stream} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-white px-4 py-3">
                    <svg className="h-4 w-4 shrink-0 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    <span className="text-xs font-medium text-[#0f2e1a]">{stream}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why This Matters for Stellar */}
      <section className="w-full bg-[#0f2e1a] py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex max-w-2xl flex-col items-center text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#13ec5b]">Why This Matters for Stellar</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Increasing the number of real-world places
              <br />where Stellar can be used
            </h2>
            <p className="mt-5 text-lg text-gray-400">
              If a consumer has a Stellar wallet but cannot use it at a physical business, adoption remains
              limited. Aframp approaches adoption from the opposite direction.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex w-full max-w-3xl flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="flex flex-wrap items-center justify-center gap-3 text-center">
              <span className="rounded-xl bg-[#13ec5b]/10 px-5 py-3 text-sm font-bold text-[#13ec5b]">Onboard merchants</span>
              <svg className="h-5 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              <span className="rounded-xl bg-[#13ec5b]/10 px-5 py-3 text-sm font-bold text-[#13ec5b]">Create payment acceptance</span>
              <svg className="h-5 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
              <span className="rounded-xl bg-[#13ec5b]/10 px-5 py-3 text-sm font-bold text-[#13ec5b]">Give consumers a reason to use Stellar</span>
            </div>
            <p className="text-center text-sm text-gray-400">A merchant network can create organic demand for wallets and Stellar assets. That makes Aframp fundamentally a payments adoption project.</p>
          </motion.div>
        </div>
      </section>

      {/* Current Stage / MVP */}
      <section id="mvp" className="w-full bg-white py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex max-w-2xl flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#16a34a]/20 bg-[#f0fdf4] px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#16a34a] animate-pulse" />
              <span className="text-xs font-semibold text-[#16a34a]">MVP Development Stage</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
              Building the first working version
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              The immediate objective is to build the first working version of the merchant payment experience
              and validate it with real users and merchants.
            </p>
          </motion.div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mvpFeatures.map((feature, i) => (
              <motion.div key={feature} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Card className="h-full rounded-2xl border border-gray-100 bg-[#f7faf8] transition-all hover:border-[#16a34a]/30 hover:shadow-md">
                  <CardContent className="flex h-full flex-col items-start gap-3 p-5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f2e1a] text-xs font-bold text-[#13ec5b]">{i + 1}</span>
                    <p className="text-sm font-semibold text-[#0f2e1a]">{feature}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex max-w-3xl items-center gap-4 rounded-2xl border border-gray-100 bg-[#f7faf8] p-6">
            <svg className="h-8 w-8 shrink-0 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h6m-6 0v-3.375c0-.621-.504-1.125-1.125-1.125h-3.75c-.621 0-1.125.504-1.125 1.125v3.375m6 0H7.5m6 0v3.375c0 .621-.504 1.125-1.125 1.125H6.375c-.621 0-1.125-.504-1.125-1.125V16.875m6 0V13.5m-6 3.375V13.5m6 0h-6m6 0h6" /></svg>
            <p className="text-sm leading-relaxed text-gray-600">After validating those fundamentals, the platform can expand into settlement, merchant analytics, physical POS hardware, cross-border corridors, and APIs.</p>
          </motion.div>
        </div>
      </section>

      {/* The Bigger Idea */}
      <section className="w-full bg-[#0f2e1a] py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex max-w-3xl flex-col items-center text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-[#13ec5b]">The Bigger Idea</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Make the blockchain disappear
              <br />from the user's experience
            </h2>
          </motion.div>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { before: 'A merchant thinks:', beforeQuote: '"I\'m accepting a Stellar transaction."', after: 'They should think:', afterQuote: '"My customer just paid me."' },
              { before: 'A customer thinks:', beforeQuote: '"I\'m interacting with a blockchain."', after: 'They should think:', afterQuote: '"I scanned the code and paid."' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{item.before}</p>
                  <p className="mt-1 text-base text-gray-400">{item.beforeQuote}</p>
                </div>
                <div className="h-px bg-white/10" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#13ec5b]">{item.after}</p>
                  <p className="mt-1 text-lg font-bold text-white">{item.afterQuote}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="text-lg leading-relaxed text-gray-300">
              The blockchain is the infrastructure underneath. The merchant experience is the product.
              And the larger vision is to build a network where <span className="font-bold text-white">a person can walk into a business anywhere in Africa, pay digitally, and move value across borders as easily as they make a local POS payment today.</span>
            </p>
            <p className="text-2xl font-bold text-[#13ec5b]">That is Aframp.</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-white py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-[#f0fdf4] to-white p-10 text-center md:p-16">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#13ec5b]/8 blur-[80px]" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#16a34a]/8 blur-[80px]" />
            <div className="relative flex max-w-2xl flex-col items-center gap-6">
              <h2 className="text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
                Make Stellar payments useful in
                <br />everyday African commerce
              </h2>
              <p className="text-lg text-gray-600">
                Join the merchant acceptance network bringing blockchain payments to physical businesses
                across Africa. Start with Nigeria. Expand from there.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link to="/onboard">
                  <Button className="h-12 min-w-[180px] rounded-xl bg-[#0f2e1a] px-7 text-base font-semibold text-white hover:bg-[#1a4530] transition-colors">
                    Become a Merchant
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" className="h-12 min-w-[180px] rounded-xl border-gray-200 bg-white px-7 text-base font-semibold text-[#0f2e1a] hover:bg-gray-50">
                    Explore Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-gray-100 bg-[#0f2e1a]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-6 py-14 lg:px-10">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-start">
            <section className="flex max-w-sm flex-col items-start gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <svg className="h-4 w-4 text-[#13ec5b]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35M7.5 21V5.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21M2.25 9.35l8.78-5.79a.75.75 0 01.85 0l8.78 5.79" /></svg>
                </div>
                <h2 className="text-lg font-bold text-white">Aframp</h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                Building the POS network for Stellar in Africa. Making blockchain payments useful in everyday
                commerce — starting with Nigeria.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10">
                  <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10">
                  <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.354.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.354 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.354-2.618-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10">
                  <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </button>
              </div>
            </section>
            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4 sm:gap-x-12 lg:gap-x-16">
              {footerGroups.map((group) => (
                <div key={group.title} className="flex flex-col items-start gap-4">
                  <h3 className="text-sm font-bold text-white">{group.title}</h3>
                  <ul className="flex flex-col items-start gap-3">
                    {group.links.map((link) => (
                      <li key={link}>
                        <button type="button" className="text-left text-sm text-gray-400 transition-colors hover:text-white">{link}</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div className="flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Aframp. Building the POS network for Stellar in Africa.</p>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#13ec5b]" aria-hidden="true" />
              <p className="text-sm text-gray-500">Systems Operational</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
