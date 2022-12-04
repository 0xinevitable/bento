import { bech32 } from 'bech32';

// NOTE: From https://github.com/junhoyeo/keplr-wallet/blob/5c8cc2b7ee5357584d25bc8026dcee946f82c56f/packages/cosmos/src/bech32/index.ts#L4
export class Bech32Address {
  constructor(public readonly address: Uint8Array) {}

  static fromBech32(bech32Address: string, prefix?: string): Bech32Address {
    const decoded = bech32.decode(bech32Address);
    if (prefix && decoded.prefix !== prefix) {
      throw new Error('Unmatched prefix');
    }

    return new Bech32Address(new Uint8Array(bech32.fromWords(decoded.words)));
  }

  // NOTE: we use only `mainPrefix` as `prefix` for now (Hint: `defaultBech32Config` in `keplr-wallet`)
  toBech32(prefix: string): string {
    const words = bech32.toWords(this.address);
    return bech32.encode(prefix, words);
  }
}
