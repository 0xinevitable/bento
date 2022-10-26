import { createClient } from '@supabase/supabase-js';

import { Config } from './Config';

export const Supabase = createClient(
  Config.SUPABASE_URL,
  Config.SUPABASE_ANON_KEY,
);
