// proxy query params to card api(`${Config.MAIN_API_BASE_URL}/api/images/card)
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import queryString from 'query-string';

import { withCORS } from '@/utils/middlewares/withCORS';

import { Config } from '@/utils';

// and return the response
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req;
  const { data } = await axios.get(
    queryString.stringifyUrl({
      url: `${Config.MAIN_API_BASE_URL}/api/images/card`,
      query,
    }),
    { responseType: 'arraybuffer' },
  );
  res.status(200).send(data);
};

export default withCORS(handler);
