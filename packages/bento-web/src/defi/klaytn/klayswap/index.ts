import { KSP_ADDRESS, VOTING_KSP_ADDRESS } from './constants';
import { getGovernanceStake } from './governance';
import { getLPPoolBalance } from './lp';
import { getLeveragePoolList, getSinglePoolBalance } from './single';

export const KlaySwap = {
  KSP_ADDRESS,
  VOTING_KSP_ADDRESS,
  getGovernanceStake,
  getLPPoolBalance,
  getSinglePoolBalance,
  getLeveragePoolList,
};
