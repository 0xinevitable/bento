import { NextApiRequest, NextApiResponse } from 'next';

import { ServerSupabase as Supabase } from '@/utils/ServerSupabase';
import { withCORS } from '@/utils/middlewares/withCORS';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    Supabase.auth.api.setAuthCookie(req, res);
  } else {
    res.status(405).json({
      message: `Method ${req.method} not allowed`,
    });
  }
};

export default withCORS(handler);
