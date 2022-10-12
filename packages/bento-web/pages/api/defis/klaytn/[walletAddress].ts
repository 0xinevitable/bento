import { safeAsyncFlatMap, safePromiseAllV1 } from '@bento/common';
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
} from '@/defi/klaytn/constants';
import { KlayStation } from '@/defi/klaytn/klaystation';
import { KlaySwap } from '@/defi/klaytn/klayswap';
import { KokonutSwap } from '@/defi/klaytn/kokonutswap';
import { Swapscanner } from '@/defi/klaytn/swapscanner';
import { SCNR_ADDRESS } from '@/defi/klaytn/swapscanner/constants';
import { withoutEmptyDeFiStaking } from '@/defi/klaytn/utils/withoutEmptyDeFiStaking';
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

type DeFiStakingCacheDTO = {
  t: number;
  v: DeFiStaking[];
};
const getCached = async <T extends any>(
  __key: string,
  __redisClient: ReturnType<typeof createRedisClient>,
) => {
  const cachedRawValue = await __redisClient.get(__key);
  if (!cachedRawValue) {
    return null;
  }
  return CompressedJSON.decompress.fromString<T>(cachedRawValue);
};

const MINUTES = 1_000 * 60;
const CACHED_TIME = 1 * MINUTES;

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

  let hasError: boolean = false;
  let stakings: DeFiStaking[] = [];
  let cachedTime = 0;

  const cached = await getCached<DeFiStakingCacheDTO>(
    `defis:klaytn:${walletAddress}`,
    redisClient,
  );
  if (cached && cached.t >= Date.now() - CACHED_TIME) {
    // Use cached value if not expired
    stakings = cached.v;
    cachedTime = cached.t;
  } else {
    try {
      stakings = await getDeFiStakingsByWalletAddress(walletAddress);
      cachedTime = new Date().getTime();
      await redisClient.set(
        `defis:klaytn:${walletAddress}`,
        CompressedJSON.compress.toString<DeFiStakingCacheDTO>({
          v: stakings,
          t: cachedTime,
        }),
      );
    } catch (err) {
      console.error(err);

      if (!cached) {
        hasError = true;
      } else {
        // Use cached value if available
        stakings = cached.v;
        cachedTime = cached.t;
      }
    }
  }

  await redisClient.disconnect();

  if (hasError) {
    res.status(500).json({ error: 'Internal server error' });
    return;
  }

  res.status(200).json({ walletAddress, stakings, cachedTime });
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

    // Swapscanner Governance
    if (isSameAddress(token.contract_address, SCNR_ADDRESS)) {
      return Swapscanner.getGovernanceStake(walletAddress);
    }

    return [];
  });

  // Delegations (KlayStation)
  const promisesForDelegations = KlayStation.getDelegations(walletAddress);

  const stakings = (
    await safePromiseAllV1([
      promisesForStakings.catch(handleError),
      promisesForDelegations.catch(handleError),
    ])
  ).flat();

  return stakings.filter(withoutEmptyDeFiStaking);
};
