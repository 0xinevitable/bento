import { splitAPIKeys } from '@bento/common';
import { randomOf } from '@bento/common';
import { type Chain as UnmarshalChainId } from '@unmarshal/sdk';
import axios from 'axios';
import queryString from 'query-string';

export { UnmarshalChainId };

type Options = {
  chainId: UnmarshalChainId;
  account: string;
};

export const getTokenBalancesFromUnmarshal = async ({
  chainId,
  account,
}: Options): Promise<TokenBalanceItem[]> => {
  const API_KEY = randomOf(splitAPIKeys(process.env.UNMARSHAL_API_KEYS));
  const API_URL = queryString.stringifyUrl({
    url: `https://api.unmarshal.io/v1/${chainId}/address/${account}/assets`,
    query: {
      auth_key: API_KEY,
      verified: false,
      chainId: false,
      token: true,
    },
  });

  const response = await axios.get<TokenBalanceItem[]>(API_URL, {
    timeout: 10_000,
  });
  return response.data;
};

// Token Balances (typing in Unmarshal core)
// export interface Assets {
export type TokenBalanceItem = {
  contract_name?: string;
  contract_ticker_symbol?: string;
  contract_decimals?: number;
  contract_address?: string;
  coin?: number;
  type?: string;
  balance?: string;
  quote?: number;
  quote_rate?: number;
  logo_url?: string;
  quote_rate_24h?: string;
  quote_pct_change_24h?: number;
};
