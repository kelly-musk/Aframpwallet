use dialoguer::{Confirm, Input, Select};
use serde::Deserialize;
use std::env;

const DEFAULT_API: &str = "http://localhost:3000";

#[derive(Clone, Deserialize)]
struct CreateResponse {
    merchant_id: String,
    seed: String,
}

#[derive(Deserialize)]
struct GenerateResponse {
    proof: ProofJson,
    merchant_id: String,
    nullifier: String,
    commitment: String,
}

#[derive(Deserialize)]
struct ProofJson {
    a: String,
    b: String,
    c: String,
}

#[derive(Deserialize)]
struct VerifyResponse {
    valid: bool,
}

#[derive(Deserialize)]
struct SubmitResponse {
    success: bool,
    tx_hash: Option<String>,
    error: Option<String>,
}

fn api_url() -> String {
    env::var("MERCHANT_API").unwrap_or_else(|_| DEFAULT_API.to_string())
}

fn menu_items() -> Vec<&'static str> {
    vec![
        "Create New Merchant",
        "Generate Payment Proof",
        "Verify Proof",
        "Submit Proof to Contract",
        "Exit",
    ]
}

fn create_merchant() -> Option<CreateResponse> {
    println!("\n--- Create Merchant ---");
    let url = format!("{}/merchant/create", api_url());
    match ureq::post(&url).send("") {
        Ok(resp) => {
            match resp.into_body().read_json::<CreateResponse>() {
                Ok(r) => {
                    println!("\n✅ Merchant created!");
                    println!("   ID:   {}", r.merchant_id);
                    println!("   Seed: {}", r.seed);
                    println!("\n⚠️  SAVE YOUR SEED — it's your private key!");
                    Some(r)
                }
                Err(e) => {
                    eprintln!("❌ Failed to parse response: {e}");
                    None
                }
            }
        }
        Err(e) => {
            eprintln!("❌ API error: {e}");
            None
        }
    }
}

fn generate_proof(seed: &str) {
    println!("\n--- Generate Payment Proof ---");

    let amount: u64 = loop {
        let input: String = Input::new()
            .with_prompt("Payment amount")
            .default("100".into())
            .interact_text()
            .unwrap();
        match input.parse() {
            Ok(v) => break v,
            Err(_) => eprintln!("Invalid amount, try again"),
        }
    };

    let customer_id: String = Input::new()
        .with_prompt("Customer ID (64 hex chars)")
        .default("00000000000000000000000000000000000000000000000000000000deadbeef".into())
        .interact_text()
        .unwrap();

    println!("\nGenerating proof...");

    let url = format!("{}/payment/generate-proof", api_url());
    let req = serde_json::json!({
        "seed": seed,
        "amount": amount,
        "customer_id": customer_id,
    });

    match ureq::post(&url).send_json(&req) {
        Ok(resp) => {
            match resp.into_body().read_json::<GenerateResponse>() {
                Ok(r) => {
                    println!("\n✅ Proof generated!");
                    println!("   Merchant ID: {}", r.merchant_id);
                    println!("   Nullifier:   {}", r.nullifier);
                    println!("   Commitment:  {}", r.commitment);
                    println!("\n   Proof.A: {}", &r.proof.a[..32]);
                    println!("   Proof.B: {}...", &r.proof.b[..32]);
                    println!("   Proof.C: {}", &r.proof.c[..32]);

                    if Confirm::new()
                        .with_prompt("Verify this proof?")
                        .default(true)
                        .interact()
                        .unwrap()
                    {
                        verify_proof_inner(seed, &r.proof.a, &r.proof.b, &r.proof.c, &r.nullifier, &r.commitment);
                    }
                }
                Err(e) => eprintln!("❌ Failed to parse response: {e}"),
            }
        }
        Err(e) => eprintln!("❌ API error: {e}"),
    }
}

fn verify_proof_inner(seed: &str, a: &str, b: &str, c: &str, nullifier: &str, commitment: &str) {
    let url = format!("{}/payment/verify", api_url());
    let req = serde_json::json!({
        "seed": seed,
        "a": a,
        "b": b,
        "c": c,
        "nullifier": nullifier,
        "commitment": commitment,
    });

    match ureq::post(&url).send_json(&req) {
        Ok(resp) => {
            match resp.into_body().read_json::<VerifyResponse>() {
                Ok(r) => {
                    if r.valid {
                        println!("\n✅ Proof is VALID");
                    } else {
                        println!("\n❌ Proof is INVALID");
                    }
                }
                Err(e) => eprintln!("❌ Failed to parse response: {e}"),
            }
        }
        Err(e) => eprintln!("❌ API error: {e}"),
    }
}

