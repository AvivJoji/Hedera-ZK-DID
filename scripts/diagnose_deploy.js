const { Client, ContractCreateFlow, PrivateKey, AccountId } = require("@hashgraph/sdk");
const fs = require('fs');
const path = require('path');
const { getConfig } = require('../lib/utils/config');

// Load config
const config = getConfig().store;
const accountId = config.hedera.accountId;
const privateKey = config.hedera.privateKey;

if (!accountId || !privateKey) {
    console.error("Missing Hedera credentials in config.");
    process.exit(1);
}

const client = Client.forTestnet();
client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));

async function main() {
    console.log("Attempting Deployment for Diagnostics...");
    const artifactPath = path.resolve(__dirname, '../contracts/DidManageResolved.json');
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const bytecode = artifact.bytecode;

    try {
        const contractCreateFlow = new ContractCreateFlow()
            .setBytecode(bytecode)
            .setGas(4000000);

        const txResponse = await contractCreateFlow.execute(client);
        const receipt = await txResponse.getReceipt(client);
        console.log("SUCCESS! ContractId:", receipt.contractId.toString());

    } catch (error) {
        console.error("FULL ERROR OBJECT:");
        console.error(JSON.stringify(error, null, 2));

        if (error.status) {
            console.error("HEDERA STATUS:", error.status.toString());
        }
    }
}

main();
