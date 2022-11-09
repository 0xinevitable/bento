export const PROTOCOL_ADDRESS = '0x03Ef42272dc34d5EF78a21F8D6781182C67b82A0';
export const PROTOCOL_ABI = [
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getStakingInfo',
    outputs: [
      {
        components: [
          { name: 'delegation', type: 'address' },
          { name: 'sklay', type: 'address' },
          { name: 'store', type: 'address' },
          { name: 'deposit', type: 'uint256' },
          { name: 'historyCount', type: 'uint256' },
          { name: 'totalIn', type: 'uint256' },
          { name: 'totalOut', type: 'uint256' },
          { name: 'sTotalIn', type: 'uint256' },
          { name: 'sTotalOut', type: 'uint256' },
          { name: 'pending', type: 'uint256' },
          { name: 'sklayTotalSupply', type: 'uint256' },
          { name: 'totalStaking', type: 'uint256' },
          { name: 'userBalanceKLAY', type: 'uint256' },
          { name: 'userBalanceSKLAY', type: 'uint256' },
        ],
        name: 'list',
        type: 'tuple[]',
      },
    ],
    type: 'function',
  },
];
