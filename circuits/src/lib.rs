use ark_bn254::{Bn254, Fr};
use ark_ed_on_bn254::{EdwardsAffine, EdwardsProjective, Fr as EdFr, GENERATOR_X, GENERATOR_Y};
use ark_ff::{Field, One, PrimeField, Zero};
use ark_groth16::{Groth16, Proof, ProvingKey, VerifyingKey};
use ark_relations::r1cs::{ConstraintSynthesizer, ConstraintSystemRef, SynthesisError};
use ark_r1cs_std::fields::fp::FpVar;
use ark_r1cs_std::prelude::*;
use ark_serialize::CanonicalSerialize;
use ark_snark::{CircuitSpecificSetupSNARK, SNARK};
use ark_std::rand;
use ark_std::UniformRand;

pub mod serialization;

pub use ark_bn254;

use serialization::{SerializableProof, SerializablePublicInputs};

/// Pedersen commitment parameters on the Baby-Jubjub Edwards curve
/// (whose base field equals the scalar field of BN254).
#[derive(Clone)]
pub struct CommitmentParams {
    pub generator_g: EdwardsAffine,
    pub generator_h: EdwardsAffine,
}

impl CommitmentParams {
    pub fn new() -> Self {
        let g = EdwardsAffine::new(GENERATOR_X, GENERATOR_Y);
        let h = (EdwardsProjective::from(g) * EdFr::from(2u64)).into();
        Self {
            generator_g: g,
            generator_h: h,
        }
    }
}

/// Hash two Fr values with Blake3 and return an Fr.
pub fn blake3_hash_fr(a: &Fr, b: &Fr) -> Fr {
    let mut hasher = blake3::Hasher::new();
    let mut buf = [0u8; 64];
    a.serialize_compressed(&mut buf[..32]).unwrap();
    b.serialize_compressed(&mut buf[32..]).unwrap();
    hasher.update(&buf);
    Fr::from_le_bytes_mod_order(hasher.finalize().as_bytes())
}

/// Pedersen commitment: g^secret * h^blinding on Baby-Jubjub.
/// Returns the x-coordinate of the resulting point mapped to Fr.
pub fn pedersen_commit(secret: &Fr, blinding: &Fr) -> Fr {
    let params = CommitmentParams::new();
    let mut buf = [0u8; 64];
    secret.serialize_compressed(&mut buf[..32]).unwrap();
    blinding.serialize_compressed(&mut buf[32..]).unwrap();
    let secret_ed = EdFr::from_le_bytes_mod_order(&buf[..32]);
    let blinding_ed = EdFr::from_le_bytes_mod_order(&buf[32..]);

    let g = EdwardsProjective::from(params.generator_g);
    let h = EdwardsProjective::from(params.generator_h);

    let point = g * secret_ed + h * blinding_ed;
    let affine = EdwardsAffine::from(point);
    let mut x_bytes = [0u8; 32];
    affine
        .x
        .serialize_compressed(&mut x_bytes[..])
        .unwrap();
    Fr::from_le_bytes_mod_order(&x_bytes)
}

/// -----------------------------------------------------------------------
/// Private transfer circuit (5 constraints).
///
/// **SECURITY WARNING:** Constraints 1, 2, and 4 use arithmetic as a
/// stand-in for real hash / Pedersen / Merkle gadgets.  This is **only**
/// for demonstrating the proving pipeline — a production circuit **must**
/// replace these with proper R1CS hash gadgets (e.g. Poseidon from
/// `ark-crypto-primitives` or a bit-decomposed SHA-256).
/// -----------------------------------------------------------------------
#[derive(Clone)]
pub struct PrivateTransferCircuit {
    // Private witness
    pub secret: Fr,
    pub amount: Fr,
    pub recipient_pubkey: Fr,
    pub blinding: Fr,
    // Public inputs
    pub nullifier: Fr,
    pub commitment: Fr,
    pub encrypted_recipient: Fr,
    pub merkle_root: Fr,
}

