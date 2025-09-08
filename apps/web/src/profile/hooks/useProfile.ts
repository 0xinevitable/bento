import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import { useSession } from '@/hooks/useSession';

import { profileAtom } from '../states';
import { UserProfile } from '../types/UserProfile';

export type ProfileOptions = {
  type: 'MY_PROFILE' | 'USER_PROFILE';
  preloadedProfile?: UserProfile | null;
};

export const useProfile: (options: ProfileOptions) => {
  profile: UserProfile | null;
  revalidateProfile: () => Promise<void>;
} = (options) => {
  const { session } = useSession();
  const [profile, setProfile] = useAtom(profileAtom);

  const revalidateProfile = useCallback(async () => {
    if (
      !session ||
      !session.user ||
      (options.type === 'USER_PROFILE' && !options.preloadedProfile)
    ) {
      setProfile(null);
      return;
    }

    // Profile fetching removed - would need to implement via API
    // For now just use the preloaded profile if available
    if (options.preloadedProfile) {
      setProfile(options.preloadedProfile);
    } else {
      setProfile(null);
    }
  }, [JSON.stringify(session), JSON.stringify(options), setProfile]);

  useEffect(() => {
    revalidateProfile();
  }, [revalidateProfile]);

  return {
    profile: profile || (options.preloadedProfile ?? null),
    revalidateProfile,
  };
};