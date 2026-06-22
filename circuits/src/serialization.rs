use ark_bn254::{Bn254, Fr, G1Affine, G2Affine};
use ark_groth16::Proof;
use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};

pub struct SerializableProof {
    pub a: [u8; 64],
    pub b: [u8; 128],
    pub c: [u8; 64],
}

impl From<&Proof<Bn254>> for SerializableProof {
    fn from(proof: &Proof<Bn254>) -> Self {
        let mut a_bytes = [0u8; 64];
        let mut b_bytes = [0u8; 128];
        let mut c_bytes = [0u8; 64];
        proof.a.serialize_compressed(&mut a_bytes[..]).unwrap();
        proof.b.serialize_compressed(&mut b_bytes[..]).unwrap();
        proof.c.serialize_compressed(&mut c_bytes[..]).unwrap();
        Self {
            a: a_bytes,
            b: b_bytes,
            c: c_bytes,
        }
    }
}

impl TryFrom<&SerializableProof> for Proof<Bn254> {
    type Error = Box<dyn std::error::Error>;
    fn try_from(value: &SerializableProof) -> Result<Self, Self::Error> {
        let a = G1Affine::deserialize_compressed(&value.a[..])?;
        let b = G2Affine::deserialize_compressed(&value.b[..])?;
        let c = G1Affine::deserialize_compressed(&value.c[..])?;
        Ok(Proof { a, b, c })
    }
}

pub struct SerializablePublicInputs {
    pub nullifier: [u8; 32],
    pub commitment: [u8; 32],
    pub encrypted_recipient: [u8; 32],
    pub merkle_root: [u8; 32],
}

impl From<(&Fr, &Fr, &Fr, &Fr)> for SerializablePublicInputs {
    fn from(inputs: (&Fr, &Fr, &Fr, &Fr)) -> Self {
        let mut nullifier_bytes = [0u8; 32];
        let mut commitment_bytes = [0u8; 32];
        let mut encrypted_bytes = [0u8; 32];
        let mut merkle_bytes = [0u8; 32];
        inputs.0.serialize_compressed(&mut nullifier_bytes[..]).unwrap();
        inputs.1.serialize_compressed(&mut commitment_bytes[..]).unwrap();
        inputs.2.serialize_compressed(&mut encrypted_bytes[..]).unwrap();
        inputs.3.serialize_compressed(&mut merkle_bytes[..]).unwrap();
        Self {
            nullifier: nullifier_bytes,
            commitment: commitment_bytes,
            encrypted_recipient: encrypted_bytes,
            merkle_root: merkle_bytes,
        }
    }
}

pub fn serialize_proof_hex(proof: &Proof<Bn254>) -> Result<String, Box<dyn std::error::Error>> {
    let mut buf = Vec::new();
    proof.serialize_compressed(&mut buf)?;
    Ok(hex::encode(buf))
}

pub fn deserialize_proof_hex(hex_str: &str) -> Result<Proof<Bn254>, Box<dyn std::error::Error>> {
    let buf = hex::decode(hex_str)?;
    Ok(Proof::deserialize_compressed(&buf[..])?)
}
