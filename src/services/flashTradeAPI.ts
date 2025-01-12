import axios from 'axios';
import { AnchorProvider } from '@coral-xyz/anchor';
import { Connection, Keypair } from '@solana/web3.js';
import { PoolConfig, PerpetualsClient } from 'flash-sdk';
import { KeypairWallet } from '../utils/KeyPairWallet';

const API_BASE_URL = 'https://api.flash.trade'; // Replace with actual Flash.Trade API URL

// Configure the connection and wallet
const RPC_URL = process.env.RPC_URL || 'https://api.mainnet-beta.solana.com'; // Default fallback
const connection = new Connection(RPC_URL, 'processed');
const keypair = Keypair.generate(); // Generate or load a persistent Keypair
const wallet = new KeypairWallet(keypair);

// Create the AnchorProvider
const provider = new AnchorProvider(connection, wallet, {
  commitment: 'processed',
  preflightCommitment: 'processed',
});
console.log('Provider successfully created:', provider);
console.log('Wallet public key:', wallet.publicKey.toBase58());

// Load pool configuration
// Use appropriate pool name and network (mainnet-beta or devnet)
const POOL_CONFIG = PoolConfig.fromIdsByName('Crypto.1', 'mainnet-beta');

// Setup Flash client
const flashClient = new PerpetualsClient(
  provider,
  POOL_CONFIG.programId,
  POOL_CONFIG.perpComposibilityProgramId,
  POOL_CONFIG.fbNftRewardProgramId,
  POOL_CONFIG.rewardDistributionProgram.programId,
  {
    prioritizationFee: 0, // Dynamic fee setting supported
  }
);

/**
 * Place an order on the Flash.Trade platform.
 * @param {string} market - The market identifier (e.g., "BTC/USDT").
 * @param {string} side - Order side ("buy" or "sell").
 * @param {number} amount - Order amount.
 * @param {number} price - Order price.
 * @returns {Promise<any>} The order response.
 */
export const placeOrder = async (
  market: string,
  side: 'buy' | 'sell',
  amount: number,
  price: number
): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders`, {
      market,
      side,
      amount,
      price,
    });
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw new Error('Failed to place order');
  }
};
