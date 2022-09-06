import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { useSession } from '@/hooks/useSession';
import { profileAtom } from '@/recoil/profile';
import { Supabase } from '@/utils/Supabase';

import { UserProfile } from '@/profile/types/UserProfile';

export type ProfileOptions = {
  type: 'MY_PROFILE' | 'USER_PROFILE';
  preloadedProfile?: UserProfile | null;
};

export const useProfile: (options?: ProfileOptions) => {
  profile: UserProfile | null;
  revaildateProfile: () => Promise<void>;
} = (options) => {
  const { session } = useSession();
  const [profile, setProfile] = useRecoilState(profileAtom);

  const revaildateProfile = useCallback(async () => {
    if (
      !session ||
      !session.user ||
      (options?.type === 'USER_PROFILE' && !options?.preloadedProfile)
    ) {
      setProfile(null);
      return;
    }

    const userId =
      !options || options.type === 'MY_PROFILE'
        ? session.user.id
        : options.preloadedProfile?.user_id;
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
    revaildateProfile();
  }, [revaildateProfile]);

  return {
    profile: profile || (options?.preloadedProfile ?? null),
    revaildateProfile,
  };
};
