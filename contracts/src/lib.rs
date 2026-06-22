#![no_std]
#![allow(dead_code)]

mod groth16;

use groth16::{Groth16Proof, Groth16VerifierClient};
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, token, Address, BytesN, Env, Map, Vec,
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotAuthorized = 1,
    AlreadyInitialized = 2,
    NotInitialized = 3,
    AlreadySpent = 4,
    CommitmentNotFound = 5,
    InvalidProof = 6,
    InvalidCommitment = 7,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct CommitmentData {
    pub amount: i128,
    pub asset: Address,
}

#[contracttype]
pub enum DataKey {
    Initialized,
    Verifier,
    Nullifiers,
    Commitment(BytesN<32>),
}

#[contract]
pub struct PrivacyPool;

#[contractimpl]
impl PrivacyPool {
    pub fn initialize(env: Env, verifier: Address) {
        if env.storage().instance().has(&DataKey::Initialized) {
            panic!("Already initialized");
        }
        env.storage().instance().set(&DataKey::Verifier, &verifier);
        env.storage()
            .instance()
            .set(&DataKey::Nullifiers, &Map::<BytesN<32>, bool>::new(&env));
        env.storage().instance().set(&DataKey::Initialized, &true);
    }

    pub fn deposit(
        env: Env,
        sender: Address,
        commitment: BytesN<32>,
        amount: i128,
        asset: Address,
    ) {
        sender.require_auth();

        let token_client = token::Client::new(&env, &asset);
        token_client.transfer(&sender, &env.current_contract_address(), &amount);

        env.storage()
            .instance()
            .set(
                &DataKey::Commitment(commitment),
                &CommitmentData { amount, asset },
            );
    }

    pub fn withdraw_private(
        env: Env,
        recipient: Address,
        proof: Groth16Proof,
        public_inputs: Vec<BytesN<32>>,
        nullifier: BytesN<32>,
        commitment: BytesN<32>,
    ) -> Result<(), Error> {
        if !env.storage().instance().has(&DataKey::Initialized) {
            return Err(Error::NotInitialized);
        }

        let mut nullifiers: Map<BytesN<32>, bool> = env
            .storage()
            .instance()
            .get(&DataKey::Nullifiers)
            .unwrap();

        if nullifiers.contains_key(nullifier.clone()) {
            return Err(Error::AlreadySpent);
        }

        let data: CommitmentData = env
            .storage()
            .instance()
            .get(&DataKey::Commitment(commitment.clone()))
            .ok_or(Error::CommitmentNotFound)?;

        let verifier: Address = env
            .storage()
            .instance()
            .get(&DataKey::Verifier)
            .unwrap();

        let verifier_client = Groth16VerifierClient::new(&env, &verifier);
        if !verifier_client.verify(&proof, &public_inputs) {
            return Err(Error::InvalidProof);
        }

        nullifiers.set(nullifier, true);
        env.storage()
            .instance()
            .set(&DataKey::Nullifiers, &nullifiers);

        let token_client = token::Client::new(&env, &data.asset);
        token_client.transfer(&env.current_contract_address(), &recipient, &data.amount);

        env.storage()
            .instance()
            .remove(&DataKey::Commitment(commitment));

        Ok(())
    }

