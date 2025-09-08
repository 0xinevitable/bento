import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { sessionAtom } from '../states';
import { Analytics, toast } from '../utils';

export const SessionManager: React.FC = () => {
  const [currentSession, setCurrentSession] = useAtom(sessionAtom);

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