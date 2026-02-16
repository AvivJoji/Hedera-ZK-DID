const { Client, ContractInfoQuery, AccountId, PrivateKey } = require("@hashgraph/sdk");

async function main() {
    const accountId = '0.0.5887016';
    const privateKey = '0x408fb09f4272afa9cc864ebe4650a993e232955ce15cfa7f02bda37ac39610a0';
    const contractId = '0.0.5183064';

    const client = Client.forTestnet();
    client.setOperator(AccountId.fromString(accountId), PrivateKey.fromStringECDSA(privateKey));

    try {
        console.log(`Checking Contract Info for ${contractId}...`);
        const info = await new ContractInfoQuery()
            .setContractId(contractId)
            .execute(client);

        console.log("Contract Info Found!");
        console.log("Contract Account ID:", info.contractId.toString());
        console.log("Contract EVM Address:", info.contractAccountId);
        console.log("Is Deleted:", info.isDeleted);
    } catch (error) {
        console.error("Error fetching contract info:", error.message);
    }
}

main();
