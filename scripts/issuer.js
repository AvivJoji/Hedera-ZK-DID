const { Client, PrivateKey, AccountId, TransferTransaction, Hbar } = require("@hashgraph/sdk");
const chalk = require('chalk');
const { ethers } = require("ethers");

// Hardcoded credentials as requested for reliability
const ACCOUNT_ID = "0.0.5892919";
const PRIVATE_KEY = "0x673403f7cc61242ce2a621801bb8391a9180a366341ffe1cf72f233cbec459e1";

async function main() {
    console.log(chalk.blue("--- Role: ISSUER ---"));
    console.log(chalk.gray("Connect to Hedera Network..."));

    try {
        const client = Client.forTestnet();
        client.setOperator(AccountId.fromString(ACCOUNT_ID), PrivateKey.fromStringECDSA(PRIVATE_KEY));
        console.log(chalk.gray("Network Connected."));

        const args = process.argv.slice(2);
        const holderAddress = args[0] || ACCOUNT_ID; // Default to self if not provided

        console.log(`Issuing credential to Holder: ${holderAddress}`);

        // Define Credential Data
        const credentialData = {
            degree: "Bachelor of Science",
            university: "SRM Institute of Science and Technology",
            year: 2024,
            studentName: "Joji"
        };
        console.log("Credential Data:", credentialData);

        // Calculate Hash
        const jsonString = JSON.stringify(credentialData);
        const credentialHash = ethers.utils.id(jsonString);
        console.log("Credential Hash:", credentialHash);

        // Create a real transaction to show on Hashscan
        // We will send 0 HBAR to ourselves with the hash in the memo
        console.log("Submitting transaction to Hedera to anchor credential...");

        const transaction = new TransferTransaction()
            .addHbarTransfer(ACCOUNT_ID, Hbar.fromTinybars(0))
            .addHbarTransfer(ACCOUNT_ID, Hbar.fromTinybars(0)) // Net zero transfer
            .setTransactionMemo(`Issued Credential Hash: ${credentialHash}`);

        const txResponse = await transaction.execute(client);

        console.log(chalk.yellow("Transaction submitted. Waiting for consensus..."));

        const receipt = await txResponse.getReceipt(client);
        const transactionId = txResponse.transactionId;

        console.log(chalk.green("SUCCESS: Credential Anchored on Chain"));
        console.log(`Transaction ID: ${transactionId.toString()}`);
        console.log(`Status: ${receipt.status.toString()}`);

        // Format link for Hashscan
        // Transaction ID format on Hashscan is usually 0.0.xxx@seconds.nanos
        // SDK format is 0.0.xxx@seconds.nanos, but url often uses dashes or just the ID string
        const txIdString = transactionId.toString(); // e.g. 0.0.5892919@123456789.000000000

        console.log(chalk.cyan("\nView on Hashscan:"));
        console.log(`https://hashscan.io/testnet/transaction/${txIdString}`);
        console.log("------------------------------------------");

        process.exit(0);

    } catch (error) {
        console.error(chalk.red("Issuer Failed:"), error.message);
        process.exit(1);
    }
}

main();
