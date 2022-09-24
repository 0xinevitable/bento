import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const MINUTES = 60 * 1000;
const CACHE_TIME = 1 * MINUTES;

export const cachedAxios = setupCache(Axios, {
  ttl: CACHE_TIME,
});
