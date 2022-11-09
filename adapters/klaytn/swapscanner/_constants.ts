import { KLAYTN_TOKENS } from '@bento/core';

export const SCNR_ADDRESS = '0x8888888888885b073f3c81258c27e83db228d5f3';
export const SCNR_KLAY_LP_ADDRESS =
  '0xe1783a85616ad7dbd2b326255d38c568c77ffa26';
export const SCNR_STAKING_ADDRESS =
  '0x7c59930d1613ca2813e5793da72b324712f6899d';

export const SCNR_TOKEN_INFO = KLAYTN_TOKENS.find(
  (k) => k.address === SCNR_ADDRESS,
)!;

export const MINIMAL_ABIS = {
  ERC20: [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'who',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      type: 'function',
    },
  ],
  LP: [
    {
      inputs: [],
      name: 'getReserves',
      outputs: [
        { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
        { internalType: 'uint112', name: '_reserve1', type: 'uint112' },
        { internalType: 'uint32', name: '_blockTimestampLast', type: 'uint32' },
      ],
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      type: 'function',
    },
  ],
  Staking: [
    {
      inputs: [
        { internalType: 'address', name: '', type: 'address' },
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'stakedBalanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '', type: 'address' },
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'withdrawableRewardOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      type: 'function',
    },
  ],
};
