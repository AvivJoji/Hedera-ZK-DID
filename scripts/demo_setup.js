const { ethers } = require('ethers');
const { execSync } = require('child_process');
const path = require('path');

async function runDemo() {
    console.log('--- Starting Demo Setup ---');

    // 1. Generate Wallet
    const wallet = ethers.Wallet.createRandom();
    const publicKey = wallet.publicKey;
    const address = wallet.address;
    console.log(`Generated Public Key: ${publicKey}`);
    console.log(`Generated Address: ${address}`);

    const cliPath = path.resolve(__dirname, '../bin/did-cli.js');

    // 2. Create DID
    console.log('\n--- Creating DID ---');
    try {
        const createCmd = `node "${cliPath}" did create "${publicKey}"`;
        console.log(`Running: ${createCmd}`);
        const createOutput = execSync(createCmd, { encoding: 'utf-8' });
        console.log(createOutput);
    } catch (error) {
        console.error('Failed to create DID:', error.stdout || error.message);
        // Continue anyway? If DID fails, issue credential might fail.
    }

    // 3. Issue Credential
    console.log('\n--- Issuing Credential ---');
    const credentialHash = "Degree_ComputerScience_2026";
    try {
        const issueCmd = `node "${cliPath}" credential issue --holder "${address}" --hash "${credentialHash}"`;
        console.log(`Running: ${issueCmd}`);
        const issueOutput = execSync(issueCmd, { encoding: 'utf-8' });
        console.log(issueOutput);
    } catch (error) {
        console.error('Failed to issue credential:', error.stdout || error.message);
    }

    console.log('\n--- Demo Setup Complete ---');
    console.log(`Use this Address in Dashboard: ${address}`);
    console.log(`Use this Hash in Dashboard: ${credentialHash}`);
}

runDemo();
