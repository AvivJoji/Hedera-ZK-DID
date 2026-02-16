# Project Walkthrough & Demo Guide

**Congratulations!** Your project is now a full-stack dApp running on the Hedera Testnet.

## 1. What We Built
*   **Live Smart Contract**: Deployed to `0.0.7763926`.
*   **Web Dashboard**: A premium, dark-mode React app for verifying credentials.
*   **CLI Tools**: For issuing credentials as the University.

## 2. How to Run the Demo (Step-by-Step)

### Step A: Start the Dashboard
Open a new terminal and run:
```bash
cd dashboard
npm run dev
```
👉 Open **http://localhost:5173** in your browser. You will see the "Hedera Identity Portal".

### Step B: Create an Identity (The Student)
In your VS Code terminal (keep the dashboard running in the other one):
```bash
node bin/did-cli.js did create
```
*Copy the Address (DID) it outputs (e.g., `0x123...`).*

### Step C: Issue a Credential (The University)
Run this command to issue a degree to yourself:
```bash
node bin/did-cli.js credential issue --holder <YOUR_ADDRESS> --hash "Degree_ComputerScience_2026"
```
*Wait for the CLI to say "Credential Issued".*

### Step D: Verify on the Dashboard (The Employer)
1.  Go to your Dashboard in the browser.
2.  Paste your **Holder Address** in the first box.
3.  Type `Degree_ComputerScience_2026` in the Hash box.
4.  Click **Verify Credential**.
5.  🎉 **You should see a Green "Valid" Card!**

## 3. Troubleshooting
*   **"Invalid":** Make sure you typed the exact same hash string ("Degree_ComputerScience_2026").
*   **"Loading forever":** Check your internet. It connects to Hedera Testnet nodes.

## 3. Zero Knowledge Proofs (Privacy Layer)

This project now supports **Privacy-Preserving Verification**. This allows a student to prove they hold a credential without revealing the credential's secret hash to the verifier.

### ⚠️ Prerequisite: Compile Circuits
Because `circom` is a binary tool, you must compile the circuits on your machine to generate the keys (`.zkey`, `.wasm`).
1. **Install Circom**: [Installation Guide](https://docs.circom.io/getting-started/installation/)
2. **Run Script**:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/compile_circuit.ps1
   ```
   *This will generate `verification_key.json` and `credential.wasm` in your `dashboard/public` folder.*

### How to Demo ZK Proofs:
1. **Holder Mode**: Click **"⚡ Generate ZK Proof"**.
   - This runs the proof generation algorithm in your browser using the secret `123456` (demo value).
   - The Proof JSON is automatically copied to your clipboard.
2. **Verifier Mode**: Scroll down to **"Verify ZK Proof"**.
3. Paste the JSON.
4. Look for the **Purple "ZK Proof Verified"** badge.
   - This proves the validity purely using math (cryptography), without checking the blockchain.

