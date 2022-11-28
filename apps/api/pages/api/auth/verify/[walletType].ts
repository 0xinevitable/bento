import { Base64 } from '@bento/common';
import { StdSignDoc, serializeSignDoc } from '@cosmjs/amino';
import { Secp256k1, Secp256k1Signature, sha256 } from '@cosmjs/crypto';
import { verifyMessage } from '@ethersproject/wallet';
import { PublicKey } from '@solana/web3.js';
import { PostgrestError } from '@supabase/supabase-js';
import Caver from 'caver-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import nacl from 'tweetnacl';

import { createRedisClient } from '@/utils/Redis';
import { ServerSupabase as Supabase } from '@/utils/ServerSupabase';
import { withCORS } from '@/utils/middlewares/withCORS';

type APIRequest = NextApiRequest &
  (
    | {
        query: {
          walletType: 'web3' | 'kaikas' | 'phantom';
        };
        body: {
          account: string;
          signature: string;
          nonce: string;
          networks: string;
        };
      }
    | {
        query: {
          walletType: 'keplr';
        };
        body: {
          account: string;
          signature: string;
          nonce: string;
          publicKeyValue: string;
          networks: string;
        };
      }
  );

const caver = new Caver('https://public-node-api.klaytnapi.com/v1/cypress');

const handler = async (req: APIRequest, res: NextApiResponse) => {
  const { walletType } = req.query;
  const { signature, nonce, ...optionalParams } = req.body;
  let walletAddress = optionalParams.account;
  if (walletType !== 'phantom') {
    walletAddress = walletAddress.toLowerCase();
  }

  const accessToken = (req.headers['x-supabase-auth'] as string) || '';
  const { user } = await Supabase.auth.api.getUser(accessToken);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  let isValid: boolean = false;
  const signedMessage = Base64.decode(nonce);
  const nonceId = signedMessage.split('Nonce: ')[1].trim();

  const redisClient = createRedisClient();
  await redisClient.connect();
  const nonceData = await redisClient.get(`add-wallet-nonce:${nonceId}`);
  const walletAddressFromNonce = nonceData?.split('///')?.[0];

  // TODO: Check expiration
  if (walletAddressFromNonce?.toLowerCase() !== walletAddress.toLowerCase()) {
    return res.status(400).json({
      error: 'Invalid nonce',
    });
  } else {
    await redisClient.del(`add-wallet-nonce:${nonceId}`);
  }
  await redisClient.disconnect();

  if (walletType === 'web3') {
    const recovered = verifyMessage(signedMessage, signature);
    isValid = recovered.toLowerCase() === walletAddress;
  } else if (walletType === 'keplr') {
    const secpSignature = Secp256k1Signature.fromFixedLength(
      new Uint8Array(Buffer.from(signature, 'base64')),
    );
    const rawSecp256k1Pubkey = new Uint8Array(
      Buffer.from(optionalParams.publicKeyValue, 'base64'),
    );

    const doc = makeADR36AminoSignDoc(walletAddress, signedMessage);
    const prehashed = sha256(serializeSignDoc(doc));

    isValid = await Secp256k1.verifySignature(
      secpSignature,
      prehashed,
      rawSecp256k1Pubkey,
    );
  } else if (walletType === 'kaikas') {
    const recovered = caver.utils.recover(
      signedMessage,
      caver.utils.decodeSignature(signature),
    );
    isValid = recovered.toLowerCase() === walletAddress;
  } else if (walletType === 'phantom') {
    const encodedMessage = new TextEncoder().encode(signedMessage);
    isValid = nacl.sign.detached.verify(
      new Uint8Array(encodedMessage),
      new Uint8Array(Buffer.from(signature, 'hex')),
      new PublicKey(walletAddress).toBytes(),
    );
  } else {
    return res.status(400).json({
      error: 'Invalid wallet type',
    });
  }

  if (!isValid) {
    return res.status(400).json({
      error: 'Invalid signature',
    });
  }

  const networks = (() => {
    try {
      return Base64.decode(optionalParams.networks).split(',');
    } catch {
      return [] as string[];
    }
  })();
  if (networks.length === 0) {
    return res.status(400).json({
      error: 'Invalid networks',
    });
  }

  const prevNetworkQuery = await Supabase.from('wallets') //
    .select('id, address, networks, user_id')
    .eq('address', walletAddress)
    .eq('user_id', user.id);
  const previousNetworks = (prevNetworkQuery.data ?? []).flatMap(
    (v) => v.networks,
  );
  const mergedNetworks = Array.from(
    new Set([...previousNetworks, ...networks]),
  );

  let error: PostgrestError | null = null;

  const walletArchitectureType =
    walletType === 'phantom'
      ? 'sealevel'
      : walletType === 'keplr'
      ? 'cosmos-sdk'
      : 'evm';

  if ((prevNetworkQuery.data ?? []).length === 0) {
    const res = await Supabase.from('wallets').upsert(
      {
        type: walletArchitectureType,
        address: walletAddress,
        user_id: user.id,
        networks: mergedNetworks,
      },
      { returning: 'minimal' },
    );
    error = res.error;
  } else if (!!prevNetworkQuery.data?.[0]) {
    const update_id = prevNetworkQuery.data[0].id;
    const res = await Supabase.from('wallets')
      .update(
        {
          id: update_id,
          type: walletArchitectureType,
          address: walletAddress,
          user_id: user.id,
          networks: mergedNetworks,
        },
        { returning: 'minimal' },
      )
      .eq('id', update_id);
    error = res.error;
  } else {
    console.log('else', prevNetworkQuery.data);
  }
  if (error) {
    console.log(error);
    return res.status(400).json({
      error: 'Failed to save wallet',
    });
  }

  return res.status(200).json({
    isValid,
  });
};

export default withCORS(handler);

// https://github.com/chainapsis/keplr-wallet/blob/dd487d2a041e2a0ebff99b1cc633bc84a9eef916/packages/cosmos/src/adr-36/amino.ts#L87
function makeADR36AminoSignDoc(
  signer: string,
  data: string | Uint8Array,
): StdSignDoc {
  if (typeof data === 'string') {
    data = Buffer.from(data).toString('base64');
  } else {
    data = Buffer.from(data).toString('base64');
  }

  return {
    chain_id: '',
    account_number: '0',
    sequence: '0',
    fee: {
      gas: '0',
      amount: [],
    },
    msgs: [
      {
        type: 'sign/MsgSignData',
        value: {
          signer,
          data,
        },
      },
    ],
    memo: '',
  };
}
