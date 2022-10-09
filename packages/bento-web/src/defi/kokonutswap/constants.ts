import { KLAYTN_TOKENS } from '@bento/core';

export const KOKOS_ADDRESS = '0xcd670d77f3dcab82d43dff9bd2c4b87339fb3560';
export const STAKED_KOKOS_ADDRESS =
  '0xc75456755d68058bf182bcd41c6d9650db4ce89e';
export const KOKOS_TOKEN_INFO = KLAYTN_TOKENS.find(
  (v) => v.address === KOKOS_ADDRESS,
)!;
