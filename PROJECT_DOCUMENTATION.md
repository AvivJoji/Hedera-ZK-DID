# Hedera Decentralized Identity (DID) Management System

## 1. Project Overview
The **Hedera DID Management System** is a blockchain-based application designed to implement Self-Sovereign Identity (SSI) principles using the Hedera Hashgraph network. It enables users to create and manage Decentralized Identifiers (DIDs), allows trusted issuers to issue Verifiable Credentials (VCs), and permits verifiers to validate these credentials securely and transparently.

The system addresses the need for a persistent, tamper-proof, and user-centric identity management solution, moving away from centralized identity providers. It leverage's Hedera's high throughput and low fees to provide a scalable solution for digital identity.

**Real-world problem it solves:**
*   Eliminates reliance on centralized authorities for identity verification.
*   Prevents data breaches associated with central databases.
*   Gives users full control over their own identity and credentials.
*   Reduces fraud through cryptographic verification of credentials.

## 2. Problem Statement
**Current System Challenges:**
*   **Centralization:** Identity data is stored in silos (Google, Facebook, Government DBs), creating single points of failure.
*   **Privacy Risks:** Users trackable across services; data often sold without consent.
*   **Lack of Portability:** specialized credentials (degrees, licenses) are hard to verify instantly across borders or organizations.
*   **Security:** Digital certificates are easily forged or copied.

**Statement:**
Design and develop a decentralized application that allows entities to issue, hold, and verify digital credentials without a central intermediary, ensuring data integrity, privacy, and user sovereignty.

## 3. Objectives
*   Develop a **Smart Contract** on Hedera to manage the lifecycle of DIDs and Credentials.
*   Implement **Role-Based Access Control (RBAC)** to distinguish between Admins, Issuers, and regular Users.
*   Create a **Command Line Interface (CLI)** for easy interaction with the blockchain.
*   Enable **Cryptographic Verification** of credentials to prevent forgery.
*   Ensure **Scalability** and **Low Cost** operations suitable for enterprise adoption.

**Measurable Goals:**
*   Successful deployment of the `DidManage` contract to Hedera Testnet.
*   Execution of < 2 second transaction finality for credential issuance.
*   Support for standard DID operations: Create, Read, Update, Deactivate (CRUD).

## 4. Scope of the Project
**Included:**
*   Smart Contract development in Solidity.
*   Deployment scripts for Hedera network.
*   CLI tool for Admin, Issuer, and Holder operations.
*   Verification logic for VCs and Presentations.
*   On-chain storage of DID documents and Credential hashes (not full data for privacy).

**Not Included (Limitations):**
*   A web-based Frontend UI (current scope is CLI/Backend).
*   Integration with off-chain storage (IPFS) for large data payloads (metadata is currently minimal).
*   Zero-Knowledge Proof (ZKP) implementation (future scope).

## 5. Proposed Solution
The solution utilizes the **Hedera Smart Contract Service (HSCS)**. Instead of storing sensitive personal data on the blockchain, we store **DIDs** (mapping public keys to users) and **Hashes of Credentials**.
*   **Identity:** Users generate a DID on-chain linked to their public key.
*   **Issuance:** Issuers allow-listed by an Admin can issue credentials. The system records the *hash* of the credential, its validity status, expiration, and schema ID.
*   **Verification:** Verifiers hash the off-chain credential provided by the user and compare it against the on-chain hash to prove authenticity.

## 6. System Architecture
The system follows a layered architecture:

**1. Application Layer (CLI):**
*   Node.js application using `commander` for command parsing.
*   Interacts with the user for inputs (Private Keys, DID data).

**2. Service Layer (SDK/Libraries):**
*   **Hedera SDK / Ethers.js:** Handles cryptographic signing and transaction submission.
*   **Configuration Manager:** Manages network settings and account credentials.

**3. Blockchain Layer (Hedera Network):**
*   **Smart Contract (`DidManage.sol`):** The core logic engine.
*   **EVM (Ethereum Virtual Machine):** Executes the contract bytecode on Hedera nodes.
*   **Consensus Service:** Orders transactions timestamped and fair.

**Data Flow:**
`User Input (CLI)` → `Transaction Object Construction` → `Signing (Local)` → `Submission to Hedera Network` → `Smart Contract Execution` → `State Update (Ledger)` → `Event Emission` → `CLI Output`.

## 7. Technology Stack
| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Blockchain** | Hedera Hashgraph | High speed (10k TPS), low fixed fees, EVM compatibility. |
| **Smart Contract** | Solidity (v0.8.17) | Industry standard, strong typing, wide tooling support. |
| **Backend / CLI** | Node.js | Non-blocking I/O perfect for CLI, massive package ecosystem. |
| **Libraries** | Ethers.js, Hedera SDK | Robust libraries for blockchain interaction. |
| **Framework** | OpenZeppelin | Battle-tested security primitives (AccessControl, Pausable). |

## 8. Detailed Module Description

