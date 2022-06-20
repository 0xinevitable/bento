import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { sessionAtom } from '@/recoil/session';
import { Supabase } from '@/utils/Supabase';

const handleAuthChange = async (
  event: AuthChangeEvent,
  session: Session | null,
) => {
  if (!session) {
    return;
  }
  await fetch('/api/auth', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ event, session }),
  });
};

export const SessionManager: React.FC = () => {
  const [currentSession, setCurrentSession] = useRecoilState(sessionAtom);

  useEffect(() => {
    setCurrentSession(Supabase.auth.session());

    Supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(event, session);

      if (event == 'SIGNED_IN') {
        if (currentSession?.user?.id !== session?.user?.id) {
          setCurrentSession(session);
        }
      }
    });
  }, []);

  return null;
};

export const useSession = () => {
  const [currentSession, setCurrentSession] = useRecoilState(sessionAtom);

  // FIXME: Define once above all `useSession` calls
  const signOut = useCallback(() => {
    setCurrentSession(null);
    Supabase.auth.signOut();
  }, []);

  return {
    session: currentSession,
    signOut,
  };
};
