import { useCallback, useEffect, useState } from 'react';

import { useSession } from '@/hooks/useSession';
import { UserProfile } from '@/profile/types/UserProfile';
import { Supabase } from '@/utils/Supabase';

export const useProfile: () => [
  UserProfile | null,
  () => Promise<UserProfile | null>,
] = () => {
  const { session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const revaildateProfile = useCallback(async () => {
    if (!session || !session.user) {
      setProfile(null);
      return null;
    }

    const profileQuery = await Supabase.from('profile')
      .select('*')
      .eq('user_id', session.user.id);
    const profiles: UserProfile[] = profileQuery.data ?? [];

    if (profiles.length === 0) {
      setProfile(null);
      return null;
    }
    const firstProfile = profiles[0];
    setProfile(firstProfile);
    return firstProfile;
  }, [session, setProfile]);

  useEffect(() => {
    revaildateProfile();
  }, [revaildateProfile]);

  return [profile, revaildateProfile];
};
