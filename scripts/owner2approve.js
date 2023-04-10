#! /usr/bin/env node
import * as dotenv from "dotenv";
import path from "path";

for (const name of [".env", ".env.keys", ".env.api-keys"]) {
  dotenv.config({path: path.resolve(process.cwd(), name)});
}

import { ethers } from 'ethers';
import { EthersAdapter, Safe, SafeServiceClient } from "../src/safecoresdk.js";

const txServiceUrl = process.env.TX_SERVICE_URL;
const RPC_URL=process.env.RPC_URL;
const EXPLORER_URL=process.env.EXPLORER_URL;
console.log(`RPC_URL: ${RPC_URL}`);

const safeAddress = process.env.OPTIMISIM_SAFE_2;
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Initialize signers
const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY, provider);

const ethAdapterOwner2 = new EthersAdapter({
  ethers,
  signerOrProvider: owner2Signer
});

const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter: ethAdapterOwner2 });
const pendingTransactions = (await safeService.getPendingTransactions(safeAddress)).results;
console.log(`pendingTransactions: ${JSON.stringify(pendingTransactions, null, '  ')}`);

// Assumes that the first pending transaction is the transaction you want to confirm
const transaction = pendingTransactions[0]
const safeTxHash = transaction.safeTxHash


const safeSdkOwner2 = await Safe.create({
  ethAdapter: ethAdapterOwner2,
  safeAddress
})

const signature = await safeSdkOwner2.signTransactionHash(safeTxHash);
const response = await safeService.confirmTransaction(safeTxHash, signature.data);

// Anyone can execute the Safe transaction once it has the required number of
// signatures. In this example, owner 1 will execute the transaction and pay for
// the gas fees.

const safeTransaction2 = await safeService.getTransaction(safeTxHash);
const executeTxResponse = await safeSdkOwner2.executeTransaction(safeTransaction2);
const receipt = await executeTxResponse.transactionResponse?.wait();

console.log('Transaction executed:');
console.log(`${EXPLORER_URL}tx/${receipt.transactionHash}`);

// const owners = await safe.getOwners();
// console.log(`${JSON.stringify(owners)}`);