    pub fn get_total_deposits(env: Env) -> u128 {
        let _ = env;
        0
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;
    use soroban_sdk::{vec, BytesN, Env};

    mod mock_token {
        use soroban_sdk::{
            contract, contractimpl, contracttype, Address, Env, Symbol,
        };

        #[contracttype]
        pub enum DataKey {
            Balance(Address),
        }

        #[contract]
        pub struct MockToken;

        #[contractimpl]
        impl MockToken {
            pub fn init(env: Env, _admin: Address, _decimal: u32) {
                env.storage()
                    .instance()
                    .set(&Symbol::new(&env, "init"), &true);
            }

            pub fn balance(env: Env, addr: Address) -> i128 {
                env.storage()
                    .persistent()
                    .get::<DataKey, i128>(&DataKey::Balance(addr))
                    .unwrap_or(0)
            }

            pub fn transfer(env: Env, from: Address, to: Address, amount: i128) {
                from.require_auth();
                let from_bal = env
                    .storage()
                    .persistent()
                    .get::<DataKey, i128>(&DataKey::Balance(from.clone()))
                    .unwrap_or(0);
                let to_bal = env
                    .storage()
                    .persistent()
                    .get::<DataKey, i128>(&DataKey::Balance(to.clone()))
                    .unwrap_or(0);
                env.storage()
                    .persistent()
                    .set(&DataKey::Balance(from), &(from_bal - amount));
                env.storage()
                    .persistent()
                    .set(&DataKey::Balance(to), &(to_bal + amount));
            }

            pub fn mint(env: Env, addr: Address, amount: i128) {
                let bal = env
                    .storage()
                    .persistent()
                    .get::<DataKey, i128>(&DataKey::Balance(addr.clone()))
                    .unwrap_or(0);
                env.storage()
                    .persistent()
                    .set(&DataKey::Balance(addr), &(bal + amount));
            }
        }
    }

    #[contract]
    struct MockVerifier;

    #[contractimpl]
    impl MockVerifier {
        pub fn verify(_env: Env, _proof: Groth16Proof, _public_inputs: Vec<BytesN<32>>) -> bool {
            true
        }
    }

    fn setup_test_env<'a>(
        env: &'a Env,
    ) -> (Address, Address, mock_token::MockTokenClient<'a>, PrivacyPoolClient<'a>) {
        let verifier_id = env.register_contract(None, MockVerifier);
        let token_id = env.register_contract(None, mock_token::MockToken);
        let pool_id = env.register_contract(None, PrivacyPool);

        let token = mock_token::MockTokenClient::new(env, &token_id);
        let pool = PrivacyPoolClient::new(env, &pool_id);

        let alice = Address::generate(env);
        token.mint(&alice, &1000);

        pool.initialize(&verifier_id);

        (token_id, alice, token, pool)
    }

    #[test]
    fn test_deposit_and_withdraw() {
        let env = Env::default();
        env.mock_all_auths();
        let (token_id, alice, _token, pool) = setup_test_env(&env);

        let commitment = BytesN::from_array(&env, &[1u8; 32]);
        pool.deposit(&alice, &commitment, &100, &token_id);

        let a = BytesN::from_array(&env, &[0u8; 64]);
        let b = BytesN::from_array(&env, &[0u8; 128]);
        let c = BytesN::from_array(&env, &[0u8; 64]);
        let proof = Groth16Proof { a, b, c };

        let nullifier = BytesN::from_array(&env, &[2u8; 32]);
        let public_inputs = vec![
            &env,
            nullifier.clone(),
            commitment.clone(),
            BytesN::from_array(&env, &[3u8; 32]),
        ];

        let bob = Address::generate(&env);
        pool.withdraw_private(&bob, &proof, &public_inputs, &nullifier, &commitment);
    }

    #[test]
    #[should_panic(expected = "Error(Contract, #4)")]
    fn test_rejects_double_spend() {
        let env = Env::default();
        env.mock_all_auths();
        let (token_id, alice, _token, pool) = setup_test_env(&env);

        let commitment = BytesN::from_array(&env, &[1u8; 32]);
        pool.deposit(&alice, &commitment, &100, &token_id);

        let a = BytesN::from_array(&env, &[0u8; 64]);
        let b = BytesN::from_array(&env, &[0u8; 128]);
        let c = BytesN::from_array(&env, &[0u8; 64]);
        let proof = Groth16Proof { a, b, c };

        let nullifier = BytesN::from_array(&env, &[2u8; 32]);
        let public_inputs = vec![
            &env,
            nullifier.clone(),
            commitment.clone(),
            BytesN::from_array(&env, &[3u8; 32]),
        ];

        let bob = Address::generate(&env);
        pool.withdraw_private(&bob, &proof, &public_inputs, &nullifier, &commitment);
        pool.withdraw_private(&bob, &proof, &public_inputs, &nullifier, &commitment);
    }

    #[test]
    #[should_panic(expected = "Error(Contract, #3)")]
    fn test_rejects_uninitialized() {
        let env = Env::default();
        env.mock_all_auths();

        let pool_id = env.register_contract(None, PrivacyPool);
        let pool = PrivacyPoolClient::new(&env, &pool_id);

        let a = BytesN::from_array(&env, &[0u8; 64]);
        let b = BytesN::from_array(&env, &[0u8; 128]);
        let c = BytesN::from_array(&env, &[0u8; 64]);
        let proof = Groth16Proof { a, b, c };

        pool.withdraw_private(
            &Address::generate(&env),
            &proof,
            &vec![&env],
            &BytesN::from_array(&env, &[0u8; 32]),
            &BytesN::from_array(&env, &[0u8; 32]),
        );
    }
}
