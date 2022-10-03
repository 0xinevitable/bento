import { Config, randomOf } from '@bento/common';
import axios from 'axios';

type Options = {
  chainId: number;
  walletAddress: string;
};

export const getTokenBalancesFromCovalent = async ({
  chainId,
  walletAddress,
}: Options) => {
  const API_KEY = randomOf(Config.COVALENT_API_KEYS);
  const API_URL = `https://api.covalenthq.com/v1/${chainId}/address/${walletAddress}/balances_v2/?key=${API_KEY}`;

  const response = await axios
    .get<TokenBalancesResponse>(API_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch((error) => {
      console.error(error);
      return null;
    });

  console.log(JSON.stringify(response));

  if (!response) {
    // FIXME: Error handling
    return [];
  }

  try {
    return response.data.data.items;
  } catch {
    // FIXME: Error handling
    return [];
  }
};

export type TokenBalancesResponse = {
  data: {
    address: string;
    updated_at: string;
    next_update_at: string;
    quote_currency: string;
    chain_id: number;
    items: [
      {
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
      },
    ];
    pagination: null;
  };
  error: false;
  error_message: null;
  error_code: null;
};