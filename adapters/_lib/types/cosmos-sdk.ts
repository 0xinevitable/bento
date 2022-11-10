import { type Chain } from '.';

export type CosmosSDKBasedBalanceResponse = {
  balances: [
    {
      denom: string;
      amount: string;
    },
  ];
  pagination: {
    next_key: null;
    total: string; // number-like
  };
};

export type CosmosHubDelegationsResponse = {
  height: string; // number-like
  result: {
    delegation: {
      delegator_address: string;
      validator_address: string;
      shares: string; // number-like
    };
    balance: {
      denom: string;
      amount: string; // number-like
    };
  }[];
};

export type CosmosSDKBasedDelegationsResponse = {
  delegation_responses: {
    delegation: {
      delegator_address: string;
      validator_address: string;
      shares: string; // number-like
    };
    balance: {
      denom: string;
      amount: string; // number-like
    };
  }[];
  pagination: {
    next_key: null;
    total: string; // number-like
  };
};

export type CosmosSDKBasedDelegationRewardsResponse = {
  rewards: [
    {
      validator_address: string;
      reward: {
        denom: string;
        amount: string; // number-like
      }[];
    },
  ];
  total: [
    {
      denom: string;
      amount: string; // number-like
    },
  ];
};

export interface CosmosSDKBasedChain extends Chain {
  bech32Config: {
    prefix: string;
  };
  getDelegations: (address: string) => Promise<number>;
}
