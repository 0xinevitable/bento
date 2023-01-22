import Axios from 'axios';

import { Config } from './Config';

export const axiosWithCredentials = Axios.create({
  baseURL: Config.SERVERLESS_API_BASE_URL || undefined,
  withCredentials: true,
});
