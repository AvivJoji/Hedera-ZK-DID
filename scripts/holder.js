const chalk = require('chalk');
const { ethers } = require("ethers");

async function main() {
    console.log(chalk.blue("--- Role: HOLDER ---"));

    const credentialData = {
        degree: "Bachelor of Science",
        university: "SRM Institute of Science and Technology",
        year: 2024,
        studentName: "Joji"
    };

    console.log("I hold this credential data:");
    console.log(JSON.stringify(credentialData, null, 2));

    const jsonString = JSON.stringify(credentialData);
    const credentialHash = ethers.utils.id(jsonString);

    console.log(chalk.yellow(`\nI will present this hash to the Verifier: ${credentialHash}`));
    console.log("------------------------------------------");
}

main();
