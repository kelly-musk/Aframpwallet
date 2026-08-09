import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const heroImage = 'https://images.pexels.com/photos/14433577/pexels-photo-14433577.jpeg?auto=compress&cs=tinysrgb&h=900&w=700';
const marketImage = 'https://images.pexels.com/photos/30019690/pexels-photo-30019690.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const navItems = [
  { label: 'Aframp Pay', href: '#pay' },
  { label: 'Aframp Business', href: '#business' },
  { label: 'Aframp API', href: '#api' },
  { label: 'How It Works', href: '#how-it-works' },
];

const products = [
  {
    name: 'Aframp Pay',
    tagline: 'Accept Stellar payments at your counter',
    description: 'Generate payment requests and QR codes. Customers scan, pay through Stellar, and you get instant confirmation. No blockchain knowledge required.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
      </svg>
    ),
    features: ['Payment request generation', 'QR code display', 'Instant settlement', 'Digital receipts'],
  },
  {
    name: 'Aframp Wallet',
    tagline: 'A wallet built for spending',
    description: 'Not just holding assets — actually using them. Scan merchant QR codes, pay for goods and services, and move money across borders as easily as a local POS payment.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 013 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
      </svg>
    ),
    features: ['Scan and pay merchants', 'Hold supported assets', 'Transaction history', 'Cross-border payments'],
  },
  {
    name: 'Aframp Business',
    tagline: 'Manage and grow your operations',
    description: 'A merchant dashboard for businesses that need more than a simple terminal. Sales analytics, reconciliation, employee accounts, and multi-location support.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    features: ['Sales analytics', 'Payment reconciliation', 'Employee accounts', 'Multiple locations'],
  },
  {
    name: 'Aframp API',
    tagline: 'Build on Stellar payment infrastructure',
    description: 'Other African fintechs, marketplaces, and wallets can integrate Aframp instead of building their own Stellar payment infrastructure from scratch.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    features: ['REST API access', 'Payment processing', 'Settlement services', 'Enterprise infrastructure'],
  },
];

const steps = [
  {
    num: '01',
    title: 'Merchant creates a request',
    desc: 'The merchant enters the amount — say ₦10,000 for electronics. Aframp generates a payment request and QR code instantly.',
  },
  {
    num: '02',
    title: 'Customer scans the QR code',
    desc: 'The customer opens a compatible Stellar wallet and scans the merchant\'s QR code. No addresses, no network details, no complexity.',
  },
  {
    num: '03',
    title: 'Payment settles through Stellar',
    desc: 'The transaction is submitted to the Stellar network. Aframp detects and verifies it on the merchant\'s behalf.',
  },
  {
    num: '04',
    title: 'Merchant gets instant confirmation',
    desc: 'The merchant sees "Payment received" with the naira equivalent. No blockchain explorer needed — it feels like any modern payment terminal.',
  },
];

const stats = [
  { value: '5M+', label: 'Potential merchants across Africa' },
  { value: '<5s', label: 'Stellar settlement time' },
  { value: '12', label: 'African countries in scope' },
  { value: '0', label: 'Blockchain knowledge required' },
];

