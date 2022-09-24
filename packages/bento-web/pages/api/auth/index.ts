import { Supabase } from '@bento/client/utils';
import { NextApiResponse } from 'next';

export default function handler(
  req: { method: 'GET' | 'POST' },
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    Supabase.auth.api.setAuthCookie(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({
      message: `Method ${req.method} not allowed`,
    });
  }
}
