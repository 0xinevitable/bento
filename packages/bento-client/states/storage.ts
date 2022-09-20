import { createJSONStorage } from 'jotai/utils';

export const storage = {
  ...createJSONStorage(() => localStorage),
  delayInit: true,
};
