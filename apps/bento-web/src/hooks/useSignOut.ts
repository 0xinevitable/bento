import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { sessionAtom } from '../states';
import { Supabase } from '../utils';

export const useSignOut = () => {
  const setCurrentSession = useSetAtom(sessionAtom);

  const signOut = useCallback(async () => {
    setCurrentSession(null);
    await Supabase.auth.signOut();
  }, [setCurrentSession]);

  return { signOut };
};
