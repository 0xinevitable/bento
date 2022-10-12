import { NextApiRequest, NextApiResponse } from 'next';

import { ServerSupabase as Supabase } from '@/utils/ServerSupabase';
import { withCORS } from '@/utils/middlewares/withCORS';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const cookie = Supabase.auth.api.getAuthCookieString(req, res);
    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ message: 'ok' });
  } else {
    res.status(405).json({
      message: `Method ${req.method} not allowed`,
    });
  }
};

export default withCORS(handler);
