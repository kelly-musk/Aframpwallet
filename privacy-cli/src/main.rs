use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;
use ark_ff::{BigInteger, PrimeField};
use privacy_circuits::MerchantPaymentSystem;
use rand::RngCore;

fn fr_to_hex(fr: &ark_bn254::Fr) -> String {
    hex::encode(fr.into_bigint().to_bytes_be())
}

fn g1_to_hex(point: &ark_bn254::G1Affine) -> String {
    let mut out = Vec::with_capacity(64);
    out.extend_from_slice(&point.x.into_bigint().to_bytes_be());
    out.extend_from_slice(&point.y.into_bigint().to_bytes_be());
    hex::encode(out)
}

fn g2_to_hex(point: &ark_bn254::G2Affine) -> String {
    let mut out = Vec::with_capacity(128);
    out.extend_from_slice(&point.x.c1.into_bigint().to_bytes_be());
    out.extend_from_slice(&point.x.c0.into_bigint().to_bytes_be());
    out.extend_from_slice(&point.y.c1.into_bigint().to_bytes_be());
    out.extend_from_slice(&point.y.c0.into_bigint().to_bytes_be());
    hex::encode(out)
}

/// Save merchant system so proofs are compatible with the deployed VK
fn save_merchant(merchant: &MerchantPaymentSystem, seed: &[u8; 32]) {
    use ark_serialize::CanonicalSerialize;

    let dir = Path::new(".merchant");
    fs::create_dir_all(dir).ok();

    fs::write(dir.join("seed"), hex::encode(seed)).ok();

    let mut pk_bytes = Vec::new();
    merchant.pk.serialize_compressed(&mut pk_bytes).unwrap();
    fs::write(dir.join("pk"), pk_bytes).ok();

    let mut vk_bytes = Vec::new();
    merchant.vk.serialize_compressed(&mut vk_bytes).unwrap();
    fs::write(dir.join("vk"), vk_bytes).ok();

    println!("  merchant data saved to .merchant/");
}

fn load_merchant() -> Option<(MerchantPaymentSystem, [u8; 32])> {
    use ark_serialize::CanonicalDeserialize;

    let dir = Path::new(".merchant");
    if !dir.join("seed").exists() {
        return None;
    }

    let seed_hex = fs::read_to_string(dir.join("seed")).ok()?;
    let seed_bytes = hex::decode(seed_hex.trim()).ok()?;
    let mut seed = [0u8; 32];
    seed.copy_from_slice(&seed_bytes);

    let pk_bytes = fs::read(dir.join("pk")).ok()?;
    let pk = ark_groth16::ProvingKey::<ark_bn254::Bn254>::deserialize_compressed(
        &mut &pk_bytes[..],
    )
    .ok()?;

    let vk_bytes = fs::read(dir.join("vk")).ok()?;
    let vk = ark_groth16::VerifyingKey::<ark_bn254::Bn254>::deserialize_compressed(
        &mut &vk_bytes[..],
    )
    .ok()?;

    // Reconstruct merchant_id from seed
    use ark_ff::PrimeField;
    let secret_fr = ark_bn254::Fr::from_le_bytes_mod_order(&seed);
    let merchant_id = secret_fr * ark_bn254::Fr::from(2u64);

    Some((
        MerchantPaymentSystem {
            merchant_id,
            pk,
            vk,
        },
        seed,
    ))
}

fn cmd_merchant() {
    let mut rng = rand::thread_rng();
    let mut seed = [0u8; 32];
    rng.fill_bytes(&mut seed);

    let merchant = MerchantPaymentSystem::new(&seed);
    save_merchant(&merchant, &seed);

    println!("{}", serde_json::to_string_pretty(&serde_json::json!({
        "merchant_id": fr_to_hex(&merchant.merchant_id),
        "seed": hex::encode(seed),
    })).unwrap());
}

