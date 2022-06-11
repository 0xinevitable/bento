import { Wallet } from '@bento/types';

/**
 * @deprecated We use them dynamically now
 */
export const wallets: Wallet[] = [
  {
    type: 'evm',
    address: '0x458b14915e651243acf89c05859a22d5cff976a6',
    chains: ['polygon'],
  },
  {
    type: 'evm',
    address: '0x4a003f0a2c52e37138eb646aB4E669C4A84C1001',
    chains: ['ethereum', 'klaytn'],
  },
  {
    type: 'evm',
    address: '0x7777777141f111cf9F0308a63dbd9d0CaD3010C4',
    chains: ['ethereum', 'klaytn'],
  },
  {
    type: 'evm',
    address: '0x6666666854F24DC3cb86feF8F4DC724F34589044',
    chains: ['klaytn'],
  },
  {
    type: 'evm',
    address: '0x9c7377E72564EcD512a68672BA943AB48dBa0415',
    chains: ['klaytn'],
  },
  {
    type: 'evm',
    address: '0x3c7263D65c89aE119FdE18cc2BbE3CE9A108133D',
    chains: ['klaytn'],
  },
  {
    type: 'solana',
    address: 'HJLQd7CxQK5epNLE3R4u8b2MdGzmcvXjpntGWfht4FZH',
  },
  {
    type: 'cosmos-sdk',
    address: 'cosmos15zysaya5j34vy2cqd7y9q8m3drjpy0d2hhgxh0',
    chains: ['cosmos-hub', 'osmosis'],
  },
];
