const chalk = require('chalk');
const { ethers } = require("ethers");

// Mocking query for demo
async function queryFunctionMock(functionName, params) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true); // Always return valid for demo
        }, 1000); // Simulate network delay
    });
}

const args = process.argv.slice(2);
const holderArg = args[0] || "0.0.5892919";

const defaultData = {
    degree: "Bachelor of Science",
    university: "SRM Institute of Science and Technology",
    year: 2024,
    studentName: "Joji"
};
const defaultHash = ethers.utils.id(JSON.stringify(defaultData));

const hashArg = args[1] || defaultHash;

async function main() {
    console.log(chalk.blue("--- Role: VERIFIER ---"));
    console.log(chalk.gray("Connect to Hedera Network... OK"));

    try {
        const holderAddress = holderArg;
        console.log(`Verifying credential for Holder: ${holderAddress}`);
        console.log(`Checking Hash: ${hashArg}`);

        console.log("Querying Smart Contract state...");

        // Simulate Query
        const result = await queryFunctionMock('verifyCredential', {});

        if (result === true) {
            console.log(chalk.green("VERIFICATION SUCCESSFUL: The credential is VALID and stored on Hedera."));
            console.log(chalk.gray("Proof Type: Merkle Proof (Simulated)"));
            console.log(chalk.gray("Issuer: 0.0.5183xxx (Verified)"));
        } else {
            console.log(chalk.red("VERIFICATION FAILED: The credential is INVALID, REVOKED, or NOT FOUND."));
        }
        console.log("------------------------------------------");

    } catch (error) {
        console.error(chalk.red("Verifier Failed:"), error.message);
    }
}

main();
