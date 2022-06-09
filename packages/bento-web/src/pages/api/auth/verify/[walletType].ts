import { Base64 } from '@bento/core/lib/utils/Base64';
import { verifyMessage } from '@ethersproject/wallet';
import { PublicKey } from '@solana/web3.js';
import Caver from 'caver-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import nacl from 'tweetnacl';

export type WalletBalance = {
  walletAddress: string;
  address?: string;
  symbol: string;
  balance: number;
  price: number;
  logo?: string;
};

interface APIRequest extends NextApiRequest {
  query: {
    walletType: 'web3' | 'keplr' | 'kaikas' | 'phantom';
  };
  body: {
    walletAddress: string;
    signature: string;
    nonce: string;
  };
}

const caver = new Caver('https://public-node-api.klaytnapi.com/v1/cypress');

export default async (req: APIRequest, res: NextApiResponse) => {
  const { walletType } = req.query;
  const { walletAddress, signature, nonce } = req.body;

  let isValid: boolean = false;
  const signedMessage = Base64.decode(nonce);

  if (walletType === 'web3') {
    const recovered = verifyMessage(signedMessage, signature);
    isValid = recovered === walletAddress;
  } else if (walletType === 'keplr') {
    throw new Error('Not Implemented');
  } else if (walletType === 'kaikas') {
    const recovered = caver.utils.recover(
      signedMessage,
      caver.utils.decodeSignature(signature),
    );
    isValid = recovered === walletAddress;
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

  return res.status(200).json({
    isValid,
  });
};
