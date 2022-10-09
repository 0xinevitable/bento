import { safeAsyncFlatMap, safePromiseAll } from '@bento/common';
import { getTokenBalancesFromCovalent } from '@bento/core';
import { getAddress, isAddress } from '@ethersproject/address';
import CompressedJSON from 'compressed-json';
import { NextApiRequest, NextApiResponse } from 'next';

import { createRedisClient } from '@/utils/Redis';
import { withCORS } from '@/utils/middlewares/withCORS';

import {
  KLAYSWAP_LEVERAGE_POOLS,
  KLAYSWAP_LP_POOLS,
  KOKONUTSWAP_LP_POOLS,
  klaytnChain,
} from '@/defi/constants';
import { KlayStation } from '@/defi/klaystation';
import { KlaySwap } from '@/defi/klayswap';
import { KokonutSwap } from '@/defi/kokonutswap';
import { DeFiStaking } from '@/defi/types/staking';

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
  try {
    return a.toLowerCase() === b.toLowerCase();
  } catch (err) {
    console.error(err, { a, b });
    return false;
  }
};

const isEthereumAddress = (addr: string): boolean => {
  if (!addr.startsWith('0x')) {
    return false;
  }
  try {
    const addressWithChecksum = getAddress(addr);
    if (isAddress(addressWithChecksum)) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

const handler = async (req: APIRequest, res: NextApiResponse) => {
  const wallets = parseWallets(req.query.walletAddress ?? '');

  // TODO: Enumerate for all wallets
  const walletAddress = wallets[0];
  if (!isEthereumAddress(walletAddress)) {
    res.status(400).json({ error: 'Invalid wallet address' });
    return;
  }

  const redisClient = createRedisClient();
  await redisClient.connect();

  let stakings: DeFiStaking[] = [];
  try {
    stakings = await getDeFiStakingsByWalletAddress(walletAddress);
    await redisClient.set(
      `defis:klaytn:${walletAddress}`,
      CompressedJSON.compress.toString(stakings),
    );
  } catch (err) {
    console.error(err);
    const cachedStakings = await redisClient.get(
      `defis:klaytn:${walletAddress}`,
    );
    if (!cachedStakings) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    stakings =
      CompressedJSON.decompress.fromString<DeFiStaking[]>(cachedStakings);
  }

  await redisClient.disconnect();

  res.status(200).json(stakings);
};

export default withCORS(handler);

const handleError = (error: any) => {
  console.error(error);
  return [];
};

const getDeFiStakingsByWalletAddress = async (
  walletAddress: string,
): Promise<DeFiStaking[]> => {
  const [tokenBalances, dynamicLeveragePools] = await Promise.all([
    getTokenBalancesFromCovalent({
      chainId: klaytnChain.chainId,
      walletAddress,
    }),
    KlaySwap.getLeveragePoolList().catch(() => undefined),
  ]);

  const promisesForStakings = safeAsyncFlatMap(tokenBalances, async (token) => {
    if (token.balance === null) {
      // Indexed at least once
      return [];
    }

    // KLAYswap LP
    const klayswapLPPool = KLAYSWAP_LP_POOLS.find((v) =>
      isSameAddress(v.exchange_address, token.contract_address),
    );
    if (!!klayswapLPPool) {
      return KlaySwap.getLPPoolBalance(
        walletAddress,
        token.balance,
        klayswapLPPool,
      );
    }

    // KLAYswap Leverage Pool (Single Staking)
    const klayswapLeveragePool = KLAYSWAP_LEVERAGE_POOLS.find((v) =>
      isSameAddress(v.address, token.contract_address),
    );
    if (!!klayswapLeveragePool) {
      return KlaySwap.getSinglePoolBalance(
        walletAddress,
        token.balance,
        klayswapLeveragePool,
        dynamicLeveragePools?.find(
          (v) => v.address === klayswapLeveragePool.address,
        ),
      );
    }

    // KLAYswap Governance
    if (isSameAddress(token.contract_address, KlaySwap.VOTING_KSP_ADDRESS)) {
      return KlaySwap.getGovernanceStake(walletAddress, token.balance);
    }

    // Kokonutswap LP
    const kokonutswapLPPool = KOKONUTSWAP_LP_POOLS.find((v) =>
      isSameAddress(v.lpTokenAddress, token.contract_address),
    );
    if (!!kokonutswapLPPool) {
      return KokonutSwap.getLPPoolBalance(
        walletAddress,
        token.balance,
        kokonutswapLPPool,
        KOKONUTSWAP_LP_POOLS,
      );
    }

    // Kokonutswap Governance
    if (
      isSameAddress(token.contract_address, KokonutSwap.STAKED_KOKOS_ADDRESS)
    ) {
      return KokonutSwap.getGovernanceStake(walletAddress, token.balance);
    }

    return [];
  });

  // Delegations (KlayStation)
  const promisesForDelegations = KlayStation.getDelegations(walletAddress);

  const stakings = (
    await safePromiseAll([
      promisesForStakings.catch(handleError),
      promisesForDelegations.catch(handleError),
    ])
  ).flat();

  return stakings;
};
