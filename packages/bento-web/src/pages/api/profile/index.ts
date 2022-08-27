import { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { UserProfile } from '@/profile/types/UserProfile';
import { Supabase } from '@/utils/Supabase';

const MATCH_RULE = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,37}$/;

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

  if (!profile.username) {
    res.status(400).json({
      code: 'VALUE_REQUIRED',
      message: 'Username is required',
    });
    return;
  }

  if (profile.username.length > 38) {
    res.status(400).json({
      code: 'USERNAME_UNUSABLE',
      message: `Username can't be longer than 38 characters`,
    });
  }
  const matches = MATCH_RULE.exec(profile.username);
  if (!matches?.length) {
    res.status(400).json({
      code: 'USERNAME_UNUSABLE',
      message: `Username contains invalid characters`,
    });
  }

  if (!profile.display_name) {
    res.status(400).json({
      code: 'VALUE_REQUIRED',
      message: 'Display name is required',
    });
    return;
  }

  const prevProfileQuery = await Supabase.from('profile') //
    .select('*')
    .eq('user_id', user.id);
  const previousProfiles = prevProfileQuery.data ?? [];
  const hasProfile = previousProfiles.length > 0;

  let data: PostgrestResponse<any>;
  let error: PostgrestError | null = null;

  // check for duplicated username here
  const duplicatedUsernameQuery = await Supabase.from('profile') //
    .select('*')
    .eq('username', profile.username);
  const [profileWithDuplicatedUsername] = (duplicatedUsernameQuery.data ??
    []) as UserProfile[];
  if (
    !!profileWithDuplicatedUsername &&
    profileWithDuplicatedUsername.user_id !== user.id
  ) {
    res.status(400).json({
      code: 'USERNAME_UNUSABLE',
      message: `Username '${profile.username}' already exists`,
    });
    return;
  }

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
      .eq('user_id', user.id);
    error = data.error;
  }

  if (!!error) {
    res.status(500).json({ message: error.message });
    return;
  }

  return res.status(200).json(data);
};
