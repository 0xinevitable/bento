import { sessionAtom } from '@bento/client/recoil/session';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Supabase } from '@/utils/Supabase';
import { Analytics } from '@/utils/analytics';
import { toast } from '@/utils/toast';

const handleAuthChange = async (
  event: AuthChangeEvent,
  session: Session | null,
) => {
  await fetch('/api/auth', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify({ event, session }),
  });
};

export const SessionManager: React.FC = () => {
  const [currentSession, setCurrentSession] = useAtom(sessionAtom);

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

  const router = useRouter();
  useEffect(() => {
    if (!router.query) {
      return;
    }

    if (router.query.error === 'server_error') {
      const description =
        typeof router.query.error_description === 'string'
          ? router.query.error_description
          : undefined;

      toast({
        type: 'error',
        title: 'Server Error',
        description,
      });

      const url = new URL(location.href);
      url.searchParams.delete('error');
      url.searchParams.delete('error_description');
      history.replaceState(null, '', url.href);
    }
  }, [router.query]);

  useEffect(() => {
    Analytics.updateUserProperties(currentSession);

    if (!currentSession) {
      return;
    }

    if (window.location.hash.includes('access_token=')) {
      window.location.hash = '';
    }
  }, [JSON.stringify(currentSession)]);

  return null;
};

export const useSession = () => {
  const currentSession = useAtomValue(sessionAtom);

  return { session: currentSession };
};