fn verify_proof_menu() {
    println!("\n--- Verify Proof ---");

    let seed: String = Input::new()
        .with_prompt("Merchant seed")
        .interact_text()
        .unwrap();

    let a: String = Input::new()
        .with_prompt("Proof.A (128 hex chars)")
        .interact_text()
        .unwrap();
    let b: String = Input::new()
        .with_prompt("Proof.B (256 hex chars)")
        .interact_text()
        .unwrap();
    let c: String = Input::new()
        .with_prompt("Proof.C (128 hex chars)")
        .interact_text()
        .unwrap();
    let nullifier: String = Input::new()
        .with_prompt("Nullifier (64 hex chars)")
        .interact_text()
        .unwrap();
    let commitment: String = Input::new()
        .with_prompt("Commitment (64 hex chars)")
        .interact_text()
        .unwrap();

    verify_proof_inner(&seed, &a, &b, &c, &nullifier, &commitment);
}

fn submit_to_contract(seed: &str) {
    println!("\n--- Submit Proof to Contract ---");

    let amount: u64 = loop {
        let input: String = Input::new()
            .with_prompt("Payment amount")
            .default("100".into())
            .interact_text()
            .unwrap();
        match input.parse() {
            Ok(v) => break v,
            Err(_) => eprintln!("Invalid amount, try again"),
        }
    };

    let customer_id: String = Input::new()
        .with_prompt("Customer ID (64 hex chars)")
        .default("00000000000000000000000000000000000000000000000000000000deadbeef".into())
        .interact_text()
        .unwrap();

    println!("\nSubmitting proof to contract...");

    let url = format!("{}/payment/submit-to-contract", api_url());
    let req = serde_json::json!({
        "seed": seed,
        "amount": amount,
        "customer_id": customer_id,
    });

    match ureq::post(&url).send_json(&req) {
        Ok(resp) => {
            match resp.into_body().read_json::<SubmitResponse>() {
                Ok(r) => {
                    if r.success {
                        println!("\n✅ Proof submitted to contract!");
                        if let Some(tx) = r.tx_hash {
                            println!("   Tx: {}", tx);
                        }
                    } else {
                        println!("\n❌ Submission failed");
                        if let Some(e) = r.error {
                            println!("   Error: {}", e);
                        }
                    }
                }
                Err(e) => eprintln!("❌ Failed to parse response: {e}"),
            }
        }
        Err(e) => eprintln!("❌ API error: {e}"),
    }
}

fn main() {
    let mut seed: Option<String> = None;

    loop {
        println!("\n═══════════════════════════════");
        println!("   🔐 POS Payment Terminal");
        println!("═══════════════════════════════");

        let selection = Select::new()
            .items(&menu_items())
            .default(0)
            .interact()
            .unwrap();

        match selection {
            0 => {
                if let Some(r) = create_merchant() {
                    seed = Some(r.seed);
                }
            }
            1 => {
                let s = match seed.as_ref() {
                    Some(s) => s.clone(),
                    None => {
                        let input: String = Input::new()
                            .with_prompt("Merchant seed")
                            .interact_text()
                            .unwrap();
                        seed = Some(input.clone());
                        input
                    }
                };
                generate_proof(&s);
            }
            2 => verify_proof_menu(),
            3 => {
                let s = match seed.as_ref() {
                    Some(s) => s.clone(),
                    None => {
                        let input: String = Input::new()
                            .with_prompt("Merchant seed")
                            .interact_text()
                            .unwrap();
                        seed = Some(input.clone());
                        input
                    }
                };
                submit_to_contract(&s);
            }
            4 => {
                println!("\n👋 Goodbye!");
                break;
            }
            _ => unreachable!(),
        }

        if selection != 4 {
            if !Confirm::new()
                .with_prompt("\nBack to menu?")
                .default(true)
                .interact()
                .unwrap()
            {
                println!("\n👋 Goodbye!");
                break;
            }
        }
    }
}
