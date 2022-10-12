import { createClient } from '@supabase/supabase-js';

import { Config } from './Config';

export const ServerSupabase = createClient(
  Config.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || '',
);
