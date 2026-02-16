const { setAccountId, setPrivateKey } = require('../lib/utils/config');
const chalk = require('chalk');

console.log(chalk.blue("Updating Hedera Configuration..."));

const accountId = '0.0.5892919';
const privateKey = '0x673403f7cc61242ce2a621801bb8391a9180a366341ffe1cf72f233cbec459e1';

try {
    setAccountId(accountId);
    setPrivateKey(privateKey);
    console.log(chalk.green("Configuration updated successfully!"));
    console.log(`Account ID set to: ${accountId}`);
} catch (error) {
    console.error(chalk.red("Failed to update configuration:"), error);
}
