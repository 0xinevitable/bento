import { useSetAtom } from 'jotai';
import { deleteCookie } from 'cookies-next';
import { useCallback } from 'react';

import { sessionAtom } from '../states';

export const useSignOut = () => {
  const setCurrentSession = useSetAtom(sessionAtom);

  const signOut = useCallback(async () => {
    setCurrentSession(null);
    // Clear any auth cookies
    deleteCookie('supabase_auth_token', { path: '/' });
  }, [setCurrentSession]);

  return { signOut };
};