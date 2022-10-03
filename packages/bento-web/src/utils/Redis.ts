import { Config } from '@bento/common';
import { createClient } from 'redis';

export const createRedisClient = () => {
  const redisClient = createClient({
    url: Config.REDIS_URL,
  });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  return redisClient;
};
