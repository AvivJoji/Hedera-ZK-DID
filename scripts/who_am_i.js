const { Client, ContractExecuteTransaction, ContractFunctionParameters } = require("@hashgraph/sdk");
const { getClient } = require("../lib/utils/hedera");
const { getConfig, initConfig } = require("../lib/utils/config");

initConfig();

async function main() {
    const client = getClient();
    const contractId = getConfig().get('contract.id');

    console.log(`Connecting to contract: ${contractId}`);

    // Call updateDID just to trigger an event and see who msg.sender is
    const params = new ContractFunctionParameters().addString("KeyDiscoveryRun");

    const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(2000000) // High gas
        .setFunction("updateDID", params);

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);
    const record = await txResponse.getRecord(client);

    console.log(`Transaction Status: ${receipt.status.toString()}`);

    // Parse logs
    record.contractFunctionResult.logs.forEach(log => {
        // Topic 0 is event signature hash
        // Topic 1 is the first indexed argument: 'user' (address)
        if (log.topics.length > 1) {
            const topic1 = log.topics[1]; // Buffer or Uint8Array
            // Convert to hex
            const hex = "0x" + Buffer.from(topic1).toString('hex').slice(24); // Last 20 bytes for address
            console.log("\nFOUND SENDER ADDRESS FROM LOGS:");
            console.log(hex);
            console.log("\nUse THIS address for 'did get' and 'issue'.\n");
        }
    });

    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
