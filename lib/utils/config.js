const Conf = require('conf');
const config = new Conf({
    projectName: 'did-cli',
    defaults: {
        network: {
            name: 'testnet',
            mirrorNode: 'https://testnet.mirrornode.hedera.com/api/v1/'
        },
        hedera: {
            accountId: '0.0.5892919',
            privateKey: '0x673403f7cc61242ce2a621801bb8391a9180a366341ffe1cf72f233cbec459e1'
        },
        contract: {
            id: '0.0.7763926',
            address: '0xd9145CCE52D386f254917e481eB44e9943F39138'
        }
    }
});

function initConfig() {
    // Conf handles defaults
}

function getConfig() {
    return config;
}

function setConfig(key, value) {
    config.set(key, value);
}

function setNetwork(name) {
    config.set('network.name', name);
    if (name === 'testnet') {
        config.set('network.mirrorNode', 'https://testnet.mirrornode.hedera.com/api/v1/');
    } else if (name === 'mainnet') {
        config.set('network.mirrorNode', 'https://mainnet-public.mirrornode.hedera.com/api/v1/');
    } else if (name === 'previewnet') {
        config.set('network.mirrorNode', 'https://previewnet.mirrornode.hedera.com/api/v1/');
    }
}

function setAccountId(id) {
    config.set('hedera.accountId', id);
}

function setPrivateKey(key) {
    config.set('hedera.privateKey', key);
}

function setContractId(idOrAddress) {
    if (idOrAddress.startsWith('0.0')) {
        config.set('contract.id', idOrAddress);
    } else {
        config.set('contract.address', idOrAddress);
    }
}

module.exports = {
    initConfig,
    getConfig,
    setConfig,
    setNetwork,
    setAccountId,
    setPrivateKey,
    setContractId
};
