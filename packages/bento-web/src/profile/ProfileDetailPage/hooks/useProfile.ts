import { useCallback, useEffect, useState } from 'react';

import { useSession } from '@/hooks/useSession';
import { UserProfile } from '@/profile/types/UserProfile';
import { Supabase } from '@/utils/Supabase';

const defaultProfile: UserProfile = {
  username: '',
  display_name: '',
  images: [],
  verified: false,
  bio: '',
  tabs: [],
  links: [],
};

export const useProfile: () => [
  UserProfile | undefined,
  () => Promise<UserProfile | undefined>,
] = () => {
  const { session } = useSession();
  const [profile, setProfile] = useState<UserProfile>();

  const revaildateProfile = useCallback(async () => {
    if (!session || !session.user) {
      setProfile(defaultProfile);
      return defaultProfile;
    }

    const profileQuery = await Supabase.from('profile')
      .select('*')
      .eq('user_id', session.user.id);
    const profiles: UserProfile[] = profileQuery.data ?? [];

    if (profiles.length == 1) {
      setProfile(profiles[0]);
    }

    return profiles[0];
  }, [session, setProfile]);

  useEffect(() => {
    revaildateProfile();
  }, []);

  return [profile, revaildateProfile];
};
