export type WalletType = 'evm' | 'tendermint' | 'solana';
export const WALLET_TYPES: WalletType[] = ['evm', 'tendermint', 'solana'];

export type EVMBasedChains = 'ethereum' | 'polygon' | 'klaytn';
export type TendermintBasedChains = 'cosmos-hub' | 'osmosis';

export type Wallet =
  | {
      type: 'evm'; // EVM(이더리움 기ㄴ)
      address: string;
      chains: EVMBasedChains[];
    }
  | {
      type: 'tendermint'; // Cosmos SDK
      address: string;
      chains: TendermintBasedChains[];
    }
  | { type: 'solana'; address: string };
