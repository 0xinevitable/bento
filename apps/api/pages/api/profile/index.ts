import { PostgrestError, PostgrestResponse, User } from '@supabase/supabase-js';
import { format } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ServerSupabase as Supabase } from '@/utils/ServerSupabase';
import { axios } from '@/utils/axios';
import { withCORS } from '@/utils/middlewares/withCORS';

import { UserProfile } from '@/profile/types/UserProfile';

const MATCH_RULE = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,37}$/;

type APIRequest = NextApiRequest & {
  body: UserProfile;
};

const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
const getKoreanTimestring = (timestamp: string) => {
  const curr = new Date(timestamp);
  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
  return format(new Date(utc + KR_TIME_DIFF), 'yyyy-MM-dd HH:mm:ss');
};

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const notifySlack = async (user: User, profile: UserProfile) => {
  if (!process.env.SLACK_NEW_PROFILE_WEBHOOK) {
    // disabled
    return;
  }
  const provider = user.app_metadata.provider;
  await axios
    .post(process.env.SLACK_NEW_PROFILE_WEBHOOK, {
      provider: capitalize(provider || 'none'),
      social_url: !provider
        ? 'No social link available'
        : provider === 'twitter'
        ? `https://twitter.com/${user.user_metadata.user_name}`
        : `https://github.com/${user.user_metadata.user_name}`,
      user_id: user.id,
      profile_url: `https://www.bento.finance/u/${profile.username}`,
      joined_at: getKoreanTimestring(user.created_at),
    })
    .catch((e) => {
      console.error('[Slack] Failed to send webhook', e);
    });
};

const handler = async (req: APIRequest, res: NextApiResponse) => {
  let { body: profile } = req;
  profile.username = (profile?.username || '').toLowerCase();

  const accessToken = (req.headers['x-supabase-auth'] as string) || '';
  const { user } = await Supabase.auth.api.getUser(accessToken);
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

  if (profile.username.length <= 4) {
    res.status(400).json({
      code: 'USERNAME_UNUSABLE',
      message: `Username is too short`,
    });
    return;
  }
  if (profile.username.length > 30) {
    res.status(400).json({
      code: 'USERNAME_UNUSABLE',
      message: `Username can't be longer than 30 characters`,
    });
    return;
  }
  const matches = MATCH_RULE.exec(profile.username);
  if (!matches?.length) {
    res.status(400).json({
      code: 'USERNAME_UNUSABLE',
      message: `Username contains invalid characters`,
    });
    return;
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

    await notifySlack(user, profile);
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

export default withCORS(handler);
