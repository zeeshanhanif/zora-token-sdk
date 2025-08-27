import { 
  setApiKey,
  getCoin,
  getCoins
} from '@zoralabs/coins-sdk';
import { Address } from 'viem';
import { loadConfig } from '../config/config';

/**
 * Simplified query examples that work with the actual SDK API
 * Note: The actual SDK API differs from the documentation in many places
 */

async function queryTokenBasic(coinAddress: Address) {
  try {
    const config = loadConfig();
    setApiKey(config.zoraApiKey);

    console.log('🔍 Querying token for:', coinAddress);

    // Simple token query
    const response = await getCoin({
      address: coinAddress,
      chain: config.chainId,
    });

    console.log('📊 Response received:', !!response);
    console.log('📊 Response data:', response);

    return response;

  } catch (error) {
    console.error('❌ Error querying token:', error);
    throw error;
  }
}

async function exploreCoinsBasic() {
  try {
    const config = loadConfig();
    setApiKey(config.zoraApiKey);

    console.log('🌟 Exploring coins...');

    // Simple coins exploration
    const response = await getCoins({
      coins: [{ chainId: config.chainId, collectionAddress: '0x0000000000000000000000000000000000000000' }],
    });

    console.log('🪙 Response received:', !!response);
    console.log('🪙 Response data:', response);

    return response;

  } catch (error) {
    console.error('❌ Error exploring coins:', error);
    throw error;
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  const coinAddress = process.argv[2] as Address;

  if (coinAddress && coinAddress.startsWith('0x')) {
    queryTokenBasic(coinAddress)
      .then((result) => {
        console.log('Query completed successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Query failed:', error);
        process.exit(1);
      });
  } else {
    exploreCoinsBasic()
      .then((result) => {
        console.log('Exploration completed successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Exploration failed:', error);
        process.exit(1);
      });
  }
}

export {
  queryTokenBasic,
  exploreCoinsBasic,
};
