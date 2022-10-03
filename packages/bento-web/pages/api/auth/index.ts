import { NextApiRequest, NextApiResponse } from 'next';

import { withCORS } from '@/utils/middlewares/withCORS';

import { Supabase } from '@/utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    Supabase.auth.api.setAuthCookie(req, res);
    res.status(200).send(200);
  } else {
    res.status(405).json({
      message: `Method ${req.method} not allowed`,
    });
  }
};

export default withCORS(handler);