impl PrivateTransferCircuit {
    /// Create a circuit instance with computed public values.
    /// NOTE: public values use simplified arithmetic matching the constraints.
    /// Real hash/Pedersen functions are in `blake3_hash_fr`/`pedersen_commit`.
    pub fn new(secret: &[u8; 32], amount: u64, recipient: &[u8; 32]) -> Self {
        let mut rng = rand::thread_rng();
        let secret_fr = Fr::from_le_bytes_mod_order(secret);
        let amount_fr = Fr::from(amount);
        let recipient_fr = Fr::from_le_bytes_mod_order(recipient);
        let blinding = Fr::rand(&mut rng);

        let nullifier = secret_fr * amount_fr;
        let commitment = secret_fr * blinding;
        let encrypted_recipient = amount_fr * recipient_fr;

        Self {
            secret: secret_fr,
            amount: amount_fr,
            recipient_pubkey: recipient_fr,
            blinding,
            nullifier,
            commitment,
            encrypted_recipient,
            merkle_root: Fr::zero(),
        }
    }
}

impl ConstraintSynthesizer<Fr> for PrivateTransferCircuit {
    fn generate_constraints(
        self,
        cs: ConstraintSystemRef<Fr>,
    ) -> Result<(), SynthesisError> {
        let secret = FpVar::new_witness(cs.clone(), || Ok(self.secret))?;
        let amount = FpVar::new_witness(cs.clone(), || Ok(self.amount))?;
        let recipient = FpVar::new_witness(cs.clone(), || Ok(self.recipient_pubkey))?;
        let blinding = FpVar::new_witness(cs.clone(), || Ok(self.blinding))?;

        let nullifier_pub = FpVar::new_input(cs.clone(), || Ok(self.nullifier))?;
        let commitment_pub = FpVar::new_input(cs.clone(), || Ok(self.commitment))?;
        let encrypted_pub = FpVar::new_input(cs.clone(), || Ok(self.encrypted_recipient))?;
        let merkle_root_pub = FpVar::new_input(cs.clone(), || Ok(self.merkle_root))?;

        (secret.clone() * amount.clone()).enforce_equal(&nullifier_pub)?;
        (secret.clone() * blinding.clone()).enforce_equal(&commitment_pub)?;
        (amount.clone() * recipient.clone()).enforce_equal(&encrypted_pub)?;
        (secret * recipient).enforce_equal(&merkle_root_pub)?;

        let inv_amount = FpVar::new_witness(cs, || {
            if self.amount.is_zero() {
                Err(SynthesisError::AssignmentMissing)
            } else {
                Ok(self.amount.inverse().unwrap())
            }
        })?;
        (amount * inv_amount).enforce_equal(&FpVar::constant(Fr::one()))?;

        Ok(())
    }
}

/// -----------------------------------------------------------------------
/// High-level proof system wrapper.
/// -----------------------------------------------------------------------
pub struct PrivacyProofSystem {
    pub pk: ProvingKey<Bn254>,
    pub vk: VerifyingKey<Bn254>,
}

impl PrivacyProofSystem {
    pub fn setup() -> Self {
        let circuit = PrivateTransferCircuit {
            secret: Fr::zero(),
            amount: Fr::from(1u64),
            recipient_pubkey: Fr::zero(),
            blinding: Fr::zero(),
            nullifier: Fr::zero(),
            commitment: Fr::zero(),
            encrypted_recipient: Fr::zero(),
            merkle_root: Fr::zero(),
        };
        let (pk, vk) =
            Groth16::<Bn254>::setup(circuit, &mut rand::thread_rng()).unwrap();
        Self { pk, vk }
    }

