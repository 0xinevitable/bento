import { KLAYTN_TOKENS, TokenInput } from '@bento/core';

export const KSP_ADDRESS = '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654';
export const VOTING_KSP_ADDRESS = '0x2f3713f388bc4b8b364a7a2d8d57c5ff4e054830';

export const KSP_TOKEN_INFO = KLAYTN_TOKENS.find(
  (v) => v.address === KSP_ADDRESS,
) as TokenInput;
