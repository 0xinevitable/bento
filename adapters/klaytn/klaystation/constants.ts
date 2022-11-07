import { KlaytnDeFiType } from '../../_lib/types/staking';

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
export const NODE_TYPE__BY_CONTRACT_ADDRESS: Record<string, KlaytnDeFiType> = {
  '0xe33337cb6fbb68954fe1c3fde2b21f56586632cd':
    KlaytnDeFiType.KLAYSTATION_NODE_HASHED_AND_OZYS,
  '0xeffa404dac6ba720002974c54d57b20e89b22862':
    KlaytnDeFiType.KLAYSTATION_NODE_KED,
  '0x962cdb28e662b026df276e5ee7fdf13a06341d68':
    KlaytnDeFiType.KLAYSTATION_NODE_FSN,
};
