import { createClient } from '@supabase/supabase-js';

const SUPABASE_ANON_KEY = '';
const SUPABASE_URL = '';

export const Supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const main = async () => {
  const walletQuery = await Supabase.from('wallets').select('*');
  const wallets = walletQuery.data ?? [];

  const res = await Promise.all(
    wallets.map(async (item) => {
      console.log({ item });
      if (item.networks.includes('cosmos')) {
        try {
          const res = await Supabase.from('wallets')
            .update({
              ...item,
              networks: item.networks.map((v: string) =>
                v === 'cosmos' ? 'cosmos-hub' : v,
              ),
            })
            .eq('id', item.id);
          return res;
        } catch (e) {
          console.log(e, item);
        }
      }
    }),
  );
  console.log(res);
};

main();
