import {
  KOKOS_ADDRESS,
  KOKOS_TOKEN_INFO,
  KSD_ADDRESS,
  KSD_TOKEN_INFO,
  STAKED_KOKOS_ADDRESS,
} from './constants';
import { getGovernanceStake } from './governance';
import { getLPPoolBalance } from './lp';

export const KokonutSwap = {
  KSD_ADDRESS,
  KSD_TOKEN_INFO,
  KOKOS_ADDRESS,
  KOKOS_TOKEN_INFO,
  STAKED_KOKOS_ADDRESS,
  getLPPoolBalance,
  getGovernanceStake,
};
