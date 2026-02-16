# Task List

## Phase 1: Backend & Deployment (Prerequisite)
- [x] Compile Smart Contract (`DidManage.sol`) <!-- id: 0 -->
- [x] Deploy to Hedera Testnet & Get Contract ID <!-- id: 1 -->
- [x] Update `config.js` with live Contract ID <!-- id: 2 -->

## Phase 2: Web Dashboard (Frontend)
- [x] Initialize React Project (`/dashboard`) <!-- id: 3 -->
- [x] Install dependencies (Hedera SDK, etc.) <!-- id: 4 -->
- [x] Implement **Verification Portal** (Public View) <!-- id: 5 -->
    - [x] Input field for Credential Hash
    - [x] Status Display (Valid/Invalid/Revoked)
- [x] Implement **Issuer Dashboard** (Private View) <!-- id: 6 -->
    - [x] "Connect Wallet" (or use env keys for demo)
    - [x] Form to Issue Credential
- [x] Connect Frontend to Smart Contract <!-- id: 7 -->

## Phase 3: Final Polish
- [x] "Live Demo" Script Rehearsal <!-- id: 8 -->

## Phase 4: Zero Knowledge Proofs (Privacy)
- [x] Install `snarkjs` & `circomlib` <!-- id: 9 -->
- [x] Create `credential.circom` Circuit <!-- id: 10 -->
- [x] Create Circuit Compilation Script <!-- id: 11 -->
- [x] Integrate ZK Proof Generation in Holder Dashboard <!-- id: 12 -->
- [x] Integrate ZK Verification in Verifier Dashboard <!-- id: 13 -->

