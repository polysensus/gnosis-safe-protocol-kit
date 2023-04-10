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
const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY, provider);
const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY, provider);

const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: owner1Signer
});

const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter: ethAdapterOwner1 });
console.log(`Safe @${safeAddress}`);
const safe = await Safe.create({ ethAdapter: ethAdapterOwner1, safeAddress });

const destination = process.env.OPTIMISIM_BENEFICIARY_1;
const amountUnits = '0.001';
const amount = ethers.utils.parseUnits(amountUnits, 'ether').toString();

console.log(`Beneficiary @${destination} amount: ${amount}`);
const safeTransactionData/*: SafeTransactionDataPartial*/ = {
  to: destination,
  data: '0x',
  value: amount
}
console.log(`${JSON.stringify(safeTransactionData, null, ' ')}`);
const safeTransaction = await safe.createTransaction({safeTransactionData});
console.log(`${JSON.stringify(safeTransaction, null, ' ')}`);

// Deterministic hash based on transaction parameters
let safeTxHash = await safe.getTransactionHash(safeTransaction);

// Sign transaction to verify that the transaction is coming from owner 1
const senderSignature = await safe.signTransactionHash(safeTxHash)
const resp = await safeService.proposeTransaction({
  safeAddress,
  safeTransactionData: safeTransaction.data,
  safeTxHash,
  senderAddress: await owner1Signer.getAddress(),
  senderSignature: senderSignature.data
});
console.log(`${JSON.stringify(resp)}`);

const pendingTransactions = await safeService.getPendingTransactions(safeAddress).results;

// Assumes that the first pending transaction is the transaction you want to confirm
const transaction = pendingTransactions[0]
const safeTxHash2 = transaction.safeTxHash
if (safeTxHash !== safeTxHash2) {
  console.log(`erk ? not what I expected: ${safeTxHash} !== ${safeTxHash2}`);
}

const ethAdapterOwner2 = new EthersAdapter({
  ethers,
  signerOrProvider: owner2Signer
})

const safeSdkOwner2 = await Safe.create({
  ethAdapter: ethAdapterOwner2,
  safeAddress
})

const signature = await safeSdkOwner2.signTransactionHash(safeTxHash2);
const response = await safeService.confirmTransaction(safeTxHash2, signature.data);

// Anyone can execute the Safe transaction once it has the required number of
// signatures. In this example, owner 1 will execute the transaction and pay for
// the gas fees.

const safeTransaction2 = await safeService.getTransaction(safeTxHash2);
const executeTxResponse = await safeSdk.executeTransaction(safeTransaction2);
const receipt = await executeTxResponse.transactionResponse?.wait();

console.log('Transaction executed:');
console.log(`${EXPLORER_URL}tx/${receipt.transactionHash}`);

// const owners = await safe.getOwners();
// console.log(`${JSON.stringify(owners)}`);
