import { Bech32Address } from '@bento/core';
import { getAddress, isAddress } from '@ethersproject/address';
import { PublicKey } from '@solana/web3.js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

import { createRedisClient } from '@/utils/Redis';
import { withCORS } from '@/utils/middlewares/withCORS';

type APIRequest = NextApiRequest & {
  query: {
    walletAddress: string;
  };
};

const handler = async (req: APIRequest, res: NextApiResponse) => {
  const walletAddress = req.query.walletAddress.toLowerCase();
  const walletType = identifyWalletAddress(walletAddress);
  if (!walletType) {
    return res.status(400).json({
      error: 'Invalid wallet address',
    });
  }

  const nonce = uuidv4();

  const redisClient = createRedisClient();
  await redisClient.connect();

  await redisClient.set(
    `add-wallet-nonce:${nonce}`,
    `${walletAddress}///${20 * 60 * 1_000}`,
  ); // 20 min

  await redisClient.disconnect();

  return res
    .status(200)
    .json({ nonce: `Sign this message to add your wallet\nNonce: ${nonce}` });
};

export default withCORS(handler);

const identifyWalletAddress = (value: string) => {
  if (value.length < 32) {
    // minimal length of a valid address(solana)
    return null;
  }
  if (value.startsWith('0x')) {
    try {
      const addressWithChecksum = getAddress(value.toLowerCase());
      if (isAddress(addressWithChecksum)) {
        return 'evm';
      }
      return null;
    } catch {
      return null;
    }
  }
  try {
    if (!!Bech32Address.fromBech32(value)) {
      return 'cosmos-sdk';
    }
  } catch {
    try {
      if (PublicKey.isOnCurve(new PublicKey(value))) {
        return 'solana';
      }
    } catch {
      return null;
    }
  }
  return null;
};