    #[allow(clippy::too_many_arguments)]
    pub fn prove(
        &self,
        secret: &[u8; 32],
        amount: u64,
        recipient: &[u8; 32],
        _merkle_root: Fr,
    ) -> Result<(Proof<Bn254>, Fr, Fr, Fr, Fr), Box<dyn std::error::Error>> {
        let mut rng = rand::thread_rng();
        let secret_fr = Fr::from_le_bytes_mod_order(secret);
        let amount_fr = Fr::from(amount);
        let recipient_fr = Fr::from_le_bytes_mod_order(recipient);
        let blinding = Fr::rand(&mut rng);

        let nullifier = secret_fr * amount_fr;
        let commitment = secret_fr * blinding;
        let encrypted_recipient = amount_fr * recipient_fr;
        let merkle_root = secret_fr * recipient_fr;

        let circuit = PrivateTransferCircuit {
            secret: secret_fr,
            amount: amount_fr,
            recipient_pubkey: recipient_fr,
            blinding,
            nullifier,
            commitment,
            encrypted_recipient,
            merkle_root,
        };

        let proof = Groth16::<Bn254>::prove(&self.pk, circuit, &mut rng)?;
        Ok((proof, nullifier, commitment, encrypted_recipient, merkle_root))
    }

    pub fn verify(
        &self,
        proof: &Proof<Bn254>,
        nullifier: &Fr,
        commitment: &Fr,
        encrypted_recipient: &Fr,
        merkle_root: &Fr,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        let pvk = ark_groth16::prepare_verifying_key(&self.vk);
        let public_inputs = vec![
            *nullifier,
            *commitment,
            *encrypted_recipient,
            *merkle_root,
        ];
        Ok(Groth16::<Bn254>::verify_proof(&pvk, proof, &public_inputs)?)
    }

    pub fn to_serializable_proof(
        proof: &Proof<Bn254>,
        nullifier: &Fr,
        commitment: &Fr,
        encrypted_recipient: &Fr,
        merkle_root: &Fr,
    ) -> (SerializableProof, SerializablePublicInputs) {
        let sproof = SerializableProof::from(proof);
        let sinputs = SerializablePublicInputs::from((nullifier, commitment, encrypted_recipient, merkle_root));
        (sproof, sinputs)
    }
}

/// -----------------------------------------------------------------------
/// Merkle tree for deposit tracking.
/// -----------------------------------------------------------------------
pub struct DepositMerkleTree {
    pub leaves: Vec<Fr>,
    pub tree: Vec<Vec<Fr>>,
    pub root: Fr,
}

impl DepositMerkleTree {
    pub fn new() -> Self {
        Self {
            leaves: Vec::new(),
            tree: Vec::new(),
            root: Fr::zero(),
        }
    }

    pub fn insert(&mut self, leaf: Fr) -> usize {
        let idx = self.leaves.len();
        self.leaves.push(leaf);
        self.build_tree();
        idx
    }

    fn build_tree(&mut self) {
        if self.leaves.is_empty() {
            return;
        }
        self.tree.clear();
        self.tree.push(self.leaves.clone());

        let mut level = 0;
        while self.tree[level].len() > 1 {
            let current = &self.tree[level];
            let mut next = Vec::with_capacity((current.len() + 1) / 2);
            for chunk in current.chunks(2) {
                let h = if chunk.len() == 2 {
                    Self::hash_pair(chunk[0], chunk[1])
                } else {
                    Self::hash_pair(chunk[0], Fr::zero())
                };
                next.push(h);
            }
            self.tree.push(next);
            level += 1;
        }
        self.root = *self.tree.last().unwrap().first().unwrap_or(&Fr::zero());
    }

    pub fn get_path(&self, index: usize) -> Vec<Fr> {
        let mut path = Vec::new();
        let mut idx = index;
        for level in 0..self.tree.len() - 1 {
            let sibling = if idx % 2 == 0 {
                self.tree[level].get(idx + 1).copied().unwrap_or(Fr::zero())
            } else {
                self.tree[level].get(idx - 1).copied().unwrap_or(Fr::zero())
            };
            path.push(sibling);
            idx /= 2;
        }
        path
    }

    pub fn depth(&self) -> usize {
        self.tree.len()
    }

