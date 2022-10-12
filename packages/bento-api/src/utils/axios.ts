import Axios from 'axios';

import { Config } from './Config';

export const axios = Axios.create({
  baseURL: Config.MAIN_API_BASE_URL || undefined,
});
