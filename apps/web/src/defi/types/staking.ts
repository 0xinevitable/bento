import {
  BentoSupportedNetwork,
  ProtocolAccountInfo,
  ProtocolInfo,
  ServiceInfo,
} from '@/constants/adapters';

import { Valuation } from '../utils/getDeFiStakingValue';

export type ServiceData = ServiceInfo & {
  serviceId: string;
  netWorth: number;
  chain: BentoSupportedNetwork;
  protocols: {
    protocolId: string;
    netWorth: number;
    info: ProtocolInfo;
    accounts: (ProtocolAccountInfo & {
      account: string;
      valuation: Valuation;
    })[];
  }[];
};

export type ProtocolResponse = (ServiceInfo & {
  serviceId: string;
  chain: BentoSupportedNetwork;
  protocols: {
    protocolId: string;
    info: ProtocolInfo;
    accounts: (ProtocolAccountInfo & {
      account: string;
    })[];
  }[];
})[];
