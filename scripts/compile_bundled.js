const solc = require('solc');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const rootDir = path.resolve(__dirname, '..'); // did-cli
const nodeModulesDir = path.resolve(rootDir, 'node_modules');
const contractsDir = path.resolve(rootDir, 'contracts');

const targetContract = 'DidManage.sol';
const sources = {};

function resolveImport(importPath, currentFileDir) {
    // Check if it's a library import
    if (importPath.startsWith('@openzeppelin')) {
        return path.resolve(nodeModulesDir, importPath);
    }
    // Relative import
    if (importPath.startsWith('.')) {
        return path.resolve(currentFileDir, importPath);
    }
    return null;
}

function processFile(filePath, importName) {
    if (sources[importName]) return; // Already processed

    console.log(`Processing ${importName}...`);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    sources[importName] = { content };

    // Find imports
    const importRegex = /import\s+(?:\{[^}]+\}\s+from\s+)?["']([^"']+)["'];/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1];
        const resolvedPath = resolveImport(importPath, path.dirname(filePath));

        if (resolvedPath) {
            // Determine a key for the source (keep it simple, use importPath if library, or relative if local)
            // Ideally we need to maintain the import path structure solc expects.
            // Solc expects keys in 'sources' to match the import string used in files OR be remapped.
            // If DidManage imports "@openzeppelin/...", we should key it as "@openzeppelin/..."

            // If we key it as the import path found, solc will match it.
            processFile(resolvedPath, importPath);
        }
    }
}

// Start with main contract
const mainContractPath = path.resolve(contractsDir, targetContract);
processFile(mainContractPath, targetContract);

console.log(chalk.blue("Compiling with bundled sources..."));
const input = {
    language: 'Solidity',
    sources: sources,
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode']
            }
        }
    }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
    output.errors.forEach(err => {
        console.error(chalk.red(err.formattedMessage));
    });
    if (output.errors.some(e => e.severity === 'error')) {
        console.error(chalk.red("Compilation failed."));
        process.exit(1);
    }
}

const contract = output.contracts[targetContract]['DidManage'];
const bytecode = contract.evm.bytecode.object;
const abi = contract.abi;

console.log(chalk.green("Compilation Successful!"));
const artifactPath = path.resolve(contractsDir, 'DidManageResolved.json');
fs.writeFileSync(artifactPath, JSON.stringify({ abi, bytecode }, null, 2));
console.log(chalk.green(`Artifact saved to ${artifactPath}`));
