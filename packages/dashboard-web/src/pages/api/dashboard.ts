import { main } from '@dashboard/core';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  const result = await main();
  res.status(200).json(result);
};
