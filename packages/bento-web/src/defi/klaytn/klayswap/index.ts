import { KSP_ADDRESS, KSP_TOKEN_INFO, VOTING_KSP_ADDRESS } from './constants';
import { getGovernanceStake } from './governance';
import { getLPPoolBalance } from './lp';
import { getLeveragePoolList, getSinglePoolBalance } from './single';

export const KlaySwap = {
  KSP_ADDRESS,
  KSP_TOKEN_INFO,
  VOTING_KSP_ADDRESS,
  getGovernanceStake,
  getLPPoolBalance,
  getSinglePoolBalance,
  getLeveragePoolList,
};
