import { Session } from '@supabase/supabase-js';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { sessionAtom } from '../states';
import { Analytics, Config, Supabase, axios, toast } from '../utils';

const registerAccessToken = (session: Session | null) => {
  axios.interceptors.request.use((config) => {
    return {
      ...config,
      headers: {
        ...config.headers,
        'x-supabase-auth': session?.access_token,
      },
    };
  });

  if (session) {
    const expireDate = session?.expires_at
      ? new Date(session.expires_at)
      : new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    setCookie('supabase.auth.token', session.access_token, {
      path: '/',
      expires: expireDate,
      secure: true,
      sameSite: 'lax',
    });

    if (Config.ENVIRONMENT !== 'production') {
      console.log(
        'Access token registered in Cookie' + getCookie('supabase.auth.token'),
      );
    }
  } else {
    deleteCookie('supabase.auth.token', {
      path: '/',
    });

    if (Config.ENVIRONMENT !== 'production') {
      console.log(
        'Access token removed from Cookie' + getCookie('supabase.auth.token'),
      );
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
