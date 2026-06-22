use circuits::{PrivacyProofSystem};

#[derive(Clone, Debug)]
pub struct ViewingKey([u8; 32]);

impl ViewingKey {
    pub fn to_hex(&self) -> String {
        hex::encode(self.0)
    }

    pub fn from_hex(s: &str) -> Result<Self, String> {
        let bytes = hex::decode(s).map_err(|e| e.to_string())?;
        let mut arr = [0u8; 32];
        if bytes.len() != 32 {
            return Err("invalid viewing key length".into());
        }
        arr.copy_from_slice(&bytes);
        Ok(ViewingKey(arr))
    }
}

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct PrivateSend {
    pub proof_hex: String,
    pub nullifier_hex: String,
    pub commitment_hex: String,
    pub encrypted_hex: String,
    pub merkle_root_hex: String,
    pub recipient: String,
    pub amount: u64,
    pub asset: String,
}

impl PrivateSend {
    pub fn to_hex(&self) -> String {
        serde_json::to_string(self).unwrap_or_default()
    }

    pub fn from_hex(s: &str) -> Result<Self, String> {
        serde_json::from_str(s).map_err(|e| e.to_string())
    }
}

pub struct Wallet {
    secret: [u8; 32],
    system: PrivacyProofSystem,
}

impl Wallet {
    pub fn from_seed(seed: &str) -> Self {
        let hash = blake3::hash(seed.as_bytes());
        let mut secret = [0u8; 32];
        secret.copy_from_slice(hash.as_bytes());
        let system = PrivacyProofSystem::setup();
        Wallet { secret, system }
    }

    pub fn generate_proof(
        &self,
        recipient: &str,
        amount: u64,
        _asset: &str,
    ) -> Result<PrivateSend, String> {
        let mut recipient_bytes = [0u8; 32];
        let recipient_hash = blake3::hash(recipient.as_bytes());
        recipient_bytes.copy_from_slice(recipient_hash.as_bytes());

        let (proof, nullifier, commitment, encrypted, merkle_root) = self
            .system
            .prove(&self.secret, amount, &recipient_bytes, circuits::ark_bn254::Fr::from(0u64))
            .map_err(|e| e.to_string())?;

        let (sproof, sinputs) = PrivacyProofSystem::to_serializable_proof(
            &proof, &nullifier, &commitment, &encrypted, &merkle_root,
        );

        Ok(PrivateSend {
            proof_hex: hex::encode(&sproof.a),
            nullifier_hex: hex::encode(&sinputs.nullifier),
            commitment_hex: hex::encode(&sinputs.commitment),
            encrypted_hex: hex::encode(&sinputs.encrypted_recipient),
            merkle_root_hex: hex::encode(&sinputs.merkle_root),
            recipient: recipient.to_string(),
            amount,
            asset: String::new(),
        })
    }

    pub fn derive_viewing_key(&self) -> ViewingKey {
        let hash = blake3::hash(b"viewing_key:");
        let mut hasher = blake3::Hasher::new();
        hasher.update(hash.as_bytes());
        hasher.update(&self.secret);
        let result = hasher.finalize();
        let mut key = [0u8; 32];
        key.copy_from_slice(result.as_bytes());
        ViewingKey(key)
    }

    pub fn decrypt_tx(&self, _viewing_key: &str, data: &str) -> String {
        format!("decrypted({})", data)
    }
}

#[derive(Clone, Debug)]
pub enum Network {
    Futurenet,
    Testnet,
    Mainnet,
}

impl Network {
    pub fn rpc_url(&self) -> &str {
        match self {
            Network::Futurenet => "https://rpc-futurenet.stellar.org",
            Network::Testnet => "https://soroban-testnet.stellar.org",
            Network::Mainnet => "https://soroban.stellar.org",
        }
    }
}

pub struct TransactionBuilder {
    network: Network,
    contract_id: String,
    method: String,
    args: Vec<String>,
}

impl TransactionBuilder {
    pub fn new(network: Network) -> Self {
        TransactionBuilder {
            network,
            contract_id: String::new(),
            method: String::new(),
            args: Vec::new(),
        }
    }

    pub fn contract_call(mut self, contract_id: &str, method: &str) -> Self {
        self.contract_id = contract_id.to_string();
        self.method = method.to_string();
        self
    }

    pub fn arg(mut self, arg: &str) -> Self {
        self.args.push(arg.to_string());
        self
    }

    pub fn build(&self) -> String {
        serde_json::json!({
            "network": format!("{:?}", self.network),
            "contract_id": self.contract_id,
            "method": self.method,
            "args": self.args,
        })
        .to_string()
    }
}