fn cmd_proof(amount: u64, customer_hex: &str) {
    let (merchant, _seed) = match load_merchant() {
        Some(m) => m,
        None => {
            // Fallback to SEED env var (backward compat)
            let seed_hex = env::var("SEED").expect("No .merchant/ dir or SEED env var");
            let seed_bytes = hex::decode(&seed_hex).expect("invalid SEED hex");
            let mut seed = [0u8; 32];
            seed.copy_from_slice(&seed_bytes);
            // NOTE: This creates a NEW merchant with DIFFERENT keys — won't match deployed VK
            eprintln!("⚠️  Warning: creating new merchant — proof won't match deployed VK");
            eprintln!("   Use `privacy-cli merchant` first, then retry");
            let m = MerchantPaymentSystem::new(&seed);
            save_merchant(&m, &seed);
            (m, seed)
        }
    };

    let customer_bytes = hex::decode(customer_hex).expect("invalid customer_id hex");
    let mut customer = [0u8; 32];
    customer.copy_from_slice(&customer_bytes);

    let (proof, nullifier, commitment) = merchant
        .generate_proof(&_seed, amount, &customer)
        .unwrap();

    println!("{}", serde_json::to_string_pretty(&serde_json::json!({
        "merchant_id": fr_to_hex(&merchant.merchant_id),
        "nullifier": fr_to_hex(&nullifier),
        "commitment": fr_to_hex(&commitment),
        "proof": {
            "a": g1_to_hex(&proof.a),
            "b": g2_to_hex(&proof.b),
            "c": g1_to_hex(&proof.c),
        },
    })).unwrap());
}

fn cmd_init_contract(contract_id: &str) {
    // Create merchant ONCE — save PK/VK so proofs are compatible
    let mut rng = rand::thread_rng();
    let mut seed = [0u8; 32];
    rng.fill_bytes(&mut seed);

    let merchant = MerchantPaymentSystem::new(&seed);
    save_merchant(&merchant, &seed);

    println!("Merchant created");
    println!("  seed:        {}", hex::encode(seed));
    println!("  merchant_id: {}", fr_to_hex(&merchant.merchant_id));

    // Build VK JSON for contract
    let alpha = g1_to_hex(&merchant.vk.alpha_g1);
    let beta = g2_to_hex(&merchant.vk.beta_g2);
    let gamma = g2_to_hex(&merchant.vk.gamma_g2);
    let delta = g2_to_hex(&merchant.vk.delta_g2);

    let mut ic = Vec::new();
    for point in &merchant.vk.gamma_abc_g1 {
        ic.push(g1_to_hex(point));
    }

    let vk_json = serde_json::json!({
        "alpha": alpha,
        "beta": beta,
        "gamma": gamma,
        "delta": delta,
        "ic": ic,
    });

    let vk_str = serde_json::to_string(&vk_json).unwrap();

    println!("\nInitializing contract {} ...", contract_id);

    let status = Command::new("soroban")
        .args([
            "contract", "invoke",
            "--id", contract_id,
            "--source", "alice",
            "--network", "testnet",
            "--",
            "initialize",
            "--vk", &vk_str,
        ])
        .status()
        .expect("failed to run soroban CLI");

    if status.success() {
        println!("\n✅ Contract initialized!");
        println!("   Now generate proofs with: privacy-cli proof <AMOUNT> <CUSTOMER_HEX>");
    } else {
        eprintln!("\n❌ Contract initialization failed");
        std::process::exit(1);
    }
}

fn help() {
    println!("Privacy CLI — Merchant ZK Tools");
    println!();
    println!("Usage:");
    println!("  privacy-cli merchant                    Create new merchant (saves to .merchant/)");
    println!("  privacy-cli proof <AMT> <CUSTOMER_HEX>  Generate proof (uses .merchant/ keys)");
    println!("  privacy-cli init-contract <CONTRACT_ID>  Create merchant + deploy VK to contract");
    println!();
    println!("Files:");
    println!("  .merchant/seed   Merchant seed (hex)");
    println!("  .merchant/pk     Proving key (binary)");
    println!("  .merchant/vk     Verifying key (binary)");
}

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        help();
        return;
    }

    match args[1].as_str() {
        "merchant" | "m" => cmd_merchant(),
        "proof" | "p" => {
            if args.len() < 4 {
                eprintln!("Usage: privacy-cli proof <AMOUNT> <CUSTOMER_HEX>");
                std::process::exit(1);
            }
            let amount: u64 = args[2].parse().expect("invalid amount");
            cmd_proof(amount, &args[3]);
        }
        "init-contract" | "init" => {
            if args.len() < 3 {
                eprintln!("Usage: privacy-cli init-contract <CONTRACT_ID>");
                std::process::exit(1);
            }
            cmd_init_contract(&args[2]);
        }
        _ => help(),
    }
}
