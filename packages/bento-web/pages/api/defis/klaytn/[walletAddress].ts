import { KlaytnChain } from '@bento/core';
import { getTokenBalancesFromCovalent } from '@bento/core/lib/chains/indexers/Covalent';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { withCORS } from '@/utils/middlewares/withCORS';

import { KLAYswap } from '@/defi/klayswap/lp';

interface APIRequest extends NextApiRequest {
  query: {
    walletAddress?: string;
  };
}

const parseWallets = (mixedQuery: string) => {
  const query = mixedQuery.toLowerCase();
  if (query.indexOf(',') === -1) {
    return [query];
  }
  return query.split(',');
};

const klaytnChain = new KlaytnChain();

const handler = async (req: APIRequest, res: NextApiResponse) => {
  const wallets = parseWallets(req.query.walletAddress ?? '');

  // TODO: Enumerate for all wallets
  const walletAddress = wallets[0];
  const tokenBalances = await getTokenBalancesFromCovalent({
    chainId: klaytnChain.chainId,
    walletAddress,
  });

  console.log(tokenBalances);
  res.status(200).json(tokenBalances);
};

export default withCORS(handler);