### A. Smart Contract Module (`DidManage.sol`)
*   **Purpose:** Core logic provider on the blockchain.
*   **Key Data Structures:**
    *   `DID`: Struct storing Public Key and existence flag.
    *   `Credential`: Struct storing issuer address, validity, expiration, and schema.
    *   `Roles`: `ADMIN_ROLE`, `ISSUER_ROLE`.
*   **Key Functions:**
    *   `createDID`: Registers a new identity.
    *   `issueCredential`: Records a credential hash on-chain (Issuer only).
    *   `verifyCredential`: Checks validity and expiration.

### B. CLI Module (`did-cli`)
*   **Purpose:** User interface for interacting with the system.
*   **Sub-commands:**
    *   `did`: Manages identity creation and retrieval.
    *   `credential`: Handles lifecycle of VCs (issue, revoke, suspend).
    *   `presentation`: Manages proof of ownership.
    *   `admin`: Governance commands (granting issuer roles).

### C. Scripts Module
*   **Purpose:** Automate deployment and testing.
*   **Files:**
    *   `deploy.js`: Compiles and deploys the contract.
    *   `issuer.js / holder.js / verifier.js`: Simulate specific user workflows for testing.

## 9. Workflow / Algorithm Steps

**Use Case: University Degree Issuance**

1.  **Deployment:** Admin deploys `DidManage` contract.
2.  **Setup:** Admin grants `ISSUER_ROLE` to University Node address.
3.  **Registration:** Student (Holder) runs `did create` to register their public key.
4.  **Issuance:**
    *   University hashes the degree data + Student DID.
    *   University calls `issueCredential(studentAddress, hash, expiry, schema)`.
5.  **Presentation:**
    *   Student wants to prove degree to an Employer.
    *   Student creates a presentation hash.
6.  **Verification:**
    *   Employer receives credential details.
    *   Employer calls `verifyCredential()` with the hash.
    *   Contract checks: `exists?`, `valid?`, `not expired?`, `not revoked?`.
    *   Returns `true/false`.

## 10. Implementation Details
**Folder Structure:**
```
root/
├── contracts/          # Solidity source files
│   └── DidManage.sol   # Main contract
├── bin/                # CLI entry point
│   └── did-cli.js
├── lib/                # CLI logic implementation
│   ├── commands/       # Command handlers (did, credential, admin)
│   └── utils/          # Helpers (config, rendering)
├── scripts/            # Deployment and test scripts
│   ├── deploy.js
│   └── issuer.js
└── package.json        # Dependencies and metadata
```

**Key API/CLI Endpoints:**
*   `did-cli did create <publicKey>`
*   `did-cli credential issue --holder <address> --hash <hash>`
*   `did-cli credential verify --holder <address> --hash <hash>`

## 11. Dataset / Data Collection
*   **Not Applicable for AI Training:** This is a deterministic system, not an ML model.
*   **Test Data:** Synthetic data used for validation (Mock Public Keys, Sha256 hashes of dummy "Degree Certificates").

## 12. Testing & Validation

**Testing Strategy:**
1.  **Unit Testing:** Testing individual Solidity functions using Remix/Hardhat.
2.  **Integration Testing:** Using the CLI to perform end-to-end flows on Hedera Testnet.

**Test Cases:**

| ID | Test Case | Input | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- |
| TC01 | Create DID | Valid Public Key | DIDCreated Event emitted | Pass |
| TC02 | Create Duplicate DID | Existing Address | Revert: DIDAlreadyExists | Pass |
| TC03 | Issue Credential | Valid Holder & Hash | CredentialIssued Event | Pass |
| TC04 | Verify Expired Credential | Expired Hash | Return False | Pass |
| TC05 | Unauthorized Issue | Non-Issuer Account | Revert: NotIssuerError | Pass |

## 13. Results / Output Screens
**System Outputs:**
*   **Console Logs:** Transaction receipts containing Transaction ID and status `SUCCESS`.
*   **Blockchain Explorer:** Transactions visible on `hashscan.io` verifying the state changes.
*   **Verification:** Boolean output `true` (Valid) or `false` (Invalid) when checking credentials.

*(Screenshots of CLI execution and Hashscan transaction records would be inserted here in the final report)*

## 14. Challenges Faced
1.  **Gas Limit Optimization:** Initial contracts exceeded local gas limits; optimized struct packing in Solidity to reduce cost.
2.  **Environment Configuration:** Managing sensitive private keys securely in `.env` files across different test scripts.
3.  **Hedera Latency:** waiting for consensus finality required implementing generic `sleep` functions in scripts to avoid fetching data before propagation.

## 15. Future Enhancements
*   **W3C Compliance:** Fully align the DID document format with strict W3C JSON-LD standards.
*   **Frontend Dashboard:** React.js dashboard for easier management by non-technical Issuers.
*   **Privacy-Preserving Proofs:** Implement ZK-SNARKs so users can prove "Over 18" without revealing birthdate.

## 16. Conclusion
The **Hedera DID Management System** successfully demonstrates the power of decentralized identity. By leveraging Hedera's high-performance network, we constructed a secure, immutable, and efficient platform for credential management. This project paves the way for a future where users own their digital identity, reducing fraud and increasing trust in digital interactions.
