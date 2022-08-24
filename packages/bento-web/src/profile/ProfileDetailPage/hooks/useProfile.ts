import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { useSession } from '@/hooks/useSession';
import { UserProfile } from '@/profile/types/UserProfile';
import { profileAtom } from '@/recoil/profile';
import { Supabase } from '@/utils/Supabase';

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

    let query = Supabase.from('profile').select('*');

    if (!options || options.type === 'MY_PROFILE') {
      query = query.eq('user_id', session.user.id);
    } else {
      query = query.eq('username', options.preloadedProfile?.username);
    }

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
