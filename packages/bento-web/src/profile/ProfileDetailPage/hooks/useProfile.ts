import { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { useSession } from '@/hooks/useSession';
import { UserProfile } from '@/profile/types/UserProfile';
import { profileAtom } from '@/recoil/profile';
import { Supabase } from '@/utils/Supabase';

export const useProfile: () => {
  profile: UserProfile | null;
  revaildateProfile: () => Promise<void>;
} = () => {
  const { session } = useSession();
  const [profile, setProfile] = useRecoilState(profileAtom);

  const revaildateProfile = useCallback(async () => {
    if (!session || !session.user) {
      setProfile(null);
      return;
    }

    const profileQuery = await Supabase.from('profile')
      .select('*')
      .eq('user_id', session.user.id);
    const profiles: UserProfile[] = profileQuery.data ?? [];

    if (profiles.length === 0) {
      setProfile(null);
    } else {
      const firstProfile = profiles[0];
      setProfile(firstProfile);
    }
  }, [JSON.stringify(session), setProfile]);

  useEffect(() => {
    revaildateProfile();
  }, [revaildateProfile]);

  return { profile, revaildateProfile };
};
