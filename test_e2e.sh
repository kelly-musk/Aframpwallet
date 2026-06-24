#!/usr/bin/env bash
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

CONTRACT_ID="${CONTRACT_ID:-CA23SNSLINP3SFVUUCRWNHDNKWYQ23UFURUOTZDZMNSOKM2O63V2MP2Y}"
API_BASE="http://localhost:3000/api"
PASS=0
FAIL=0

# Unique amounts per run to avoid stale nullifier collisions
AMOUNT_MAIN=$((54321 + RANDOM % 10000))
AMOUNT_FRESH=$((99999 + RANDOM % 10000))

cleanup() {
    echo ""
    echo "Cleaning up..."
    kill "$API_PID" 2>/dev/null || true
    wait "$API_PID" 2>/dev/null || true
    echo "Done."
}
trap cleanup EXIT

assert_eq() {
    local desc="$1" expected="$2" actual="$3"
    # Normalize: lowercase and trim
    local e_norm a_norm
    e_norm=$(echo "$expected" | tr '[:upper:]' '[:lower:]' | xargs)
    a_norm=$(echo "$actual" | tr '[:upper:]' '[:lower:]' | xargs)
    if [ "$e_norm" = "$a_norm" ] || [ "$expected" = "$actual" ]; then
        echo "  ✅ $desc"
        PASS=$((PASS + 1))
    else
        echo "  ❌ $desc"
        echo "     expected: $expected"
        echo "     actual:   $actual"
        FAIL=$((FAIL + 1))
    fi
}

# ═══════════════════════════════════════════════════
echo "═══════════════════════════════════════════════════════════════"
echo "  End-to-End Integration Test — Privacy Payment System"
echo "═══════════════════════════════════════════════════════════════"

# ─────────────────────────────────────────────────
# 1. Build all crates
# ─────────────────────────────────────────────────
echo ""
echo "═══ 1/12 Build all crates ═══"
cargo build -p privacy-circuits -p privacy-cli -p merchant-api -p pos-client 2>&1

# ─────────────────────────────────────────────────
# 2. Circuit unit tests
# ─────────────────────────────────────────────────
echo ""
echo "═══ 2/12 Circuit unit tests ═══"
cargo test -p privacy-circuits 2>&1

# ─────────────────────────────────────────────────
# 3. Contract unit tests
# ─────────────────────────────────────────────────
echo ""
echo "═══ 3/12 Contract unit tests ═══"
cargo test -p privacy-contract 2>&1

# ─────────────────────────────────────────────────
# 4. Ensure .merchant/ seed exists (matching deployed VK)
# ─────────────────────────────────────────────────
echo ""
echo "═══ 4/12 Prepare contract-compatible merchant seed ═══"

if [ -f .merchant/seed ]; then
    MERCHANT_SEED_VAL=$(head -c 64 .merchant/seed)
    echo "  Using existing merchant from .merchant/seed"
else
    echo "  Creating new merchant + initializing contract..."
    cargo run -p privacy-cli -- init-contract "$CONTRACT_ID" 2>&1
    MERCHANT_SEED_VAL=$(head -c 64 .merchant/seed)
fi
echo "  Seed: $MERCHANT_SEED_VAL"

export CONTRACT_ID="$CONTRACT_ID"
export MERCHANT_SEED="$MERCHANT_SEED_VAL"

# ─────────────────────────────────────────────────
# 5. Start merchant-api in background
# ─────────────────────────────────────────────────
echo ""
echo "═══ 5/12 Start merchant-api ═══"
cargo build -p merchant-api 2>&1 | tail -1
MERCHANT_BIN="./target/debug/merchant-api"
$MERCHANT_BIN &
API_PID=$!
echo "  PID: $API_PID"

for i in $(seq 1 30); do
    if curl -sf "$API_BASE/merchant/create" > /dev/null 2>&1; then
        echo "  API ready (after ${i}s)"
        break
    fi
    sleep 1
done

# ─────────────────────────────────────────────────
# 6. Create merchant via API (uses fixed seed)
# ─────────────────────────────────────────────────
echo ""
echo "═══ 6/12 Create merchant via API ═══"
CREATE_RESP=$(curl -s -X POST "$API_BASE/merchant/create")
echo "  Response: $CREATE_RESP"
MERCHANT_SEED_VAL=$(echo "$CREATE_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['seed'])")
MERCHANT_ID=$(echo "$CREATE_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['merchant_id'])")
assert_eq "Got 64-char seed" 64 "${#MERCHANT_SEED_VAL}"
assert_eq "Got 64-char merchant ID" 64 "${#MERCHANT_ID}"

# ─────────────────────────────────────────────────
# 7. Generate proof via API (use unique amount to avoid stale nullifier)
# ─────────────────────────────────────────────────
echo ""
echo "═══ 7/12 Generate proof via API ═══"
AMOUNT=$AMOUNT_MAIN
CUSTOMER="00000000000000000000000000000000000000000000000000000000deadbeef"
PROOF_RESP=$(curl -s -X POST "$API_BASE/payment/generate-proof" \
    -H "Content-Type: application/json" \
    -d "{\"seed\":\"$MERCHANT_SEED_VAL\",\"amount\":$AMOUNT,\"customer_id\":\"$CUSTOMER\"}")
