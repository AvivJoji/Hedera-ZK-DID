const { Client, AccountId, PrivateKey } = require("@hashgraph/sdk");
const { getConfig } = require("./config");

let client = null;

function getClient() {
    if (client) {
        return client;
    }

    const config = getConfig().store;
    const network = config.network.name;

    if (network === "mainnet") {
        client = Client.forMainnet();
    } else if (network === "previewnet") {
        client = Client.forPreviewnet();
    } else {
        client = Client.forTestnet();
    }

    // Use credentials from config
    const accountId = config.hedera.accountId;
    const privateKey = config.hedera.privateKey;

    if (accountId && privateKey) {
        try {
            client.setOperator(
                AccountId.fromString(accountId),
                PrivateKey.fromStringECDSA(privateKey)
            );
        } catch (err) {
            console.error("Invalid credentials in config:", err.message);
        }
    }

    return client;
}

function resetClient() {
    client = null;
}

module.exports = {
    getClient,
    resetClient,
};
