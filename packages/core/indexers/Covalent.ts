import { splitAPIKeys } from '@bento/common';
import { randomOf } from '@bento/common';
import axios from 'axios';

type Options = {
  chainId: number;
  account: string;
};

export const getTokenBalancesFromCovalent = async ({
  chainId,
  account,
}: Options): Promise<TokenBalanceItem[]> => {
  const API_KEY = randomOf(splitAPIKeys(process.env.COVALENT_API_KEYS));
  const API_URL = `https://api.covalenthq.com/v1/${chainId}/address/${account}/balances_v2/?key=${API_KEY.replace(
    ':',
    '',
  )}`;

  const response = await axios.get<TokenBalancesResponse>(API_URL, {
    timeout: 10_000,
  });

  return response.data.data.items;
};

export type TokenBalanceItem = {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: null;
  logo_url: string;
  last_transferred_at: null;
  type: 'cryptocurrency' | 'nft';
  balance: string;
  balance_24h: null;
  quote_rate: number;
  quote_rate_24h: number;
  quote: number | null;
  quote_24h: number | null;
  // nft_data: NFTData[] | null;
};

export type TokenBalancesResponse = {
  data: {
    address: string;
    updated_at: string;
    next_update_at: string;
    quote_currency: string;
    chain_id: number;
    items: TokenBalanceItem[];
    pagination: null;
  };
  error: false;
  error_message: null;
  error_code: null;
};
