const solc = require('solc');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const contractFileName = 'DidManage.sol';
// Assuming run from did-cli folder, so scripts/compile.js
// contracts/DidManage.sol
const contractPath = path.resolve(__dirname, '../contracts', contractFileName);

console.error(chalk.blue(`Reading contract from ${contractPath}...`));
if (!fs.existsSync(contractPath)) {
    console.error(chalk.red("Contract file not found!"));
    process.exit(1);
}
const content = fs.readFileSync(contractPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        [contractFileName]: {
            content: content
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode']
            }
        }
    }
};

function findImports(importPath) {
    console.error(`Attempting resolve: ${importPath}`);
    if (importPath.startsWith('@openzeppelin')) {
        const nodeModulesPath = path.resolve(__dirname, '../node_modules', importPath);
        console.error(`Mapped to: ${nodeModulesPath}`);
        if (fs.existsSync(nodeModulesPath)) {
            console.error("Found.");
            return { contents: fs.readFileSync(nodeModulesPath, 'utf8') };
        } else {
             console.error("NOT Found.");
             return { error: 'File not found' };
        }
    }
    return { error: 'File not found' };
}

console.error(chalk.blue("Compiling..."));
const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

if (output.errors) {
    output.errors.forEach(err => {
        console.error(chalk.red(err.formattedMessage));
    });
    // Exit if there are errors (not just warnings)
    if (output.errors.some(e => e.severity === 'error')) {
        console.error(chalk.red("Compilation failed."));
        process.exit(1);
    }
}

const contract = output.contracts[contractFileName]['DidManage'];
const bytecode = contract.evm.bytecode.object;
const abi = contract.abi;

console.error(chalk.green("Compilation Successful!"));
console.error(`Bytecode length: ${bytecode.length}`);

// Save to file
const artifactPath = path.resolve(__dirname, '../contracts/DidManageResolved.json');
fs.writeFileSync(artifactPath, JSON.stringify({ abi, bytecode }, null, 2));
console.error(chalk.green(`Artifact saved to ${artifactPath}`));
