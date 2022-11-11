import {
  ProtocolAccountInfo,
  ProtocolInfo,
  ServiceInfo,
} from '@/constants/adapters';

import { Valuation } from '../utils/getDeFiStakingValue';

export type ServiceData = ServiceInfo & {
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
  protocols: {
    info: ProtocolInfo;
    accounts: (ProtocolAccountInfo & {
      account: string;
    })[];
  }[];
})[];
