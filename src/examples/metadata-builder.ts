import { 
  createMetadataBuilder, 
  createZoraUploaderForCreator,
  setApiKey,
  createCoin
} from '@zoralabs/coins-sdk';
import { 
  createWalletClient, 
  createPublicClient, 
  http,
  Address 
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { loadConfig } from '../config/config';
import * as fs from 'fs';
import * as path from 'path';

async function createTokenWithMetadataBuilder() {
  try {
    // Load configuration
    const config = loadConfig();
    setApiKey(config.zoraApiKey);

    // Create wallet and public clients
    const account = privateKeyToAccount(config.privateKey as `0x${string}`);
    
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(config.rpcUrl),
    });

    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(config.rpcUrl),
    });

    console.log('🎨 Creating token with metadata builder...');

    // Create a sample image file (you would normally have a real image file)
    const sampleImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    const imageFile = new File([sampleImageData], 'token-image.png', { type: 'image/png' });

    // Build metadata using the metadata builder
    console.log('📦 Building metadata...');
    const { createMetadataParameters } = await createMetadataBuilder()
      .withName('Awesome Builder Token')
      .withSymbol('ABT')
      .withDescription('A token created using Zora metadata builder with custom image and metadata')
      .withImage(imageFile)
      // Note: Properties removed due to API differences - the actual API expects Record<string, string>
      .upload(createZoraUploaderForCreator(config.creatorAddress));

    console.log('✅ Metadata uploaded successfully');
    console.log('Metadata parameters:', createMetadataParameters);

    // Create token using the generated metadata
    const tokenArgs = {
      creator: config.creatorAddress,
      ...createMetadataParameters, // This spreads name, symbol, and metadata.uri
      currency: 'ZORA' as const,
      chainId: config.chainId,
      startingMarketCap: 'LOW' as const,
      ...(config.platformReferrer && { platformReferrer: config.platformReferrer }),
    };

    console.log('🚀 Creating token with built metadata...');
    const result = await createCoin({
      call: tokenArgs,
      walletClient,
      publicClient,
    });

    console.log('🎉 Token with custom metadata created successfully!');
    console.log('Transaction hash:', result.hash);
    console.log('Token address:', result.address);
    console.log('Metadata URI:', createMetadataParameters.metadata.uri);

    return {
      success: true,
      transactionHash: result.hash,
      tokenAddress: result.address,
      metadataUri: createMetadataParameters.metadata.uri,
      deployment: result.deployment,
    };

  } catch (error) {
    console.error('❌ Error creating token with metadata builder:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Example of building metadata without immediately creating a token
async function buildMetadataOnly() {
  try {
    const config = loadConfig();
    setApiKey(config.zoraApiKey);

    console.log('📋 Building metadata only...');

    // Create sample data
    const sampleImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    const imageFile = new File([sampleImageData], 'sample.png', { type: 'image/png' });

    const builder = createMetadataBuilder()
      .withName('Sample Token')
      .withSymbol('SAMPLE')
      .withDescription('This is a sample token metadata')
      .withImage(imageFile)
      // Note: Properties removed due to API differences - the actual API expects Record<string, string>;

    const { createMetadataParameters } = await builder.upload(
      createZoraUploaderForCreator(config.creatorAddress)
    );

    console.log('✅ Metadata built and uploaded:');
    console.log('- Name:', createMetadataParameters.name);
    console.log('- Symbol:', createMetadataParameters.symbol);
    console.log('- URI:', createMetadataParameters.metadata.uri);

    return createMetadataParameters;

  } catch (error) {
    console.error('❌ Error building metadata:', error);
    throw error;
  }
}

// Helper function to load image from file system
async function loadImageFile(imagePath: string): Promise<File> {
  try {
    const fullPath = path.resolve(imagePath);
    const imageBuffer = fs.readFileSync(fullPath);
    const fileName = path.basename(fullPath);
    const mimeType = getMimeType(path.extname(fullPath));
    
    return new File([imageBuffer], fileName, { type: mimeType });
  } catch (error) {
    console.error('Error loading image file:', error);
    throw new Error(`Failed to load image from ${imagePath}`);
  }
}

function getMimeType(extension: string): string {
  const mimeTypes: { [key: string]: string } = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}

// Run the example
if (require.main === module) {
  // You can switch between these examples
  const runMetadataBuilder = process.argv.includes('--metadata-only');
  
  if (runMetadataBuilder) {
    buildMetadataOnly()
      .then((result) => {
        console.log('Metadata building completed:', result);
        process.exit(0);
      })
      .catch((error) => {
        console.error('Metadata building failed:', error);
        process.exit(1);
      });
  } else {
    createTokenWithMetadataBuilder()
      .then((result) => {
        console.log('Final result:', result);
        process.exit(result.success ? 0 : 1);
      })
      .catch((error) => {
        console.error('Unhandled error:', error);
        process.exit(1);
      });
  }
}

export { 
  createTokenWithMetadataBuilder, 
  buildMetadataOnly, 
  loadImageFile 
};
