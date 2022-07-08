import { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { UserProfile } from '@/profile/types/UserProfile';
import { Supabase } from '@/utils/Supabase';

type APIRequest = NextApiRequest & {
  body: UserProfile;
};

export default async (req: APIRequest, res: NextApiResponse) => {
  const { body: profile } = req;

  const { user } = await Supabase.auth.api.getUserByCookie(req);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const prevProfileQuery = await Supabase.from('profile') //
    .select('id')
    .eq('user_id', user.id);
  const previousProfiles = prevProfileQuery.data ?? [];
  const hasProfile = previousProfiles.length > 0;

  let data: PostgrestResponse<any>;
  let error: PostgrestError | null = null;

  if (!hasProfile) {
    data = await Supabase.from('profile').upsert({
      user_id: user.id,
      ...profile,
    });
    error = data.error;
  } else {
    data = await Supabase.from('profile')
      .update({
        user_id: user.id,
        ...profile,
      })
      .eq('id', user.id);
    error = data.error;
  }

  if (!!error) {
    res.status(500).json({ message: error.message });
    return;
  }

  return res.status(200).json(data);
};