const crossBorderPoints = [
  'A customer from Ghana visits Nigeria and pays a Lagos merchant using a Stellar stablecoin — no currency exchange, no bank intermediaries.',
  'An African business serving customers across borders accepts payments without managing international banking rails.',
  'A freelancer in Nairobi receives payment from a client in Accra through the same familiar scan-and-pay experience.',
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
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-[#0f2e1a]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="inline-flex shrink-0 items-center gap-3">
            <Link to="/dashboard">
              <Button
                type="button"
                variant="ghost"
                className="h-10 rounded-lg px-5 text-sm font-semibold text-[#0f2e1a] hover:bg-gray-50"
              >
                Log In
              </Button>
            </Link>
            <Link to="/onboard">
              <Button
                type="button"
                className="h-10 rounded-lg bg-[#0f2e1a] px-5 text-sm font-semibold text-white hover:bg-[#1a4530] transition-colors"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f0fdf4] via-white to-white">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#13ec5b]/5 blur-[100px]" />
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-6 py-20 lg:flex-row lg:items-center lg:gap-16 lg:py-28 lg:px-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex w-full max-w-xl flex-col items-start gap-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0f2e1a]/10 bg-[#0f2e1a]/5 px-4 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#13ec5b]" />
              <span className="text-xs font-semibold text-[#0f2e1a]">
                Building the POS network for Stellar in Africa
              </span>
            </div>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[#0f2e1a] sm:text-5xl lg:text-6xl">
              The payment network
              <br />
              for everyday
              <br />
              <span className="text-[#16a34a]">African commerce</span>
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
                  <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  className="h-12 min-w-[160px] rounded-xl border-gray-200 bg-white px-7 text-base font-semibold text-[#0f2e1a] hover:bg-gray-50"
                >
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
              <p className="text-sm text-gray-500">
                Join thousands of businesses accepting digital payments
              </p>
            </div>
          </motion.div>

          {/* Right Content - Hero Image with Payment Card Overlay */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex w-full max-w-md flex-col items-center"
          >
            <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl shadow-gray-300/50">
              <img
                src={heroImage}
                alt="Merchant in a Nigerian market"
                className="h-[480px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2e1a]/40 via-transparent to-transparent" />

              {/* Payment confirmation card overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-6 left-6 right-6"
              >
                <Card className="border-0 bg-white/95 shadow-xl backdrop-blur-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#16a34a]/10">
                      <svg className="h-6 w-6 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
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

            {/* Floating QR badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -right-4 top-8 flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg"
            >
              <svg className="h-5 w-5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              </svg>
              <span className="text-xs font-semibold text-[#0f2e1a]">Scan to Pay</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full border-y border-gray-100 bg-[#0f2e1a] py-12">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 px-6 lg:flex-row lg:justify-between lg:px-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <p className="text-3xl font-bold text-[#13ec5b] sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="pay" className="w-full bg-white py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex max-w-2xl flex-col items-center text-center"
          >
            <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">
              The Aframp Platform
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
              Everything you need to accept
              <br />
              digital payments
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Aframp is not just a wallet. It's a complete payment infrastructure — from the merchant
              terminal to the consumer wallet to the API layer that powers other fintechs.
            </p>
          </motion.div>

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group h-full overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:border-[#16a34a]/30 hover:shadow-xl hover:shadow-gray-200/60">
                  <CardContent className="flex h-full flex-col items-start gap-5 p-7">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f2e1a] text-[#13ec5b] transition-colors group-hover:bg-[#16a34a] group-hover:text-white">
                      {product.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0f2e1a]">{product.name}</h3>
                      <p className="mt-1 text-sm font-medium text-[#16a34a]">{product.tagline}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>
                    <ul className="mt-auto flex w-full flex-col gap-2 pt-2">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-xs text-gray-500">
                          <svg className="h-4 w-4 shrink-0 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
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

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full bg-[#f7faf8] py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex max-w-2xl flex-col items-center text-center"
          >
            <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">
              How It Works
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
              Customer scans. Payment settles.
              <br />
              Merchant gets paid.
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              The technology underneath is Stellar. The experience feels like any payment terminal
              a Nigerian merchant already knows.
            </p>
          </motion.div>

          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col items-start"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f2e1a] text-sm font-bold text-[#13ec5b]">
                    {step.num}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-[#0f2e1a]/20 to-transparent lg:block" />
                  )}
                </div>
                <h3 className="mt-4 text-base font-bold text-[#0f2e1a]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Flow visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex w-full flex-col items-center gap-4 rounded-3xl border border-gray-100 bg-white p-8 md:flex-row md:justify-center md:gap-8"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f2e1a]/5">
                <svg className="h-7 w-7 text-[#0f2e1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6M2.25 9l3.75-4.5h12L21.75 9M2.25 9l3.75 4.5h12L21.75 9" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#0f2e1a]">Merchant</span>
            </div>
            <svg className="h-5 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f2e1a]/5">
                <svg className="h-7 w-7 text-[#0f2e1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#0f2e1a]">QR Code</span>
            </div>
            <svg className="h-5 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f2e1a]/5">
                <svg className="h-7 w-7 text-[#0f2e1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#0f2e1a]">Customer</span>
            </div>
            <svg className="h-5 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#16a34a]/10">
                <svg className="h-7 w-7 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#16a34a]">Confirmed</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cross-Border Section */}
      <section className="w-full bg-white py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-16 px-6 lg:px-10">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-start gap-6"
            >
              <p className="text-sm font-bold uppercase tracking-wider text-[#16a34a]">
                Cross-Border Commerce
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
                Pay across borders
                <br />
                like a local POS payment
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                Today, accepting money from another African country can mean multiple currencies,
                high fees, slow settlement, and bank restrictions. Aframp uses Stellar to make
                cross-border payments as simple as scanning a QR code.
              </p>
              <div className="flex w-full flex-col gap-4 pt-2">
                {crossBorderPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#16a34a]/10">
                      <svg className="h-3.5 w-3.5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="overflow-hidden rounded-3xl shadow-2xl shadow-gray-300/50">
                <img
                  src={marketImage}
                  alt="African market merchant"
                  className="h-[400px] w-full object-cover"
                />
              </div>
              {/* Country badges */}
              <div className="absolute -bottom-4 left-6 flex gap-2">
                {['NG', 'GH', 'KE', 'ZA'].map((code, i) => (
                  <motion.div
                    key={code}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
                    <span className="text-xs font-bold text-[#0f2e1a]">{code}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why POS Section */}
      <section className="w-full bg-[#0f2e1a] py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex max-w-2xl flex-col items-center text-center"
          >
            <p className="text-sm font-bold uppercase tracking-wider text-[#13ec5b]">
              Why Start With POS?
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Upgrading a behavior
              <br />
              Nigerians already understand
            </h2>
            <p className="mt-5 text-lg text-gray-400">
              Aframp isn't asking Africa to change how it pays. It's adding another option to
              something that already works: "Scan and pay."
            </p>
          </motion.div>

          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                title: 'Familiar Experience',
                desc: 'Nigerians already know "Use the POS" and "Transfer to this account." Aframp adds "Scan and pay" — same behavior, new technology underneath.',
                icon: (
                  <svg className="h-6 w-6 text-[#13ec5b]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                  </svg>
                ),
              },
              {
                title: 'No Blockchain Knowledge',
                desc: 'A merchant shouldn\'t have to think "I\'m accepting a Stellar transaction." They should think "My customer just paid me." The blockchain is infrastructure, not the product.',
                icon: (
                  <svg className="h-6 w-6 text-[#13ec5b]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Real-World Adoption',
                desc: 'The goal isn\'t "get people to download Aframp." It\'s making Stellar payments useful in everyday African commerce — shops, restaurants, pharmacies, markets, and service providers.',
                icon: (
                  <svg className="h-6 w-6 text-[#13ec5b]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m-4-9h4.5v9m-9-9h4.5v9" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardContent className="flex h-full flex-col items-start gap-4 p-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#13ec5b]/10 border border-[#13ec5b]/20">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-400">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-white py-24">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-[#f0fdf4] to-white p-10 text-center md:p-16"
          >
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#13ec5b]/8 blur-[80px]" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#16a34a]/8 blur-[80px]" />
            <div className="relative flex max-w-2xl flex-col items-center gap-6">
              <h2 className="text-3xl font-bold tracking-tight text-[#0f2e1a] sm:text-4xl">
                Make Stellar payments useful in
                <br />
                everyday African commerce
              </h2>
              <p className="text-lg text-gray-600">
                Join the merchant acceptance network bringing blockchain payments to physical
                businesses across Africa. Start with Nigeria. Expand from there.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link to="/onboard">
                  <Button className="h-12 min-w-[180px] rounded-xl bg-[#0f2e1a] px-7 text-base font-semibold text-white hover:bg-[#1a4530] transition-colors">
                    Become a Merchant
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    className="h-12 min-w-[180px] rounded-xl border-gray-200 bg-white px-7 text-base font-semibold text-[#0f2e1a] hover:bg-gray-50"
                  >
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
                  <svg className="h-4 w-4 text-[#13ec5b]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35M7.5 21V5.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21M2.25 9.35l8.78-5.79a.75.75 0 01.85 0l8.78 5.79" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-white">Aframp</h2>
              </div>
              <p className="text-sm leading-relaxed text-gray-400">
                Building the POS network for Stellar in Africa. Making blockchain payments useful
                in everyday commerce — starting with Nigeria.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10">
                  <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10">
                  <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.354.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.354 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.354-2.618-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10">
                  <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
              </div>
            </section>
            <nav
              aria-label="Footer navigation"
              className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4 sm:gap-x-12 lg:gap-x-16"
            >
              {footerGroups.map((group) => (
                <div key={group.title} className="flex flex-col items-start gap-4">
                  <h3 className="text-sm font-bold text-white">{group.title}</h3>
                  <ul className="flex flex-col items-start gap-3">
                    {group.links.map((link) => (
                      <li key={link}>
                        <button
                          type="button"
                          className="text-left text-sm text-gray-400 transition-colors hover:text-white"
                        >
                          {link}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
          <div className="flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Aframp. Building the POS network for Stellar in Africa.
            </p>
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
