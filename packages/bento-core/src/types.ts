export type WalletType = 'evm' | 'cosmos-sdk' | 'solana';
export const WALLET_TYPES: WalletType[] = ['evm', 'cosmos-sdk', 'solana'];

export type EVMBasedChains = 'ethereum' | 'polygon' | 'klaytn';
export type CosmosSDKBasedChains = 'cosmos-hub' | 'osmosis';

export type Wallet =
  | {
      type: 'evm'; // EVM based chains
      address: string;
      chains: EVMBasedChains[];
    }
  | {
      type: 'cosmos-sdk'; // Cosmos SDK based chains
      address: string;
      chains: CosmosSDKBasedChains[];
    }
  | { type: 'solana'; address: string };
