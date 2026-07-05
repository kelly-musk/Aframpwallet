# Aframp — Demo Video Script

| Duration | ~3:00 |
|----------|-------|
| Style | Screen recording + voiceover + motion graphics |
| Tools | OBS/Loom for screen capture, AI voiceover (ElevenLabs, etc.), motion graphics (Canva, After Effects, or AI video tool) |

---

## SCENE 1: Hook — The Problem (0:00 – 0:30)

**Visual:** Split screen. Left: public blockchain explorer showing a visible transaction (amount, sender, receiver). Right: concerned business owner looking at screen.

**Narration:**
```
Every transaction on Stellar — the amount, the sender, the receiver — 
is visible to the entire network.

If you're a merchant, that means competitors can track your revenue. 
Your customers lose financial privacy on every purchase. 
And your B2B payments expose sensitive business relationships.

This isn't just inconvenient. It's a business liability.
```

**Visual:** Text overlay: "Your Revenue. Public." fades to "Your Customers. Exposed."

---

## SCENE 2: The Vision — HTTPS for Money (0:30 – 1:00)

**Visual:** Animated transition. The public blockchain view morphs into a shielded lock icon. Text appears: "HTTPS for Money."

**Narration:**
```
Aframp is building the privacy layer for everyday commerce. 

Think HTTPS for money.

HTTPS doesn't stop you from sending data — it encrypts it so only 
the right people can see it. Aframp does the same for payments.

Instead of exposing data, you expose proofs. The blockchain sees 
only a validity proof and a unique nullifier. Nothing else.
```

**Visual:** Show comparison table animation:
| Without Aframp | With Aframp |
| Amount, sender, receiver public | Only validity proof on-chain |
| Competitors see your volume | Zero knowledge revealed |
| Customer data exposed | Merchant controls via viewing keys |

---

## SCENE 3: How It Works — Architecture (1:00 – 1:30)

**Visual:** Simple animated flow diagram. Six numbered boxes connected by arrows.

**Narration:**
```
Here's how it works in six steps.

Step one: A merchant creates their identity on the platform. 
This generates a proving key and a verifying key using Groth16 — 
a zero-knowledge proof system over the BN254 elliptic curve.

Step two: When a customer wants to pay, they fetch the merchant's 
proving key. This is public — it only enables proof generation, 
not decryption.

Step three: In the customer's browser, a random secret is generated. 
This never leaves their device. The WASM prover computes a nullifier 
and a commitment, then generates a Groth16 proof.

Step four: The proof is submitted to a Soroban smart contract on 
the Stellar testnet. The contract performs BN254 pairing checks 
to verify the proof is valid.

Step five: The contract stores the nullifier, preventing any 
double-spend attempt with the same proof.

Step six: The merchant views decrypted payment details in their 
dashboard using a viewing key.
```

**Visual:** On each step, highlight the corresponding box. Step 3 shows a browser icon with "Secret stays here" badge. Step 4 shows a Stellar logo. Step 6 shows a dashboard screenshot.

---

## SCENE 4: Live Demo — Merchant Dashboard (1:30 – 2:00)

**Visual:** Screen recording. Open browser to aframpwallet.vercel.app.

**Narration:**
```
Let me show you the live demo.

Here's the landing page. You can see the dark, polished interface 
with the green accent palette. This explains the product vision 
and how private payments work.

Clicking Launch Console takes us to the onboarding flow. In five 
steps, a merchant creates their identity, generates keys, and 
configures their account.

Here's the dashboard. On the left, a sidebar with navigation. 
The main view shows total volume, transaction count, recent 
payments, and quick action links. All fetched from the merchant API.
```

**Visual:** Mouse cursor navigates: Landing → Launch Console → Onboarding wizard (click through 5 steps quickly) → Dashboard loads with stats cards.

---

## SCENE 5: Live Demo — Zero-Knowledge Proof in Browser (2:00 – 2:30)

**Visual:** Navigate to the /pay page. Show the proof generation form.

**Narration:**
```
Now for the most impressive part — generating a zero-knowledge proof
directly in the browser.

I enter a merchant seed, type an amount, and click Generate Proof.

The WASM module — compiled from Rust to WebAssembly at just 
237 kilobytes — runs the Groth16 prover right here in the browser. 
My secret never touches any server.

There's the result. A proof with three components — A, B, and C — 
plus a nullifier and commitment. All cryptographically generated 
on-device in under two seconds.

I can then submit this to the Soroban contract. The contract 
verifies the BN254 pairing checks and records the payment.
```

**Visual:** Type in seed field → Type "100" in amount → Click "Generate Proof" → Loading spinner → Results appear (a, b, c, nullifier, commitment hex strings) → Click "Submit to Contract" → Success message with transaction hash.

---

## SCENE 6: Technical Foundation (2:30 – 2:50)

**Visual:** Split into three columns with icons.

**Narration:**
```
Under the hood, the system has three key components.

First, the circuit — three R1CS constraints that enforce: 
the nullifier equals the secret plus the amount, the commitment 
binds the payment to a specific merchant, and the amount is 
non-zero.

Second, the Soroban smart contract — deployed on Stellar testnet 
at this address. It implements the full Groth16 pairing check 
and prevents double-spending through nullifier storage.

Third, the merchant API — built with Rust and Axum, serving 
eighteen endpoints for merchant management, proof generation, 
verification, and compliance reporting.
```

**Visual:** Column 1: "ZK Circuit" with the three constraint equations. Column 2: "Smart Contract" with contract address CA23... Column 3: "API Server" with Rust logo and endpoint list.

---

## SCENE 7: What's Next — The Roadmap (2:50 – 3:00)

**Visual:** Three-phase roadmap graphic.

**Narration:**
```
This is just the beginning. Phase one — the merchant payment demo — 
is complete and running on Stellar testnet.

The next phase is Privacy Receipts — cryptographic proof that a 
payment was made without revealing any financial details.

And the long-term vision is private financial infrastructure — 
enabling developers to build payroll, commerce, lending, and more 
on top of private payments.

Aframp. Private Economic Infrastructure. HTTPS for money.
```

**Visual:** Phase 1: ✅ "Private Merchant Payments" → Phase 2: "Privacy Receipts" → Phase 3: "Developer Infrastructure" with icons (payroll, commerce, lending).

---

## Production Notes

| Element | Suggestion |
|---------|-----------|
| Voiceover | ElevenLabs — professional, clear male/female voice, moderate pace |
| Background music | Low-fi or ambient tech (epidemic sound / artlist) — volume -25dB under voice |
| Motion graphics | Simple icon animations, clean transitions, no flashy effects |
| Color scheme | Green (#10b981) on dark (#0a0a0f) — match the brand |
| Screen recording | 1920x1080, 30fps, cursor visible with highlight on click |
| Duration | Keep under 3 minutes for social/landing page use |
| CTA at end | "Try it at aframpwallet.vercel.app" with URL overlay |
