import { KlaytnChain } from '@bento/core/lib/chains';

const klaytnChain = new KlaytnChain();
const provider = klaytnChain._provider;
const PROTOCOL = '0x03Ef42272dc34d5EF78a21F8D6781182C67b82A0';

const NODES: Record<string, string> = {
  '0xe33337cb6fbb68954fe1c3fde2b21f56586632cd': 'Hashed-Ozys',
  '0xeffa404dac6ba720002974c54d57b20e89b22862': 'The Korea Economic Daily',
  '0x962cdb28e662b026df276e5ee7fdf13a06341d68': 'FSN',
};

export const getNodeStakes = async () => {
  const protocol = new provider.klay.Contract(
    [
      {
        constant: true,
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
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ],
    PROTOCOL,
  );

  const items: StakingInfo[] = await protocol.methods
    .getStakingInfo('0x7777777141f111cf9f0308a63dbd9d0cad3010c4')
    .call();
  // console.log(items);
  const stakes = items.map((stakingInfo) => {
    const node = NODES[stakingInfo.delegation.toLowerCase()];

    const deposit = Number(stakingInfo.deposit) / 10 ** 18;
    const sklayTotalSupply = Number(stakingInfo.sklayTotalSupply) / 10 ** 18;
    const totalStaking = Number(stakingInfo.totalStaking) / 10 ** 18;

    const delegated = (deposit / sklayTotalSupply) * totalStaking;

    return {
      node,
      delegated,
      pending: Number(stakingInfo.pending) / 10 ** 18,
    };
  });
  console.log(stakes);
};

type StakingInfo = {
  delegation: string;
  sklay: string;
  store: string;
  deposit: string;
  historyCount: string;
  totalIn: string;
  totalOut: string;
  sTotalIn: string;
  sTotalOut: string;
  pending: string;
  sklayTotalSupply: string;
  totalStaking: string;
  userBalanceKLAY: string;
  userBalanceSKLAY: string;
};
