import { useState, useEffect, useCallback } from 'react'
import { initWasm, generateProofClientSide } from '../services/wasmClient'
import { MerchantAPI } from '../services/api'
import type { ProofResult, ProvingKeyInfo } from '../types'

type Step = 'init' | 'fetch-pk' | 'generate' | 'result' | 'submitting' | 'done' | 'error'

export default function PaymentDemo() {
  const [wasmStatus, setWasmStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [seedHex, setSeedHex] = useState('')
  const [amount, setAmount] = useState('')
  const [pkInfo, setPkInfo] = useState<ProvingKeyInfo | null>(null)
  const [proof, setProof] = useState<ProofResult | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [_step, setStep] = useState<Step>('init')

  useEffect(() => {
    initWasm()
      .then(() => setWasmStatus('ready'))
      .catch(() => setWasmStatus('error'))
  }, [])

  const handleFetchPk = useCallback(async () => {
    if (!seedHex.trim()) return
    setStep('fetch-pk')
    setError(null)
    try {
      const info = await MerchantAPI.getProvingKey(seedHex.trim())
      setPkInfo(info)
      setStep('generate')
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch proving key')
      setStep('error')
    }
  }, [seedHex])

  const handleGenerateProof = useCallback(async () => {
    if (!pkInfo || !amount) return
    setStep('generate')
    setError(null)

    const customerSecret = crypto.getRandomValues(new Uint8Array(32))
    const secretHex = Array.from(customerSecret).map(b => b.toString(16).padStart(2, '0')).join('')

    try {
      const result = generateProofClientSide(
        pkInfo.pk_hex,
        secretHex,
        BigInt(Math.round(parseFloat(amount) * 100)),
        pkInfo.merchant_id,
      )
      setProof(result)
      setStep('result')
    } catch (e: any) {
      setError(e?.message || 'Proof generation failed')
      setStep('error')
    }
  }, [pkInfo, amount])

  const handleSubmit = useCallback(async () => {
    if (!proof || !pkInfo || !amount) return
    setStep('submitting')
    setError(null)
    try {
      const res = await MerchantAPI.submitProof({
        seed: seedHex.trim(),
        a: proof.a,
        b: proof.b,
        c: proof.c,
        nullifier: proof.nullifier,
        commitment: proof.commitment,
        amount: Math.round(parseFloat(amount) * 100),
        customer_id: 'demo-customer',
      })
      if (res.success) {
        setTxHash(res.tx_hash || null)
        setStep('done')
      } else {
        setError(res.error || 'Submission failed')
        setStep('error')
      }
    } catch (e: any) {
      setError(e?.message || 'Submission failed')
      setStep('error')
    }
  }, [proof, pkInfo, amount, seedHex])

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Payment Stream</h1>
        <p className="text-sm text-gray-400 mt-1">
          Generate a Groth16 zero-knowledge proof entirely in the browser using WASM.
          Your secret never leaves this device.
        </p>
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-gray-300">WASM Status:</span>
          {wasmStatus === 'loading' && <span className="text-yellow-400">Loading ZK prover...</span>}
          {wasmStatus === 'ready' && <span className="text-green-400">Ready — proofs generate locally</span>}
          {wasmStatus === 'error' && <span className="text-red-400">Failed to load WASM module</span>}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">1. Fetch Merchant Proving Key</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Merchant seed hex (64 chars)"
              value={seedHex}
              onChange={e => setSeedHex(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500/50"
            />
            <button
              onClick={handleFetchPk}
              disabled={!seedHex.trim() || wasmStatus !== 'ready'}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-400 disabled:opacity-50 transition-colors cursor-pointer"
            >
              Fetch PK
            </button>
          </div>
        </div>

        {pkInfo && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">2. Enter Payment Amount</h2>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Amount (e.g. 42.00)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500/50"
              />
              <button
                onClick={handleGenerateProof}
                disabled={!amount || parseFloat(amount) <= 0}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-400 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Generate Proof (in browser)
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              The proof is generated client-side via WASM. Your customer secret is never sent to the server.
            </p>
          </div>
        )}

        {proof && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">3. Proof Generated</h2>
            <div className="space-y-2 text-sm font-mono">
              <div><span className="text-gray-500">nullifier:</span> <span className="text-gray-300 break-all">{proof.nullifier}</span></div>
              <div><span className="text-gray-500">commitment:</span> <span className="text-gray-300 break-all">{proof.commitment}</span></div>
              <div><span className="text-gray-500">proof.a:</span> <span className="text-gray-300 break-all text-xs">{proof.a}</span></div>
            </div>
            <button
              onClick={handleSubmit}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-400 transition-colors cursor-pointer"
            >
              Submit to Contract
            </button>
          </div>
        )}

        {txHash && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-green-400 mb-2">Payment Submitted</h2>
            <p className="text-sm text-green-300 font-mono break-all">Tx: {txHash}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
