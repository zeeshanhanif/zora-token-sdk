import { 
  setApiKey,
  getCoin,
  getProfileBalances,
  getCoinSwaps,
  getCoins
} from '@zoralabs/coins-sdk';
import { Address } from 'viem';
import { loadConfig } from '../config/config';

interface TokenQueryOptions {
  coinAddress?: Address;
  profileAddress?: Address;
  limit?: number;
}

async function queryTokenDetails(coinAddress: Address) {
  try {
    const config = loadConfig();
    setApiKey(config.zoraApiKey);

    console.log('🔍 Querying token details for:', coinAddress);

    // Get detailed information about a specific coin
    const coinResponse = await getCoin({
      coin: { chainId: config.chainId, collectionAddress: coinAddress },
    });

    if (coinResponse.error) {
      throw new Error(coinResponse.error);
    }

    const coinDetails = coinResponse.data?.zora20Token;
    if (!coinDetails) {
      throw new Error('Token not found');
    }

    console.log('📊 Token Details:');
    console.log('- Name:', coinDetails.name);
    console.log('- Symbol:', coinDetails.symbol);
    console.log('- Total Supply:', coinDetails.totalSupply);
    console.log('- Creator:', coinDetails.creator);
    console.log('- Market Cap:', coinDetails.marketCap);
    console.log('- Address:', coinDetails.address);

    return coinDetails;

  } catch (error) {
    console.error('❌ Error querying token details:', error);
    throw error;
  }
}

async function queryProfileBalances(profileAddress: Address) {
  try {
    const config = loadConfig();
    setApiKey(config.zoraApiKey);

    console.log('💰 Querying profile balances for:', profileAddress);

    // Get balances for a specific profile/wallet
    const balancesResponse = await getProfileBalances({
      identifier: profileAddress,
      count: 20, // Limit number of results
      chainIds: [config.chainId],
    });

    if (balancesResponse.error) {
      throw new Error(balancesResponse.error);
    }

    const balances = balancesResponse.data?.profile?.balances || [];

    console.log('📈 Profile Balances:');
    balances.forEach((balance: any, index: number) => {
      console.log(`${index + 1}. ${balance.coin?.name || 'Unknown'} (${balance.coin?.symbol || 'N/A'})`);
      console.log(`   Balance: ${balance.balance}`);
      console.log(`   Value: ${balance.value}`);
      console.log(`   Coin Address: ${balance.coin?.address || 'N/A'}`);
      console.log('');
    });

    return balances;

  } catch (error) {
    console.error('❌ Error querying profile balances:', error);
    throw error;
  }
}

async function queryTokenActivity(coinAddress: Address) {
  try {
    const config = loadConfig();
    setApiKey(config.zoraApiKey);

    console.log('📈 Querying token activity for:', coinAddress);

    // Get recent swaps/activity for a specific coin
    const activityResponse = await getCoinSwaps({
      coin: { chainId: config.chainId, collectionAddress: coinAddress },
      count: 10,
    });

    if (activityResponse.error) {
      throw new Error(activityResponse.error);
    }

    const activity = activityResponse.data?.zora20Swaps || [];

    console.log('🔄 Recent Token Activity:');
    activity.forEach((item: any, index: number) => {
      console.log(`${index + 1}. ${item.type || 'SWAP'} - ${item.amount || 'N/A'}`);
      console.log(`   User: ${item.user || 'N/A'}`);
      console.log(`   Transaction: ${item.txHash || 'N/A'}`);
      console.log(`   Timestamp: ${item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : 'N/A'}`);
      console.log('');
    });

    return activity;

  } catch (error) {
    console.error('❌ Error querying token activity:', error);
    throw error;
  }
}

async function exploreCoins(options: { limit?: number; creator?: Address } = {}) {
  try {
    const config = loadConfig();
    setApiKey(config.zoraApiKey);

    console.log('🌟 Exploring coins...');

    // Get list of coins with optional filters
    const coinsResponse = await getCoins({
      coins: [{ chainId: config.chainId, collectionAddress: '0x' }], // This might need adjustment
      count: options.limit || 20,
    });

    if (coinsResponse.error) {
      throw new Error(coinsResponse.error);
    }

    const coins = coinsResponse.data?.zora20Tokens || [];

    console.log('🪙 Available Coins:');
    coins.forEach((coin: any, index: number) => {
      console.log(`${index + 1}. ${coin.name || 'Unknown'} (${coin.symbol || 'N/A'})`);
      console.log(`   Address: ${coin.address || 'N/A'}`);
      console.log(`   Creator: ${coin.creator || 'N/A'}`);
      console.log(`   Market Cap: ${coin.marketCap || 'N/A'}`);
      console.log(`   Total Supply: ${coin.totalSupply || 'N/A'}`);
      console.log('');
    });

    return coins;

  } catch (error) {
    console.error('❌ Error exploring coins:', error);
    throw error;
  }
}

async function comprehensiveTokenAnalysis(coinAddress: Address) {
  try {
    console.log('🔬 Performing comprehensive token analysis...');
    
    // Run multiple queries in parallel
    const [details, activity] = await Promise.all([
      queryTokenDetails(coinAddress),
      queryTokenActivity(coinAddress),
    ]);

    console.log('📋 Analysis Summary:');
    console.log('================');
    console.log(`Token: ${details.name} (${details.symbol})`);
    console.log(`Address: ${coinAddress}`);
    console.log(`Creator: ${details.creator}`);
    console.log(`Current Price: ${details.price}`);
    console.log(`Market Cap: ${details.marketCap}`);
    console.log(`Total Supply: ${details.totalSupply}`);
    console.log(`Recent Activity Count: ${activity.length}`);

    return {
      details,
      activity,
      summary: {
        name: details.name,
        symbol: details.symbol,
        address: coinAddress,
        creator: details.creator,
        price: details.price,
        marketCap: details.marketCap,
        activityCount: activity.length,
      },
    };

  } catch (error) {
    console.error('❌ Error in comprehensive analysis:', error);
    throw error;
  }
}

// Example usage
async function runQueryExamples() {
  try {
    const config = loadConfig();
    
    // Example 1: Explore available coins
    console.log('=== Example 1: Exploring Coins ===');
    await exploreCoins({ limit: 5 });

    // Example 2: Query profile balances
    console.log('\n=== Example 2: Profile Balances ===');
    await queryProfileBalances(config.creatorAddress);

    // Example 3: If you have a specific coin address, uncomment below
    // const sampleCoinAddress = '0x...' as Address;
    // console.log('\n=== Example 3: Token Analysis ===');
    // await comprehensiveTokenAnalysis(sampleCoinAddress);

  } catch (error) {
    console.error('Error running query examples:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  const coinAddress = process.argv[2] as Address;
  const profileAddress = process.argv[3] as Address;

  if (coinAddress && coinAddress.startsWith('0x')) {
    comprehensiveTokenAnalysis(coinAddress)
      .then((result) => {
        console.log('Analysis completed successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Analysis failed:', error);
        process.exit(1);
      });
  } else if (profileAddress && profileAddress.startsWith('0x')) {
    queryProfileBalances(profileAddress)
      .then(() => {
        console.log('Profile query completed successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Profile query failed:', error);
        process.exit(1);
      });
  } else {
    runQueryExamples()
      .then(() => {
        console.log('Query examples completed');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Query examples failed:', error);
        process.exit(1);
      });
  }
}

export {
  queryTokenDetails,
  queryProfileBalances,
  queryTokenActivity,
  exploreCoins,
  comprehensiveTokenAnalysis,
};
