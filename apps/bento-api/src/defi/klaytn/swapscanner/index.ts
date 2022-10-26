import {
  SCNR_ADDRESS,
  SCNR_KLAY_LP_ADDRESS,
  SCNR_STAKING_ADDRESS,
  SCNR_TOKEN_INFO,
} from './constants';
import { getGovernanceStake } from './governance';
import { getSCNRTokenPrice } from './lp';

// import { getLPPoolBalance } from './lp';

export const Swapscanner = {
  SCNR_ADDRESS,
  SCNR_KLAY_LP_ADDRESS,
  SCNR_STAKING_ADDRESS,
  SCNR_TOKEN_INFO,
  getSCNRTokenPrice,
  // getLPPoolBalance,
  getGovernanceStake,
};
