import { getPythProgramKeyForCluster } from '@pythnetwork/client';
import { PythHttpClient } from '@pythnetwork/client/lib/PythHttpClient';
import { Connection, Keypair } from '@solana/web3.js';

const connectionFromPyth = new Connection(
    'pythnet-provider-url' // can get it from triton
)

const pythClient = new PythHttpClient(connectionFromPyth, getPythProgramKeyForCluster('pythnet'))

// for alternatives see https://docs.pyth.network/price-feeds/use-real-time-data/off-chain