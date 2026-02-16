const { ContractExecuteTransaction, ContractFunctionParameters } = require("@hashgraph/sdk");
const { getClient } = require("../lib/utils/hedera");
const { getConfig, initConfig } = require("../lib/utils/config");

initConfig();

async function main() {
    const client = getClient();
    const contractId = getConfig().get('contract.id');
    const myAccountId = getConfig().get('hedera.accountId');

    // We need the EVM address of the account we are granting the role to.
    // However, the contract `grantIssuerRole(address account)` expects a Solidity Address.
    // If we pass the Long Zero address derived from 0.0.xxxxx it works if the mapping uses that.
    // BUT AccessControl usually maps addresses.
    // The previous step showed the contract sees us as `0x7dcb...` (EVM Alias).
    // So we should grant the role to THAT address.

    // Hardcoded from previous finding or derived
    const evmAliasAddress = "0x7dcb24d02b9ee337f5ea84e4d10b9c0260874962";

    console.log(`Granting ISSUER_ROLE to: ${evmAliasAddress}`);
    console.log(`Contract: ${contractId}`);

    const params = new ContractFunctionParameters().addAddress(evmAliasAddress);

    const transaction = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(1000000)
        .setFunction("grantIssuerRole", params);

    const txResponse = await transaction.execute(client);
    const receipt = await txResponse.getReceipt(client);

    console.log(`\nSuccess! Status: ${receipt.status.toString()}`);
    console.log("You can now issue credentials.");
    process.exit(0);
}

main().catch(err => {
    console.error("Failed to grant role:", err);
    process.exit(1);
});
