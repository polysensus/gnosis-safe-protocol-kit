#! /usr/bin/env node
import * as dotenv from "dotenv";
import path from "path";

import { ethers } from 'ethers';
import { EthersAdapter, Safe, SafeServiceClient, SafeAccountConfig } from "../src/safecoresdk.js";

dotenv.config({path: path.resolve(process.cwd(), '.env.keys')});
dotenv.config({path: path.resolve(process.cwd(), '.env')});


const txServiceUrl = "https://safe-transaction-optimism.safe.global/";
// const RPC_URL='https://eth-goerli.public.blastapi.io'
// const RPC_URL='https://endpoints.omniatech.io/v1/op/mainnet/public';
const RPC_URL='https://opt-mainnet.g.alchemy.com/v2/nf2PP059oQdMP925TyFvyU0vl5N766MS'
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

const OPTIMISIM_CHAINID = 10;
const safeAddress = process.env.OPTIMISIM_SAFE_2;
console.log(`Safe @${safeAddress}`);
// Initialize signers
const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY, provider);
const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY, provider);
const owner3Signer = new ethers.Wallet(process.env.OWNER_3_PRIVATE_KEY, provider);

const ethAdapterOwner1 = new EthersAdapter({ ethers, signerOrProvider: owner1Signer });

const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter: ethAdapterOwner1 });
const ownerAddress = await owner1Signer.getAddress();
console.log(`ownerAddress: ${ownerAddress}`);
const data = await safeService.getSafesByOwner(ownerAddress);
console.log(JSON.stringify(data, null, '  '));

for (const safeAddress of data.safes) {
  const data = await safeService.getSafeInfo(safeAddress);
  console.log(JSON.stringify(data, null, '  '));
}

// const safeInfo = 
// const contractNetworks = {id: OPTIMISIM_CHAINID}
// const safeSdk = await Safe.create({ethAdapter: ethAdapterOwner1, safeAddress});
// console.log(`safeSdk @${safeSdk.getAddress()}`);