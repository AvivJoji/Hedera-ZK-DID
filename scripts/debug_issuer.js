const { LocalProvider } = require('../lib/utils/hedera');
const { executeFunction, queryFunction } = require('../lib/utils/contracts');
const { ethers } = require("ethers");
const { AccountId, ContractFunctionParameters } = require("@hashgraph/sdk");
const fs = require('fs');

const args = process.argv.slice(2);
const holderArg = args[0] || "0.0.5892919";

function getEvmAddress(address) {
    if (address.includes('.')) {
        const accountId = AccountId.fromString(address);
        return accountId.toSolidityAddress();
    }
    return address.startsWith('0x') ? address : `0x${address}`;
}

async function main() {
    try {
        const holderAddress = getEvmAddress(holderArg);

        const credentialData = { degree: "BS" };
        const jsonString = JSON.stringify(credentialData);
        const credentialHash = ethers.utils.id(jsonString);

        const duration = 10000;
        const schemaId = ethers.utils.id("degree-schema-v1");

        console.log("Constructing params...");
        const params = new ContractFunctionParameters()
            .addAddress(holderAddress)
            .addBytes32(ethers.utils.arrayify(credentialHash))
            .addUint256(duration)
            .addBytes32(ethers.utils.arrayify(schemaId));

        console.log("Executing function...");
        const result = await executeFunction('issueCredential', params);

        console.log("Success:", result);
    } catch (error) {
        console.error("Issuer Failed:", error);
        fs.writeFileSync('issuer_error.txt', error.stack || error.toString());
    }
}

main();
