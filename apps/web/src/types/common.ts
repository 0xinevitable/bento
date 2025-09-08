// Common types to replace @bento/common and @bento/core dependencies

export type ChainType = 'evm' | 'cosmos-sdk' | 'sealevel';

export interface Wallet {
  address: string;
  type: ChainType;
  network?: string;
  networks?: string[];
}

export interface BentoUser {
  id: string;
  username?: string;
  displayName?: string;
  email?: string;
  avatar?: string;
  profileImage?: string;
  bio?: string;
  wallets?: Wallet[];
}

export interface BentoUserResponse {
  result?: BentoUser;
}


export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const Base64 = {
  encode: (str: string): string => {
    if (typeof window !== 'undefined') {
      return window.btoa(str);
    }
    return Buffer.from(str).toString('base64');
  },
  decode: (str: string): string => {
    if (typeof window !== 'undefined') {
      return window.atob(str);
    }
    return Buffer.from(str, 'base64').toString();
  },
};

export const safePromiseAll = async <T>(promises: Promise<T>[]): Promise<T[]> => {
  const results = await Promise.allSettled(promises);
  return results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => (result as PromiseFulfilledResult<T>).value);
};

export const safeAsyncFlatMap = async <T, R>(
  array: T[],
  callback: (item: T) => Promise<R[]>
): Promise<R[]> => {
  const results = await safePromiseAll(array.map(callback));
  return results.flat();
};

export const cachedAxios = {
  get: async (url: string, options?: any) => {
    const response = await fetch(url, { ...options, method: 'GET' });
    return { data: await response.json() };
  },
};

export const pricesFromCoinGecko = async (coinIds: string[]): Promise<Record<string, number>> => {
  if (!coinIds.length) return {};
  
  try {
    const ids = coinIds.join(',');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );
    const data = await response.json();
    
    const prices: Record<string, number> = {};
    for (const id of coinIds) {
      if (data[id]?.usd) {
        prices[id] = data[id].usd;
      }
    }
    return prices;
  } catch (error) {
    console.error('Failed to fetch prices from CoinGecko:', error);
    return {};
  }
};

export const identifyWalletAddress = (value: string): ChainType | null => {
  if (value.length < 32) {
    return null;
  }
  
  // Check if it's an EVM address (starts with 0x and is 42 chars)
  if (value.startsWith('0x') && value.length === 42) {
    return 'evm';
  }
  
  // Check if it's a Cosmos address (starts with cosmos, osmo, etc)
  if (value.match(/^(cosmos|osmo|evmos|juno|atom)/)) {
    return 'cosmos-sdk';
  }
  
  // Check if it's a Solana address (base58 encoded, typically 32-44 chars)
  if (value.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
    return 'sealevel';
  }
  
  return null;
};

