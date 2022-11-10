import { ChainGetAccount, ChainInfo } from '@/_lib/types';

import { klaytnChain } from './_lib/chain';

const info: ChainInfo = {
  name: 'Klaytn',
  type: 'evm',
};
export default info;

export const getAccount: ChainGetAccount = async (account) => {
  const items = await Promise.all([
    klaytnChain.getBalance(account),
    (await klaytnChain.getTokenBalances(account)).flat(),
  ]);
  return items.flat();
};

export const TEST_ADDRESS = '0x7777777141f111cf9f0308a63dbd9d0cad3010c4';
