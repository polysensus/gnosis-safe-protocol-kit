#! /usr/bin/env node
import * as path from "path";
import * as dotenv from "dotenv";

import { ethers } from 'ethers';
import EthersAdapter from '@safe-global/safe-ethers-lib';

import SafeServiceClient from '@safe-global/safe-service-client';
import { SafeFactory } from '@safe-global/safe-core-sdk';
// import { SafeAccountConfig } from '@safe-global/safe-core-sdk';

dotenv.config({path: path.resolve(process.cwd(), '.env.keys')});

console.log('xxxxxx');
console.log(process.env);

process.exit(0);

const txServiceUrl = 'https://safe-transaction-goerli.safe.global';
// https://chainlist.org/?search=goerli&testnets=true
// const RPC_URL='https://eth-goerli.public.blastapi.io'
const RPC_URL='https://endpoints.omniatech.io/v1/op/mainnet/public';
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Initialize signers
const owner1Signer = new ethers.Wallet(process.env.OWNER_1_PRIVATE_KEY, provider);
const owner2Signer = new ethers.Wallet(process.env.OWNER_2_PRIVATE_KEY, provider);
const owner3Signer = new ethers.Wallet(process.env.OWNER_3_PRIVATE_KEY, provider);

const ethAdapterOwner1 = new EthersAdapter({
  ethers,
  signerOrProvider: owner1Signer
})

const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })

const safeAccountConfig = {
  owners: [
    await owner1Signer.getAddress(),
    await owner2Signer.getAddress(),
    await owner3Signer.getAddress()
  ],
  threshold: 2,
  // ... (Optional params)
}

/* This Safe is tied to owner 1 because the factory was initialized with
an adapter that had owner 1 as the signer. */
const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })

const safeAddress = safeSdkOwner1.getAddress()

console.log('Your Safe has been deployed:')
console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
console.log(`https://app.safe.global/oeth:${safeAddress}`)


// const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter: ethAdapterOwner1 })