import { ChainGetAccount, ChainInfo } from '@/_lib/types';

import { klaytnChain } from './_lib/chain';

const info: ChainInfo = {
  name: 'Klaytn',
  type: 'evm',
};
export default info;

export const getAccount: ChainGetAccount = async (account) => {
  return {
    tokens: [klaytnChain.currency],
    wallet: {
      tokenAmounts: {
        [klaytnChain.currency.ind]: await klaytnChain.getBalance(account),
      },
    },
  };
};
