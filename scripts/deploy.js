const { Client, ContractCreateFlow, PrivateKey, AccountId } = require("@hashgraph/sdk");
const fs = require('fs');
const path = require('path');
const { getConfig } = require('../lib/utils/config');
const chalk = require('chalk');

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
    console.log(chalk.blue("Deploying DidManage Contract..."));

    // Load artifact
    const artifactPath = path.resolve(__dirname, '../contracts/DidManageResolved.json');
    if (!fs.existsSync(artifactPath)) {
        console.error("Artifact not found! Run compile.js first.");
        process.exit(1);
    }
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    const bytecode = artifact.bytecode;

    if (!bytecode) {
        console.error("Bytecode missing in artifact.");
        process.exit(1);
    }

    try {
        const contractCreateFlow = new ContractCreateFlow()
            .setBytecode(bytecode)
            .setGas(4000000); // Set gas limit

        console.log("Submitting transaction...");
        const txResponse = await contractCreateFlow.execute(client);

        console.log("Waiting for receipt...");
        const receipt = await txResponse.getReceipt(client);
        const newContractId = receipt.contractId;

        console.log(chalk.green(`\nContract deployed successfully!`));
        console.log(chalk.green(`Contract ID: ${newContractId.toString()}`));
        console.log(chalk.green(`Contract Address: ${newContractId.toSolidityAddress()}`));

        // Update config
        // Note: this updates the in-memory config/local file managed by 'conf'
        // But since we have a dedicated update_config script we might need to manually update it or ask user
        // We can try to use setConfig from utils
        const { setContractId } = require('../lib/utils/config');
        setContractId(newContractId.toString());
        console.log("Configuration updated with new Contract ID.");

    } catch (error) {
        console.error(chalk.red("Deployment failed:"), error);
    }
}

main();
