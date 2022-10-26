import { Session } from '@supabase/supabase-js';
import { deleteCookie } from 'cookies-next';
import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { sessionAtom } from '../states';
import {
  Analytics,
  Config,
  Supabase,
  axiosWithCredentials,
  toast,
} from '../utils';

const registerAccessToken = (session: Session | null) => {
  if (session) {
    axiosWithCredentials.interceptors.request.use((config) => {
      return {
        ...config,
        headers: {
          ...config.headers,
          'x-supabase-auth': session.access_token,
        },
      };
    });

    document.cookie = `supabase_auth_token=${session.access_token};max-age=${
      (session.expires_in || 60 * 60 * 24) * 1_000
    };secure;samesite=lax;path=/`;

    if (Config.ENVIRONMENT !== 'production') {
      console.log('Access token saved to Cookie');
    }
  } else {
    deleteCookie('supabase_auth_token', {
      path: '/',
    });

    if (Config.ENVIRONMENT !== 'production') {
      console.log('Access token removed from Cookie');
    }
  }
};

export const SessionManager: React.FC = () => {
  const [currentSession, setCurrentSession] = useAtom(sessionAtom);

  useEffect(() => {
    const session = Supabase.auth.session();
    setCurrentSession(session);
    registerAccessToken(session);

    Supabase.auth.onAuthStateChange((event, session) => {
      registerAccessToken(session);

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
