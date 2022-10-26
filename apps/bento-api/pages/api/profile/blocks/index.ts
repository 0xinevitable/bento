import type { NextApiRequest, NextApiResponse } from 'next';

import { ServerSupabase as Supabase } from '@/utils/ServerSupabase';
import { withCORS } from '@/utils/middlewares/withCORS';

import { Block } from '@/profile/blocks';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = (req.headers['x-supabase-auth'] as string) || '';
  const { user } = await Supabase.auth.api.getUser(accessToken);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const identities = user.identities;

  const blocks: Block[] = [];
  identities?.forEach((loginIdentity) => {
    const provider = loginIdentity.provider;
    const username =
      (loginIdentity.identity_data.user_name as string | undefined) ||
      (user.user_metadata.user_name as string | undefined);

    if (provider && username) {
      let title = '';
      let url = '';

      if (provider === 'github') {
        title = 'GitHub';
        url = `https://github.com/${username}`;
      }
      if (provider === 'twitter') {
        title = 'Twitter';
        url = `https://twitter.com/${username}`;
      }

      const description = `@${username}`;

      blocks.push({ type: 'link', title, description, url });
    }
  });
  return res.status(200).json(blocks);
};

export default withCORS(handler);
