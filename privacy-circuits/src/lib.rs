use ark_bn254::{Bn254, Fr};
use ark_ff::{Field, One, Zero, PrimeField};
use ark_groth16::Groth16;
use ark_relations::r1cs::{ConstraintSynthesizer, ConstraintSystemRef, SynthesisError};
use ark_r1cs_std::{prelude::*, fields::fp::FpVar};
use ark_snark::{CircuitSpecificSetupSNARK, SNARK};

/// Simple merchant payment circuit
#[derive(Clone)]
pub struct PaymentCircuit {
    // Private inputs (known only to merchant)
    pub secret: Fr,
    pub amount: Fr,
    pub customer_id: Fr,

    // Public inputs (verified by contract)
    pub merchant_id: Fr,
    pub nullifier: Fr,
    pub commitment: Fr,
}

impl ConstraintSynthesizer<Fr> for PaymentCircuit {
    fn generate_constraints(
        self,
        cs: ConstraintSystemRef<Fr>,
    ) -> Result<(), SynthesisError> {
        // Create witness variables for private inputs
        let secret = FpVar::new_witness(cs.clone(), || Ok(self.secret))?;
        let amount = FpVar::new_witness(cs.clone(), || Ok(self.amount))?;
        let customer = FpVar::new_witness(cs.clone(), || Ok(self.customer_id))?;

        // Create public input variables
        let merchant = FpVar::new_input(cs.clone(), || Ok(self.merchant_id))?;
        let nullifier = FpVar::new_input(cs.clone(), || Ok(self.nullifier))?;
        let commitment = FpVar::new_input(cs.clone(), || Ok(self.commitment))?;

        // Constraint 1: merchant_id = secret * 2
        let computed_merchant = secret.clone() * FpVar::constant(Fr::from(2u64));
        computed_merchant.enforce_equal(&merchant)?;

        // Constraint 2: nullifier = secret + amount
        let computed_nullifier = secret.clone() + amount.clone();
        computed_nullifier.enforce_equal(&nullifier)?;

        // Constraint 3: commitment = secret * amount * customer
        let computed_commitment = secret.clone() * amount.clone() * customer.clone();
        computed_commitment.enforce_equal(&commitment)?;

        // Constraint 4: amount != 0 (inverse non-zero check)
        {
            let inv_amount = FpVar::new_witness(cs.clone(), || {
                if self.amount.is_zero() {
                    Err(SynthesisError::Unsatisfiable)
                } else {
                    Ok(self.amount.inverse().unwrap())
                }
            })?;
            (amount * inv_amount).enforce_equal(&FpVar::constant(Fr::one()))?;
        }

        Ok(())
    }
}

/// Main merchant payment system
pub struct MerchantPaymentSystem {
    pub merchant_id: Fr,
    pub pk: ark_groth16::ProvingKey<Bn254>,
    pub vk: ark_groth16::VerifyingKey<Bn254>,
}

impl MerchantPaymentSystem {
    /// Create a new merchant payment system
    pub fn new(merchant_seed: &[u8; 32]) -> Self {
        // merchant_id = secret * 2 (must match circuit constraint 1)
        let secret_fr = Fr::from_le_bytes_mod_order(merchant_seed);
        let merchant_id = secret_fr * Fr::from(2u64);

        // Generate proving and verifying keys from a representative circuit.
        // Use non-zero amount to pass the inverse check during CRS generation.
        let dummy_secret = Fr::from_le_bytes_mod_order(merchant_seed);
        let circuit = PaymentCircuit {
            secret: Fr::from(1u64),
            amount: Fr::from(1u64),
            customer_id: Fr::from(1u64),
            merchant_id: dummy_secret * Fr::from(2u64),
            nullifier: Fr::from(1u64) + Fr::from(1u64),
            commitment: Fr::from(1u64) * Fr::from(1u64) * Fr::from(1u64),
        };

        let mut rng = rand::thread_rng();
        let (pk, vk) = Groth16::<Bn254>::setup(circuit, &mut rng).unwrap();

        Self { merchant_id, pk, vk }
    }

    /// Generate a payment proof
    pub fn generate_proof(
        &self,
        secret: &[u8; 32],
        amount: u64,
        customer_id: &[u8; 32],
    ) -> Result<(ark_groth16::Proof<Bn254>, Fr, Fr), Box<dyn std::error::Error>> {
        let mut rng = rand::thread_rng();

        // Convert inputs to field elements
        let secret_fr = Fr::from_le_bytes_mod_order(secret);
        let amount_fr = Fr::from(amount);
        let customer_fr = Fr::from_le_bytes_mod_order(customer_id);

        // Compute public values
        let nullifier = secret_fr + amount_fr;
        let commitment = secret_fr * amount_fr * customer_fr;

        // Create circuit instance
        let circuit = PaymentCircuit {
            secret: secret_fr,
            amount: amount_fr,
            customer_id: customer_fr,
            merchant_id: self.merchant_id,
            nullifier,
            commitment,
        };

        // Generate proof
        let proof = Groth16::<Bn254>::prove(&self.pk, circuit, &mut rng)?;

        Ok((proof, nullifier, commitment))
    }

