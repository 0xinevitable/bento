import _BNB_TOKENS from './bnb.json';
import _ETHEREUM_TOKENS from './ethereum.json';
import _KLAYTN_TOKENS from './klaytn.json';

export interface ERC20TokenInput {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  coinGeckoId?: string;
  coinMarketCapId?: number;
  logo?: string;
  staking?: boolean;
}

export const ETHEREUM_TOKENS: ERC20TokenInput[] = _ETHEREUM_TOKENS;
export const BNB_TOKENS: ERC20TokenInput[] = _BNB_TOKENS;
export const KLAYTN_TOKENS: ERC20TokenInput[] = _KLAYTN_TOKENS;
