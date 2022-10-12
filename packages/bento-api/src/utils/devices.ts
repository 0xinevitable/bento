export const isServer = (): boolean =>
  typeof window === 'undefined' && typeof global !== 'undefined';
