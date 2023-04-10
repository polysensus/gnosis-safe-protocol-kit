#! /usr/bin/env node
import * as dotenv from "dotenv";
for (const name of [".env", ".env.keys", ".env.api-keys"]) {
  dotenv.config({path: path.resolve(process.cwd(), name)});
}

import path from "path";

import { ethers } from 'ethers';

const EXPLORER_URL=process.env.EXPLORER_URL;

const RPC_URL=process.env.RPC_URL;
console.log(`RPC_URL: ${RPC_URL}`);
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

const safeAddress = process.env.OPTIMISIM_SAFE_2;
console.log(`Safe @${safeAddress}`);

const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY, provider);
const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY, provider);

const safeAmount = ethers.utils.parseUnits('0.005', 'ether').toHexString();
const transactionParameters = {
  to: safeAddress,
  value: safeAmount
};

const tx = await owner1Signer.sendTransaction(transactionParameters);
console.log(`Deposit Transaction: ${EXPLORER_URL}tx/${tx.hash}`);