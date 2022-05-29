export interface ERC20TokenInput {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  coinGeckoId?: string;
  coinMarketCapId?: number;
  logo?: string;
  staking?: boolean;
}

export const KLAYTN_TOKENS: ERC20TokenInput[] = [
  {
    symbol: 'SCNR',
    name: 'Swapscanner',
    decimals: 25,
    address: '0x8888888888885b073f3c81258c27e83db228d5f3',
    logo: 'https://api.swapscanner.io/api/tokens/0x8888888888885b073f3c81258c27e83db228d5f3/icon',
  },
  {
    symbol: 'KSP',
    name: 'KlaySwap Protocol',
    decimals: 18,
    address: '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654',
    coinGeckoId: 'klayswap-protocol',
    logo: '/assets/klayswap.png',
  },
  {
    symbol: 'oUSDC',
    name: 'Orbit Bridge Klaytn USD Coin',
    decimals: 6,
    address: '0x754288077d0ff82af7a5317c7cb8c444d421d103',
    coinGeckoId: 'usd-coin',
    logo: 'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    symbol: 'oUSDT',
    name: 'Orbit Bridge Klaytn USD Tether',
    decimals: 6,
    address: '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167',
    coinGeckoId: 'tether',
    logo: 'https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  },
  {
    symbol: 'MBX',
    name: 'MARBLEX',
    decimals: 18,
    address: '0xd068c52d81f4409b9502da926ace3301cc41f623',
    coinGeckoId: 'marblex',
    logo: '/assets/marblex.svg',
  },
  {
    symbol: 'WEMIX',
    name: 'WEMIX',
    decimals: 18,
    address: '0x5096db80b21ef45230c9e423c373f1fc9c0198dd',
    coinGeckoId: 'wemix-token',
    logo: '/assets/wemix.png',
  },
  {
    symbol: 'CLA',
    name: 'ClaimSwap',
    decimals: 18,
    address: '0xcf87f94fd8f6b6f0b479771f10df672f99eada63',
    coinMarketCapId: 18371,
    logo: '/assets/claimswap.png',
  },
  {
    symbol: 'KRNO',
    name: 'Kronos DAO',
    decimals: 18,
    address: '0xd676e57ca65b827feb112ad81ff738e7b6c1048d',
    coinMarketCapId: 15546,
    logo: '/assets/kronos-dao.png',
  },
  {
    symbol: 'KRNO',
    name: 'Kronos DAO',
    decimals: 18,
    address: '0x6555f93f608980526b5ca79b3be2d4edadb5c562',
    coinMarketCapId: 15546,
    logo: '/assets/kronos-dao.png',
    staking: true,
  },
];
