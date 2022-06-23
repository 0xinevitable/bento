import secrets from './secrets.json';

type Secrets = typeof secrets;
export const Config: Secrets = secrets;

export const randomOf = (items: string[]) =>
  items[Math.floor(Math.random() * items.length)];
