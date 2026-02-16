const { ContractCallQuery, ContractFunctionParameters } = require("@hashgraph/sdk");
const { getClient } = require("../lib/utils/hedera");
const { getConfig, initConfig } = require("../lib/utils/config");
const { ethers } = require("ethers");

initConfig();

async function main() {
    const client = getClient();
    const contractId = getConfig().get('contract.id');
    const privateKey = getConfig().get('hedera.privateKey');
    const wallet = new ethers.Wallet(privateKey);
    const myAddress = wallet.address;

    console.log(`Checking roles for: ${myAddress}`);
    console.log(`Contract: ${contractId}`);

    // Check ISSUER_ROLE (keccak256("ISSUER_ROLE"))
    const ISSUER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ISSUER_ROLE"));

    // hasRole(bytes32 role, address account)
    const params = new ContractFunctionParameters()
        .addBytes32(ethers.utils.arrayify(ISSUER_ROLE))
        .addAddress(myAddress);

    const query = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("hasRole", params);

    const hasRole = await query.execute(client);
    const isIssuer = hasRole.getBool(0);

    console.log(`\nIs Issuer? ${isIssuer}`);

    if (!isIssuer) {
        console.error("❌ You DO NOT have the Issuer Role.");
    } else {
        console.log("✅ You HAVE the Issuer Role.");
    }

    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
