// FIXME:
export interface GetCachedPrice {
  (coinGeckoIds: string[]): number[];
  (coinGeckoId: string): number;
}
export const useCachedPricings = () => ({
  getCachedPrice: ((v: any) => 0) as GetCachedPrice,
});
