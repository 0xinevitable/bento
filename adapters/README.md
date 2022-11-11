# @bento/adapters

```bash
* Osmosis
/osmosis/index.ts # Osmosis (Chain)
  /osmosis/osmosis/index.ts # Osmosis (Service)
  /osmosis/osmosis/governance.ts # Osmosis Governance
  /osmosis/osmosis/gamm.ts # Osmosis GAMM
  /osmosis/ion-dao/governance.ts # ION DAO Governance
```

### Chain

```ts
// [chain]/index.ts
const currency: TokenInput // ind = ZERO_ADDRESS(0x0000...) if native token in evm; using denom in cosmos-sdks

export default {
  name: 'Osmosis',
  type: 'cosmos-sdk' // evm | sealevel | cosmos-sdk
};

export const getAccount = async (account: string) => {
  return {
    tokens: [currency],
    wallet: {
      tokenAmounts: {
        [currency.ind]: balance,
      }
    }
  }
}
```

### Service

```ts
// [chain]/[service]/index.ts

// chain native
export default {
  native: true,
  name: 'Osmosis',
  logo: '',
  url: '',
  description: {
    en: '',
    ko: '',
  },
};

export default {
  native: false,
  name: 'Swapscanner',
  logo: '',
  url: '',
  description: {
    en: '',
    ko: '',
  },
};
```

### Protocol

```ts
// [chain]/[service]/[protocol].ts

let token: TokenInput | NativeInput;

// chain native
export default {
  native: true,
  ind: poolId,
  name: {
    en: 'Osmosis LPs',
    ko: '오스모시스 LP 풀',
  }, // protocol name
};

// from contract
export default {
  native: false,
  ind: '0x7777777141f111cf9f0308a63dbd9d0cad3010c4', // contract address
  name: '단일 예치',
};

export const getAccount = async (account: string) => {
  const tokens = [token];

  return [
    {
      delegator: 'Manythings', // optional; for validator/node
      tokens: tokens, // tokens used in `tokenAmounts`
      relatedTokens: [],
      prefix: tokens.flatMap((v) => v?.symbol || []).join(' + '), // optional
      wallet: null,
      staked: {
        tokenAmounts: {
          [token.ind]: delegations,
        },
        value: 30001.33, // optional; valuation in USD
      },
      unstake: 'unavailable', // null if unexist / 'unavailable' if query is not implemented
      rewards: {
        tokenAmounts: {
          [token.ind]: rewards,
        },
      },
    },
  ];
};
```
