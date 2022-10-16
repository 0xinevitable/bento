import { Wallet, safePromiseAll } from '@bento/common';
import CompressedJSON from 'compressed-json';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createRedisClient } from '@/utils/Redis';
import { ServerSupabase as Supabase } from '@/utils/ServerSupabase';
import { withCORS } from '@/utils/middlewares/withCORS';

import {
  DeFiStaking,
  KlaytnDeFiProtocolType,
  KlaytnDeFiType,
} from '@/defi/types/staking';

type APIRequest = NextApiRequest & {
  query: {
    userId: string;
  };
};

const handler = async (req: APIRequest, res: NextApiResponse) => {
  if (!req.query.userId || typeof req.query.userId !== 'string') {
    return res.status(400).json({ error: 'Invalid user id' });
  }
  const userQuery = await Supabase.auth.api.getUserById(req.query.userId);
  if (!userQuery.data) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const user = userQuery.data;
  const walletQuery = await Supabase.from('wallets')
    .select('*')
    .eq('user_id', user.id);
  const wallets: Wallet[] = walletQuery.data ?? [];
  const klaytnWallets = wallets.filter(
    (v) => v.type === 'evm' && v.networks.includes('klaytn'),
  );
  if (klaytnWallets.length === 0) {
    return res.status(200).json([]);
  }

  // let badges = [];
  let klayswapAchievements: string[] = [];
  let swapscannerAchievements: string[] = [];

  let klayswapLPCount = 0;
  let klayswapStakedAmount = 0;
  let swapscannerStakedAmount = 0;

  const redisClient = createRedisClient();
  await redisClient.connect();

  await safePromiseAll(
    klaytnWallets.map(async (wallet) => {
      const out = await redisClient.get(`defis:klaytn:${wallet.address}`);
      if (!out) {
        return;
      }
      const { v: defis } = CompressedJSON.decompress.fromString<{
        t: number;
        v: DeFiStaking[];
      }>(out);
      for (const defi of defis) {
        console.log({ defi });
        if (defi.protocol === KlaytnDeFiProtocolType.KLAYSWAP) {
          if (defi.type === KlaytnDeFiType.KLAYSWAP_GOVERNANCE) {
            const amount = Object.values(defi.staked.tokenAmounts || {})[0];
            if (!!amount) {
              klayswapStakedAmount += amount;
            }
          }
          if (defi.type === KlaytnDeFiType.KLAYSWAP_LP) {
            klayswapLPCount += 1;
          }
        }
        if (defi.protocol === KlaytnDeFiProtocolType.SWAPSCANNER) {
          if (defi.type === KlaytnDeFiType.SWAPSCANNER_GOVERNANCE) {
            const amount = Object.values(defi.staked.tokenAmounts || {})[0];
            if (!!amount) {
              swapscannerStakedAmount += amount;
            }
          }
        }
      }
    }),
  );

  if (klayswapLPCount > 0) {
    klayswapAchievements.push(`Staking in ${klayswapLPCount}+ LPs`);
  }
  let thresholds = [20000, 15000, 10000, 1000, 500, 100, 1, 0];
  for (let i = 0; i < thresholds.length; i++) {
    if (klayswapStakedAmount >= thresholds[i]) {
      klayswapAchievements.push(
        `Staking ${thresholds[i].toLocaleString()}+ KSP in Governance`,
      );
      break;
    }
  }
  for (let i = 0; i < thresholds.length; i++) {
    if (swapscannerStakedAmount >= thresholds[i]) {
      swapscannerAchievements.push(
        `Staking ${thresholds[i].toLocaleString()}+ SCNR in Governance`,
      );
      break;
    }
  }

  const badges = [
    {
      type: KlaytnDeFiProtocolType.KLAYSWAP,
      achievements: klayswapAchievements,
    },
    {
      type: KlaytnDeFiProtocolType.SWAPSCANNER,
      achievements: swapscannerAchievements,
    },
  ];

  await redisClient.disconnect();

  return res.status(200).json(badges);
};

export default withCORS(handler);
