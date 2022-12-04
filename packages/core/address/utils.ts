import { Bech32Address } from '@bento/core';
import { getAddress, isAddress } from '@ethersproject/address';
import { PublicKey } from '@solana/web3.js';

export const identifyWalletAddress = (value: string) => {
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
    if (!!Bech32Address.fromBech32(value.toLowerCase())) {
      return 'cosmos-sdk';
    }
  } catch {
    try {
      if (PublicKey.isOnCurve(new PublicKey(value).toBytes())) {
        return 'sealevel';
      }
    } catch (err) {
      return null;
    }
  }
  return null;
};
