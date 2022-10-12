import { createClient } from 'redis';

export const createRedisClient = () => {
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  return redisClient;
};
