import _AVALANCHE_TOKENS from './avalanche.json';
import _BNB_TOKENS from './bnb.json';
import _ETHEREUM_TOKENS from './ethereum.json';
import _KLAYTN_TOKENS from './klaytn.json';
import _OSMOSIS_TOKENS from './osmosis.json';
import _POLYGON_TOKENS from './polygon.json';
import _SOLANA_TOKENS from './solana.json';

export interface TokenInput {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  coinGeckoId?: string;
  coinMarketCapId?: number;
  logo?: string;
  staking?: boolean;
  denomUnits?: { denom: string; exponent: number; aliases?: string[] }[];
}

export const ETHEREUM_TOKENS: TokenInput[] = _ETHEREUM_TOKENS;
export const POLYGON_TOKENS: TokenInput[] = _POLYGON_TOKENS;
export const AVALANCHE_TOKENS: TokenInput[] = _AVALANCHE_TOKENS;
export const BNB_TOKENS: TokenInput[] = _BNB_TOKENS;
export const KLAYTN_TOKENS: TokenInput[] = _KLAYTN_TOKENS;
export const SOLANA_TOKENS: TokenInput[] = _SOLANA_TOKENS;
export const OSMOSIS_TOKENS: TokenInput[] = _OSMOSIS_TOKENS;
