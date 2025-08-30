import { setApiKey } from '@zoralabs/coins-sdk';
import { loadConfig } from './config/config';
import { createZoraToken } from './examples/create-token';
import { createTokenWithMetadataBuilder } from './examples/metadata-builder';
import { exploreCoinsBasic } from './examples/simple-query';

/**
 * Zora Token SDK Example
 * 
 * This module demonstrates how to use the Zora SDK to:
 * 1. Create tokens with basic metadata
 * 2. Create tokens with custom metadata using the metadata builder
 * 3. Query token information and balances
 */

async function main() {
  try {
    console.log('🌟 Zora Token SDK Example');
    console.log('========================\n');

    // Get command line arguments to determine what to run
    const command = process.argv[2];

    // For help command, don't require configuration
    if (command === 'help' || !command) {
      showHelp();
      return;
    }

    // Initialize configuration for other commands
    const config = loadConfig();
    setApiKey(config.zoraApiKey);

    console.log('Configuration loaded successfully');
    console.log('Creator address:', config.creatorAddress);
    console.log('Chain ID:', config.chainId);
    console.log('RPC URL:', config.rpcUrl);
    console.log('');

    switch (command) {
      case 'create':
        console.log('🚀 Creating a basic token...');
        const result = await createZoraToken();
        if (result.success) {
          console.log('✅ Token creation completed successfully!');
          console.log('Token Address:', result.tokenAddress);
          console.log('Transaction Hash:', result.transactionHash);
        } else {
          console.log('❌ Token creation failed:', result.error);
        }
        break;

      case 'create-with-metadata':
        console.log('🎨 Creating a token with custom metadata...');
        const metadataResult = await createTokenWithMetadataBuilder();
        if (metadataResult.success) {
          console.log('✅ Token with metadata creation completed successfully!');
          console.log('Token Address:', metadataResult.tokenAddress);
          console.log('Transaction Hash:', metadataResult.transactionHash);
          console.log('Metadata URI:', metadataResult.metadataUri);
        } else {
          console.log('❌ Token creation failed:', metadataResult.error);
        }
        break;

      case 'query':
        console.log('🔍 Querying coins...');
        await exploreCoinsBasic();
        console.log('✅ Query completed successfully!');
        break;

      default:
        showHelp();
        break;
    }

  } catch (error) {
    console.error('❌ Error in main execution:', error);
    process.exit(1);
  }
}

function showHelp() {
  console.log('Available commands:');
  console.log('  create                 - Create a basic token');
  console.log('  create-with-metadata   - Create a token with custom metadata');
  console.log('  query                  - Query existing coins');
  console.log('  help                   - Show this help message');
  console.log('');
  console.log('Usage examples:');
  console.log('  npm run dev create');
  console.log('  npm run dev create-with-metadata');
  console.log('  npm run dev query');
  console.log('');
  console.log('⚠️  Note: You need to set up your .env file before running create/query commands');
  console.log('   Copy env.example to .env and fill in your API key and wallet details');
}

// Export main components for use in other modules
export {
  createZoraToken,
  createTokenWithMetadataBuilder,
  exploreCoinsBasic,
  loadConfig,
};

// Run main function if this file is executed directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n🎉 Example execution completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Unhandled error:', error);
      process.exit(1);
    });
}
