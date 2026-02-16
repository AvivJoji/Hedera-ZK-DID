# System Architecture & Workflow

## The Core Concept: Decentralized Identity (DID)
This project implements a **Trust Triangle** using the Hedera Blockchain as the "Root of Trust".

### 1. The Components
*   **The Smart Contract (`DidManage.sol`):** The "Brain" of the system. It lives on the Hedera Testnet and acts as the immutable registry. It stores:
    *   **Identities (DIDs):** Who is registered (University, Students).
    *   **Credentials:** Hashes of issued certificates (not the private data, just the proof).
*   **The CLI Tool (The Issuer/University):** A secure backend tool used to "Sign and Issue" credentials. It talks to the Smart Contract using an Administrator/Issuer Private Key.
*   **The Dashboard (The Verifier):** A public web interface. It connects to the Smart Contract to check if a specific credential is valid.

## How It Works (Step-by-Step)

### Step 1: Identity Creation (The Setup)
*   **Action:** You ran `did-cli did create`.
*   **Technical:** Your script generated an Ethereum-compatible address (EVM Address) and sent a transaction to the Smart Contract.
*   **Result:** The contract recorded your address as a "Valid DID". You also granted yourself the "ISSUER_ROLE", allowing you to write to the ledger.

### Step 2: Issuance (The University)
*   **Action:** You ran `did-cli credential issue ... --file credential.json`.
*   **Technical:** 
    1.  The CLI read your JSON file (Name: Joji, Degree: B.Tech).
    2.  It created a **Cryptographic Hash** (a unique fingerprint) of that data: `0xd315...`.
    3.  It sent a transaction to the Smart Contract saying: *"I, the University, attest that User 0x7dcb owns Hash 0xd315"*.
*   **Result:** The Smart Contract stored this mapping: `_credentialsByHash[0x7dcb][0xd315] = true`. This is now immutable on the blockchain.

### Step 3: Verification (The Employer)
*   **Action:** You opened the Dashboard and entered the Address (`0.0.5892919`) and Hash (`0xd315...`).
*   **Technical:**
    1.  The Dashboard converted your Hedera ID (`0.0.5892919`) back to the EVM Address (`0x7dcb...`).
    2.  It sent a **Query** to the Smart Contract function `verifyCredential(address, hash)`.
    3.  The Contract checked its storage: *Does this Address have this Hash? Is it active? Is it not expired?*
    4.  The Contract returned `TRUE`.
*   **Result:** The Dashboard received `true` and showed the Green "Valid" card.

## Why This is "Premium"?
*   **No Central Database:** If your server crashes, the verification still works because it's on Hedera.
*   **Tamper Proof:** No one can change the degree date or name without breaking the hash.
*   **Privacy:** The actual data (Name: Joji) is not on the blockchain, only the *Hash*. You only share the data with people you trust, and they verify it against the chain.
