import { Keypair, Transaction, VersionedTransaction } from '@solana/web3.js';
import { Wallet } from '@coral-xyz/anchor';

/**
 * Wraps a Keypair into a Wallet object compatible with AnchorProvider.
 */
export class KeypairWallet implements Wallet {
  public payer: Keypair;

  constructor(keypair: Keypair) {
    this.payer = keypair; // Set the Keypair as the payer
  }

  public async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
    if (tx instanceof Transaction) {
      tx.partialSign(this.payer);
    } else if (tx instanceof VersionedTransaction) {
      tx.sign([this.payer]);
    }
    return tx;
  }

  public async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
    return txs.map((tx) => {
      if (tx instanceof Transaction) {
        tx.partialSign(this.payer);
      } else if (tx instanceof VersionedTransaction) {
        tx.sign([this.payer]);
      }
      return tx;
    });
  }

  public get publicKey() {
    return this.payer.publicKey;
  }
}
