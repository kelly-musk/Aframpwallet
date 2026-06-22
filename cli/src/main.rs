use circuits::{serialization, DepositMerkleTree, PrivacyProofSystem};
use rand::Rng;

fn main() {
    println!("═══ Privacy Pool — Key & Proof Inspector ═══\n");

    println!("[1/4] Generating proving & verifying keys ...");
    let system = PrivacyProofSystem::setup();
    println!("  ✓ Keys generated");

    println!("\n[2/4] Creating random witness ...");
    let secret: [u8; 32] = rand::thread_rng().r#gen();
    let amount = 42u64;
    let recipient: [u8; 32] = rand::thread_rng().r#gen();
    println!("  secret:    {}", hex::encode(secret));
    println!("  amount:    {}", amount);
    println!("  recipient: {}", hex::encode(recipient));

    println!("\n[3/4] Generating proof ...");
    let tree = DepositMerkleTree::new();
    let (proof, nullifier, commitment, encrypted, merkle_root) =
        system.prove(&secret, amount, &recipient, tree.root).unwrap();

    let mut n_bytes = [0u8; 32];
    let mut c_bytes = [0u8; 32];
    let mut e_bytes = [0u8; 32];
    use ark_serialize::CanonicalSerialize;
    nullifier.serialize_compressed(&mut n_bytes[..]).unwrap();
    commitment.serialize_compressed(&mut c_bytes[..]).unwrap();
    encrypted.serialize_compressed(&mut e_bytes[..]).unwrap();

    println!("  nullifier (hex):           {}", hex::encode(n_bytes));
    println!("  commitment (hex):          {}", hex::encode(c_bytes));
    println!("  encrypted_recipient (hex): {}", hex::encode(e_bytes));

    let proof_hex = serialization::serialize_proof_hex(&proof).unwrap();
    println!("  proof (hex, first 64):     {}...", &proof_hex[..64]);
    println!("  proof (byte length):       {} bytes", proof_hex.len() / 2);

    println!("\n[4/4] Verifying proof ...");
    match system.verify(&proof, &nullifier, &commitment, &encrypted, &merkle_root) {
        Ok(true) => println!("  ✓ PROOF VALID"),
        Ok(false) => println!("  ✗ PROOF INVALID"),
        Err(e) => println!("  ✗ Error: {}", e),
    }

    let back = serialization::deserialize_proof_hex(&proof_hex).unwrap();
    let hex_again = serialization::serialize_proof_hex(&back).unwrap();
    let roundtrip_ok = proof_hex == hex_again;
    println!(
        "\n  Serialization round-trip:  {}",
        if roundtrip_ok { "✓ OK" } else { "✗ FAILED" }
    );
}
