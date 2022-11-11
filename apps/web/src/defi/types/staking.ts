import {
  BentoSupportedNetwork,
  ProtocolAccountInfo,
  ProtocolInfo,
  ServiceInfo,
} from '@/constants/adapters';

import { Valuation } from '../utils/getDeFiStakingValue';

export type ServiceData = ServiceInfo & {
  netWorth: number;
  chain: BentoSupportedNetwork;
  protocols: {
    netWorth: number;
    info: ProtocolInfo;
    accounts: (ProtocolAccountInfo & {
      account: string;
      valuation: Valuation;
    })[];
  }[];
};
export type ProtocolResponse = (ServiceInfo & {
  chain: BentoSupportedNetwork;
  protocols: {
    info: ProtocolInfo;
    accounts: (ProtocolAccountInfo & {
      account: string;
    })[];
  }[];
})[];
