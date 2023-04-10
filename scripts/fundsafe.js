#! /usr/bin/env node
import * as dotenv from "dotenv";
dotenv.config({path: path.resolve(process.cwd(), '.env.keys')});
dotenv.config({path: path.resolve(process.cwd(), '.env')});

import path from "path";

import { ethers } from 'ethers';
// import { EthersAdapter, Safe, SafeServiceClient, SafeAccountConfig } from "../src/safecoresdk.js";

const ETHERSCAN_URL="https://optimistic.etherscan.io/"
const RPC_URL='https://opt-mainnet.g.alchemy.com/v2/nf2PP059oQdMP925TyFvyU0vl5N766MS'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

const safeAddress = process.env.OPTIMISIM_SAFE_2;
console.log(`Safe @${safeAddress}`);

const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY, provider);
const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY, provider);

const safeAmount = ethers.utils.parseUnits('0.0005', 'ether').toHexString();
const transactionParameters = {
  to: safeAddress,
  value: safeAmount
};

const tx = await owner1Signer.sendTransaction(transactionParameters);
console.log(`Deposit Transaction: ${ETHERSCAN_URL}tx/${tx.hash}`);