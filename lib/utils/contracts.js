const {
  ContractExecuteTransaction,
  ContractCallQuery,
  ContractFunctionParameters,
  AccountId,
  ContractId
} = require("@hashgraph/sdk");
const { getClient } = require("./hedera");
const { getConfig } = require("./config");
require("ethers");

// Contract ID is now loaded from configuration

async function executeFunction(functionName, ...args) {
  const client = getClient();

  if (client.operatorAccountId == null) {
    throw new Error("Client operator ID is not set. Check config.");
  }

  // Get contract ID from config
  const contractIdConfig = getConfig().get('contract.id');
  const contractAddressConfig = getConfig().get('contract.address');
  
  let contractId;
  if (contractIdConfig) {
      contractId = ContractId.fromString(contractIdConfig);
  } else if (contractAddressConfig) {
      contractId = ContractId.fromSolidityAddress(contractAddressConfig);
  } else {
      throw new Error("Contract ID or Address not set in config.");
  }

  let params;
  if (args.length === 1 && args[0] instanceof ContractFunctionParameters) {
    params = args[0];
  } else {
    params = new ContractFunctionParameters();
    for (const arg of args) {
      params.addString(arg);
    }
  }

  const transaction = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(1000000)
    .setFunction(functionName, params);

  transaction.freezeWith(client);

  const txResponse = await transaction.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const status = receipt.status;

  return {
    transactionId: txResponse.transactionId.toString(),
    status: status.toString()
  };
}

async function queryFunction(functionName, ...args) {
  const client = getClient();

  // Get contract ID from config
  const contractIdConfig = getConfig().get('contract.id');
  const contractAddressConfig = getConfig().get('contract.address');

  let contractId;
  if (contractIdConfig) {
      contractId = ContractId.fromString(contractIdConfig);
  } else if (contractAddressConfig) {
      contractId = ContractId.fromSolidityAddress(contractAddressConfig);
  } else {
      throw new Error("Contract ID or Address not set in config.");
  }

  let params;
  if (args.length === 1 && args[0] instanceof ContractFunctionParameters) {
    params = args[0];
  } else {
    params = new ContractFunctionParameters();
    for (const arg of args) {
      params.addString(arg);
    }
  }

  const query = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(300000)
    .setFunction(functionName, params);

  if (functionName === 'dids') {
    try {
      const functionResult = await query.execute(client);
      const publicKey = functionResult.getString(0);
      const exists = functionResult.getBool(1);
      return { publicKey, exists };
    } catch (e) {
      // console.warn("Query failed or DID not found:", e.message);
      return { exists: false };
    }
  }

  const functionResult = await query.execute(client);

  if (functionName === 'verifyCredential' || functionName === 'verifyPresentation') {
    return functionResult.getBool(0);
  }

  return functionResult;
}

module.exports = {
  executeFunction,
  queryFunction
};