echo "  Response: $PROOF_RESP"
PROOF_A=$(echo "$PROOF_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['proof']['a'])")
PROOF_B=$(echo "$PROOF_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['proof']['b'])")
PROOF_C=$(echo "$PROOF_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['proof']['c'])")
NULLIFIER=$(echo "$PROOF_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['nullifier'])")
COMMITMENT=$(echo "$PROOF_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['commitment'])")
assert_eq "Proof A is 128 hex chars" 128 "${#PROOF_A}"
assert_eq "Proof B is 256 hex chars" 256 "${#PROOF_B}"
assert_eq "Proof C is 128 hex chars" 128 "${#PROOF_C}"
assert_eq "Nullifier is 64 hex chars" 64 "${#NULLIFIER}"
assert_eq "Commitment is 64 hex chars" 64 "${#COMMITMENT}"

# ─────────────────────────────────────────────────
# 8. Verify proof locally via API
# ─────────────────────────────────────────────────
echo ""
echo "═══ 8/12 Verify proof locally via API ═══"
VERIFY_RESP=$(curl -s -X POST "$API_BASE/payment/verify" \
    -H "Content-Type: application/json" \
    -d "{\"seed\":\"$MERCHANT_SEED_VAL\",\"a\":\"$PROOF_A\",\"b\":\"$PROOF_B\",\"c\":\"$PROOF_C\",\"nullifier\":\"$NULLIFIER\",\"commitment\":\"$COMMITMENT\"}")
echo "  Response: $VERIFY_RESP"
VALID=$(echo "$VERIFY_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['valid'])")
assert_eq "Proof is valid" "true" "$VALID"

# ─────────────────────────────────────────────────
# 9. Submit proof to on-chain contract via API
# ─────────────────────────────────────────────────
echo ""
echo "═══ 9/12 Submit proof to on-chain contract ═══"
SUBMIT_RESP=$(curl -s -X POST "$API_BASE/payment/submit-to-contract" \
    -H "Content-Type: application/json" \
    -d "{\"seed\":\"$MERCHANT_SEED_VAL\",\"amount\":$AMOUNT,\"customer_id\":\"$CUSTOMER\"}")
echo "  Response: $SUBMIT_RESP"
SUCCESS=$(echo "$SUBMIT_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['success'])")
assert_eq "On-chain submission succeeds" "true" "$SUCCESS"

# ─────────────────────────────────────────────────
# 10. Check nullifier is marked used
# ─────────────────────────────────────────────────
echo ""
echo "═══ 10/12 Check nullifier is marked used ═══"
NULLIFIER_DEC=$(python3 -c "print(int('$NULLIFIER', 16))")
NULLIFIER_CHECK=$(soroban contract invoke \
    --id "$CONTRACT_ID" --source alice --network testnet \
    -- is_nullifier_used --nullifier "$NULLIFIER_DEC" 2>&1 || true)
# Extract just the boolean (ignore the read-only simulation hint)
NULLIFIER_RESULT=$(echo "$NULLIFIER_CHECK" | grep -o 'true\|false' | tail -1)
echo "  Result: $NULLIFIER_RESULT"
assert_eq "Nullifier is marked used" "true" "$NULLIFIER_RESULT"

# ─────────────────────────────────────────────────
# 11. Double-spend attempt should be rejected
# ─────────────────────────────────────────────────
echo ""
echo "═══ 11/12 Double-spend attempt (should be rejected) ═══"
DOUBLE_RESP=$(curl -s -X POST "$API_BASE/payment/submit-to-contract" \
    -H "Content-Type: application/json" \
    -d "{\"seed\":\"$MERCHANT_SEED_VAL\",\"amount\":$AMOUNT,\"customer_id\":\"$CUSTOMER\"}")
echo "  Response: $DOUBLE_RESP"
DOUBLE_SUCCESS=$(echo "$DOUBLE_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['success'])")
assert_eq "Double-spend is rejected" "false" "$DOUBLE_SUCCESS"

# ─────────────────────────────────────────────────
# 12. Fresh payment with different customer works
# ─────────────────────────────────────────────────
echo ""
echo "═══ 12/12 Fresh payment (different customer) ═══"
FRESH_CUSTOMER="00000000000000000000000000000000000000000000000000000000aaaa0001"
FRESH_RESP=$(curl -s -X POST "$API_BASE/payment/submit-to-contract" \
    -H "Content-Type: application/json" \
    -d "{\"seed\":\"$MERCHANT_SEED_VAL\",\"amount\":$AMOUNT_FRESH,\"customer_id\":\"$FRESH_CUSTOMER\"}")
echo "  Response: $FRESH_RESP"
FRESH_SUCCESS=$(echo "$FRESH_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['success'])")
assert_eq "Fresh payment succeeds" "true" "$FRESH_SUCCESS"

# ─────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed"
echo "═══════════════════════════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
    exit 1
fi
