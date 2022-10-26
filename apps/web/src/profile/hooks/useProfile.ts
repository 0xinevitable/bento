import { useAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import { useSession } from '@/hooks/useSession';

import { Supabase } from '@/utils';

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

    const userId =
      options.type === 'MY_PROFILE'
        ? session.user.id
        : options.preloadedProfile?.user_id;
    if (!userId) {
      return;
    }
    const query = Supabase.from('profile') //
      .select('*')
      .eq('user_id', userId);

    const profileQueryResult = await query;
    const profiles: UserProfile[] = profileQueryResult.data ?? [];

    if (profiles.length === 0) {
      setProfile(null);
    } else {
      const firstProfile = profiles[0];
      setProfile(firstProfile);
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
