export const MinimalABIs = {
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
      inputs: [{ name: '', type: 'address' }],
      name: 'totalStakedBalanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      type: 'function',
    },
  ],
};