    /// Verify a payment proof
    pub fn verify_proof(
        &self,
        proof: &ark_groth16::Proof<Bn254>,
        merchant_id: &Fr,
        nullifier: &Fr,
        commitment: &Fr,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        let public_inputs = vec![*merchant_id, *nullifier, *commitment];
        Ok(Groth16::<Bn254>::verify(&self.vk, &public_inputs, proof)?)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::RngCore;

    #[test]
    fn test_merchant_payment_flow() {
        println!("\n🏪 Testing Merchant Payment Flow");
        println!("================================");

        let mut rng = rand::thread_rng();
        let mut seed = [0u8; 32];
        rng.fill_bytes(&mut seed);

        let merchant = MerchantPaymentSystem::new(&seed);
        println!("✅ Merchant created");
        let mut id_buf = [0u8; 32];
        ark_serialize::CanonicalSerialize::serialize_compressed(&merchant.merchant_id, &mut id_buf[..]).unwrap();
        println!("   Merchant ID: {}", hex::encode(id_buf));

        // Use merchant's seed as secret (required by secret*2 = merchant_id constraint)
        let secret = seed;
        let mut customer = [0u8; 32];
        rng.fill_bytes(&mut customer);
        let amount = 100u64;

        println!("\n📝 Generating payment proof...");
        let (proof, nullifier, commitment) = merchant
            .generate_proof(&secret, amount, &customer)
            .unwrap();

        println!("   Proof generated");
        let mut n_buf = [0u8; 32];
        ark_serialize::CanonicalSerialize::serialize_compressed(&nullifier, &mut n_buf[..]).unwrap();
        println!("   Nullifier: {}", hex::encode(n_buf));
        let mut c_buf = [0u8; 32];
        ark_serialize::CanonicalSerialize::serialize_compressed(&commitment, &mut c_buf[..]).unwrap();
        println!("   Commitment: {}", hex::encode(c_buf));

        println!("\n🔍 Verifying proof...");
        let valid = merchant
            .verify_proof(&proof, &merchant.merchant_id, &nullifier, &commitment)
            .unwrap();

        assert!(valid);
        println!("✅ Proof is VALID");

        println!("\n🔍 Testing invalid proof...");
        let invalid_merchant = Fr::from(999u64);
        let valid = merchant
            .verify_proof(&proof, &invalid_merchant, &nullifier, &commitment)
            .unwrap();

        assert!(!valid);
        println!("✅ Invalid proof correctly rejected");

        println!("\n🎉 All tests passed!");
        let proof_size = ark_serialize::CanonicalSerialize::serialized_size(&proof, ark_serialize::Compress::Yes);
        println!("   Proof size: {} bytes", proof_size);
    }

    #[test]
    fn test_performance() {
        println!("\n⚡ Performance Test");
        println!("==================");

        let mut rng = rand::thread_rng();
        let mut seed = [0u8; 32];
        rng.fill_bytes(&mut seed);
        let merchant = MerchantPaymentSystem::new(&seed);

        // Use merchant's seed as secret (required by secret*2 = merchant_id constraint)
        let secret = seed;
        let mut customer = [0u8; 32];
        rng.fill_bytes(&mut customer);

        let start = std::time::Instant::now();
        let (proof, _nullifier, _commitment) = merchant
            .generate_proof(&secret, 100, &customer)
            .unwrap();
        let duration = start.elapsed();

        println!("✅ Proof generation: {:?}", duration);
        let proof_size = ark_serialize::CanonicalSerialize::serialized_size(&proof, ark_serialize::Compress::Yes);
        println!("   Proof size: {} bytes", proof_size);

        let start = std::time::Instant::now();
        let _valid = merchant
            .verify_proof(&proof, &merchant.merchant_id, &_nullifier, &_commitment)
            .unwrap();
        let duration = start.elapsed();

        println!("✅ Proof verification: {:?}", duration);
    }

    #[test]
    fn test_zero_amount_rejected() {
        println!("\n⛔ Zero Amount Test");
        println!("==================");

        let mut rng = rand::thread_rng();
        let mut seed = [0u8; 32];
        rng.fill_bytes(&mut seed);
        let merchant = MerchantPaymentSystem::new(&seed);

        let mut secret = [0u8; 32];
        let mut customer = [0u8; 32];
        rng.fill_bytes(&mut secret);
        rng.fill_bytes(&mut customer);

        let result = merchant.generate_proof(&secret, 0, &customer);
        assert!(result.is_err(), "Zero amount should be rejected");
        println!("✅ Zero amount correctly rejected");
    }
}
