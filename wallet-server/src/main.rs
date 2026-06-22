use std::net::SocketAddr;
use std::sync::Arc;

use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
    routing::post,
    Router,
};
use circuits::{serialization, PrivacyProofSystem};
use ark_ff::PrimeField;
use serde::{Deserialize, Serialize};
use wallet_core::{Network, TransactionBuilder};

const PRIVACY_POOL_ID: &str = "CCJZ5DG7B2G5XMJHY7XLX2Y77HPRGM3GQ7JX2Q5XH6XJ5K2Z5PRIVACY";

#[derive(Deserialize)]
#[allow(dead_code)]
struct PrivateTxRequest {
    proof_hex: String,
    nullifier_hex: String,
    commitment_hex: String,
    encrypted_hex: String,
    merkle_root_hex: String,
    recipient: String,
    amount: u64,
    asset: String,
}

#[derive(Serialize)]
struct TxResponse {
    tx_hash: String,
    status: String,
}

#[derive(Clone)]
struct AppState {
    system: Arc<PrivacyProofSystem>,
}

fn verify_zk_proof(state: &AppState, req: &PrivateTxRequest) -> Result<bool, StatusCode> {
    let proof = serialization::deserialize_proof_hex(&req.proof_hex)
        .map_err(|_| StatusCode::BAD_REQUEST)?;
    let nullifier = circuits::ark_bn254::Fr::from_le_bytes_mod_order(
        &hex::decode(&req.nullifier_hex).map_err(|_| StatusCode::BAD_REQUEST)?,
    );
    let commitment = circuits::ark_bn254::Fr::from_le_bytes_mod_order(
        &hex::decode(&req.commitment_hex).map_err(|_| StatusCode::BAD_REQUEST)?,
    );
    let encrypted = circuits::ark_bn254::Fr::from_le_bytes_mod_order(
        &hex::decode(&req.encrypted_hex).map_err(|_| StatusCode::BAD_REQUEST)?,
    );
    let merkle_root = circuits::ark_bn254::Fr::from_le_bytes_mod_order(
        &hex::decode(&req.merkle_root_hex).map_err(|_| StatusCode::BAD_REQUEST)?,
    );

    state
        .system
        .verify(&proof, &nullifier, &commitment, &encrypted, &merkle_root)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

async fn submit_private_tx(
    State(state): State<AppState>,
    Json(payload): Json<PrivateTxRequest>,
) -> Result<Json<TxResponse>, StatusCode> {
    let valid = verify_zk_proof(&state, &payload)?;
    if !valid {
        return Err(StatusCode::BAD_REQUEST);
    }

    let rpc_url = Network::Futurenet.rpc_url();
    let tx = TransactionBuilder::new(Network::Futurenet)
        .contract_call(PRIVACY_POOL_ID, "withdraw_private")
        .arg(&payload.recipient)
        .arg(&payload.proof_hex)
        .arg(&payload.commitment_hex)
        .build();

    let client = reqwest::Client::new();
    let body = serde_json::json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "sendTransaction",
        "params": {
            "transaction": tx,
        }
    });

    let resp = client
        .post(rpc_url)
        .json(&body)
        .send()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let resp_json: serde_json::Value = resp
        .json()
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let tx_hash = resp_json["result"]["hash"]
        .as_str()
        .unwrap_or("unknown")
        .to_string();
    let status = resp_json["result"]["status"]
        .as_str()
        .unwrap_or("unknown")
        .to_string();

    Ok(Json(TxResponse { tx_hash, status }))
}

#[tokio::main]
async fn main() {
    let system = Arc::new(PrivacyProofSystem::setup());
    let state = AppState { system };

    let app = Router::new()
        .route("/api/private-send", post(submit_private_tx))
        .route("/api/health", post(|| async { "OK" }))
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
