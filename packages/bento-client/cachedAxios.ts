import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

const MINUTES = 60 * 1000;
const CACHE_TIME = 1 * MINUTES;

const cache = setupCache({
  maxAge: CACHE_TIME,
});

export const cachedAxios = axios.create({
  adapter: cache.adapter,
});
