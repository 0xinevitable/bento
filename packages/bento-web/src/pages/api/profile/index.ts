import { PostgrestError } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { UserProfile } from '@/profile/types/UserProfile';
import { Supabase } from '@/utils/Supabase';

type APIRequest = NextApiRequest & {
  body: UserProfile;
};

export default async (req: APIRequest, res: NextApiResponse) => {
  const { ...Profile } = req.body;

  const { user } = await Supabase.auth.api.getUserByCookie(req);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const prevProfileQuery = await Supabase.from('profile') //
    .select('id')
    .eq('user_id', user.id);
  const previousNetworks = prevProfileQuery.data ?? [];
  if (previousNetworks.length <= 0) {
    const data = await Supabase.from('profile').upsert({
      user_id: user.id,
      ...Profile,
    });
    return res.status(200).json(data);
  }

  const update = await Supabase.from('profile')
    .update({
      user_id: user.id,
      ...Profile,
    })
    .eq('id', user.id);
  return res.status(200).json(update);
};
