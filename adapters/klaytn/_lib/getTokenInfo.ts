import {
  EEEE_ADDRESS,
  KLAYTN_TOKENS,
  TokenInput,
  ZERO_ADDRESS,
} from '@bento/core';

import { klaytnChain } from './chain';

export const getTokenInfo = (loweredAddress: string): TokenInput | null => {
  if (loweredAddress === EEEE_ADDRESS || loweredAddress === ZERO_ADDRESS) {
    return { ...klaytnChain.currency, address: ZERO_ADDRESS };
  }
  const tokenInfo = KLAYTN_TOKENS.find((k) => k.address === loweredAddress);
  if (tokenInfo) {
    return tokenInfo;
  }
  return null;
};
