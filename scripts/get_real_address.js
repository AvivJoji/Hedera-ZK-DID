const { getConfig, initConfig } = require('../lib/utils/config');
const { ethers } = require("ethers");

// Initialize config
initConfig();

async function main() {
    const privateKey = getConfig().get('hedera.privateKey');

    if (!privateKey) {
        console.error("No private key found in config.");
        return;
    }

    // Create wallet to derive address
    const wallet = new ethers.Wallet(privateKey);

    console.log("\n--- USER IDENTITY INFO ---");
    console.log("Your Private Key Address (EVM Alias):");
    console.log(wallet.address);
    console.log("\nNOTE: Use THIS address for 'did get' and 'issue credential'.");
    console.log("The '0.0.xxxxx' address is your Hedera ID, but the Contract sees your EVM Address.");
    console.log("--------------------------\n");
}

main().catch(console.error);
