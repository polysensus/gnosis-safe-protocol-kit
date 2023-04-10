import { default as safecore } from '@safe-global/safe-core-sdk';
import pkg1 from '@safe-global/safe-core-sdk';
import { default as safeetherslib } from '@safe-global/safe-ethers-lib';
import { default as safeserviceclient } from '@safe-global/safe-service-client';

export const { SafeConfig, SafeFactory, ContractManager, SafeAccountConfig, standardizeSafeTransactionData } = safecore;
console.log(Object.keys(safecore))
console.log(Object.keys(pkg1));
export const Safe = safecore.default;
export const EthersAdapter = safeetherslib.default;
export const SafeServiceClient = safeserviceclient.default;
