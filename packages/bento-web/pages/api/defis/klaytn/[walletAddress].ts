import { KlaytnChain, getTokenBalancesFromCovalent } from '@bento/core';
import { NextApiRequest, NextApiResponse } from 'next';

import { withCORS } from '@/utils/middlewares/withCORS';

import KLAYSWAP_LEVERAGE_POOLS from '@/defi/constants/klayswap-leverage-pools.json';
import KLAYSWAP_LP_POOLS from '@/defi/constants/klayswap-lp-pools.json';
import KOKONUTSWAP_LP_POOLS from '@/defi/constants/kokonutswap-lp-pools.json';
import { KlaySwap } from '@/defi/klayswap';

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

const isSameAddress = (a: string, b: string): boolean => {
  return a.toLowerCase() === b.toLowerCase();
};

const klaytnChain = new KlaytnChain();

const handler = async (req: APIRequest, res: NextApiResponse) => {
  const wallets = parseWallets(req.query.walletAddress ?? '');

  // TODO: Enumerate for all wallets
  const walletAddress = wallets[0];
  const [tokenBalances, dynamicLeveragePools] = await Promise.all([
    getTokenBalancesFromCovalent({
      chainId: klaytnChain.chainId,
      walletAddress,
    }),
    KlaySwap.getLeveragePoolList(),
  ]);

  console.log('=');
  for (const token of tokenBalances) {
    if (Number(token.balance) <= 0) {
      continue;
    }

    // KLAYswap LP
    const klayswapLPPool = KLAYSWAP_LP_POOLS.find((v) =>
      isSameAddress(v.exchange_address, token.contract_address),
    );
    if (!!klayswapLPPool) {
      console.log('klayswapLPPool');
      const balance = await KlaySwap.getLPPoolBalance(
        walletAddress,
        klayswapLPPool,
      );
      console.log(balance);
      continue;
    }

    // KLAYswap Leverage Pool (Single Staking)
    const klayswapLeveragePool = KLAYSWAP_LEVERAGE_POOLS.find((v) =>
      isSameAddress(v.address, token.contract_address),
    );
    if (!!klayswapLeveragePool) {
      console.log('klayswapLeveragePool');
      const balance = await KlaySwap.getSinglePoolBalance(
        walletAddress,
        klayswapLeveragePool,
        dynamicLeveragePools.find(
          (v) => v.address === klayswapLeveragePool.address,
        ),
      );
      console.log(balance);
      continue;
    }

    // Kokonutswap LP
    const kokonutswapLPPool = KOKONUTSWAP_LP_POOLS.find((v) =>
      isSameAddress(v.lpTokenAddress, token.contract_address),
    );
    if (!!kokonutswapLPPool) {
      console.log('kokonutswapLPPool');
      continue;
    }
  }

  res.status(200).json(tokenBalances);
};

export default withCORS(handler);
