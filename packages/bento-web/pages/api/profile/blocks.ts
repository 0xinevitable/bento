import type { NextApiRequest, NextApiResponse } from 'next';

import { Block } from '@/profile/blocks';
import { Supabase } from '@/utils';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = await Supabase.auth.api.getUserByCookie(req);
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
