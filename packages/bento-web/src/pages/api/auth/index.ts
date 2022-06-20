import { NextApiResponse } from 'next';

import { Supabase } from '@/utils/Supabase';

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
