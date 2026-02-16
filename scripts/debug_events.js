const { Client } = require("@hashgraph/sdk");
const axios = require("axios");
const fs = require("fs");
const { getConfig, initConfig } = require("../lib/utils/config");

initConfig();

async function main() {
    const contractId = getConfig().get('contract.id');
    console.log(`Scanning events for contract: ${contractId}`);
    
    const mirrorNode = "https://testnet.mirrornode.hedera.com/api/v1";
    const url = `${mirrorNode}/contracts/${contractId}/results/logs?order=desc&limit=5`;
    
    try {
        const response = await axios.get(url);
        const logs = response.data.logs;
        
        console.log(`Found ${logs.length} logs.`);
        let output = "";
        
        logs.forEach((log, index) => {
            if (log.topics.length >= 4) {
                const hash = log.topics[3]; 
                const holder = "0x" + log.topics[2].slice(26);
                output += `Log ${index}:\nHash: ${hash}\nHolder: ${holder}\n\n`;
            }
        });
        
        fs.writeFileSync('debug_events.txt', output);
        console.log("Logs saved to debug_events.txt");
        
    } catch (e) {
        console.error("Error fetching logs:", e.message);
    }
}

main();