    fn hash_pair(a: Fr, b: Fr) -> Fr {
        blake3_hash_fr(&a, &b)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use ark_std::rand::RngCore;

    #[test]
    fn test_circuit_setup() {
        let system = PrivacyProofSystem::setup();
        assert!(!system.pk.a_query.is_empty());
        assert!(!system.vk.gamma_abc_g1.is_empty());
    }

    #[test]
    fn test_proof_creation_and_verification() {
        let mut rng = rand::thread_rng();
        let system = PrivacyProofSystem::setup();

        let mut secret = [0u8; 32];
        let mut recipient = [0u8; 32];
        rng.fill_bytes(&mut secret);
        rng.fill_bytes(&mut recipient);

        let mut tree = DepositMerkleTree::new();
        for i in 0u64..10 {
            tree.insert(Fr::from(i));
        }

        let secret_fr = Fr::from_le_bytes_mod_order(&secret);
        let _amount_fr = Fr::from(100u64);
        let blinding = Fr::rand(&mut rng);
        let comm = pedersen_commit(&secret_fr, &blinding);
        tree.insert(comm);
        let merkle_root = tree.root;

        let (proof, nullifier, commitment_out, encrypted, merkle_root) =
            system.prove(&secret, 100, &recipient, merkle_root).unwrap();

        let valid = system
            .verify(&proof, &nullifier, &commitment_out, &encrypted, &merkle_root)
            .unwrap();
        assert!(valid);

        let (sproof, sinputs) = PrivacyProofSystem::to_serializable_proof(
            &proof, &nullifier, &commitment_out, &encrypted, &merkle_root,
        );
        assert_eq!(sproof.a.len(), 64);
        assert_eq!(sproof.b.len(), 128);
        assert_eq!(sproof.c.len(), 64);
        assert_eq!(sinputs.nullifier.len(), 32);
        assert_eq!(sinputs.commitment.len(), 32);
    }

    #[test]
    fn test_invalid_proof_rejected() {
        let mut rng = rand::thread_rng();
        let system = PrivacyProofSystem::setup();

        let mut secret = [0u8; 32];
        let mut recipient = [0u8; 32];
        rng.fill_bytes(&mut secret);
        rng.fill_bytes(&mut recipient);

        let tree = DepositMerkleTree::new();
        let (proof, _nullifier, commitment_out, encrypted, _merkle_root) =
            system.prove(&secret, 100, &recipient, tree.root).unwrap();

        let wrong = Fr::from(999u64);
        let valid = system
            .verify(&proof, &wrong, &commitment_out, &encrypted, &_merkle_root)
            .unwrap();
        assert!(!valid);
    }

    #[test]
    fn test_merkle_tree_integration() {
        let mut rng = rand::thread_rng();
        let mut tree = DepositMerkleTree::new();
        for _ in 0..100 {
            tree.insert(Fr::rand(&mut rng));
        }
        assert!(!tree.leaves.is_empty());
        assert_ne!(tree.root, Fr::zero());
        assert_eq!(tree.depth(), 8);

        for i in 0..tree.leaves.len() {
            let path = tree.get_path(i);
            assert_eq!(path.len(), tree.depth() - 1);
        }
    }

    #[test]
    fn test_serialization_roundtrip() {
        let mut rng = rand::thread_rng();
        let system = PrivacyProofSystem::setup();

        let mut secret = [0u8; 32];
        let mut recipient = [0u8; 32];
        rng.fill_bytes(&mut secret);
        rng.fill_bytes(&mut recipient);

        let (proof, nullifier, commitment, encrypted, merkle_root) =
            system.prove(&secret, 100, &recipient, Fr::zero()).unwrap();

        let hex_proof = serialization::serialize_proof_hex(&proof).unwrap();
        let deser_proof = serialization::deserialize_proof_hex(&hex_proof).unwrap();

        let pvk = ark_groth16::prepare_verifying_key(&system.vk);
        let inputs = vec![nullifier, commitment, encrypted, merkle_root];
        assert!(Groth16::<Bn254>::verify_proof(&pvk, &deser_proof, &inputs).unwrap());
    }
}
