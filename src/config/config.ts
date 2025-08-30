import dotenv from 'dotenv';
import { Address } from 'viem';

// Load environment variables
dotenv.config();

export interface Config {
  zoraApiKey: string;
  privateKey: string;
  rpcUrl: string;
  creatorAddress: Address;
  platformReferrer?: Address;
  chainId: number;
}

export function loadConfig(): Config {
  const zoraApiKey = process.env.ZORA_API_KEY;
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.RPC_URL || 'https://mainnet.base.org';
  const creatorAddress = process.env.CREATOR_ADDRESS as Address;
  const platformReferrer = process.env.PLATFORM_REFERRER as Address | undefined;

  if (!zoraApiKey) {
    throw new Error('ZORA_API_KEY is required');
  }

  if (!privateKey) {
    throw new Error('PRIVATE_KEY is required');
  }

  if (!creatorAddress) {
    throw new Error('CREATOR_ADDRESS is required');
  }

  return {
    zoraApiKey,
    privateKey,
    rpcUrl,
    creatorAddress,
    platformReferrer,
    //chainId: 8453, // Base mainnet
    chainId: 84532, // Base sepolia
  };
}
