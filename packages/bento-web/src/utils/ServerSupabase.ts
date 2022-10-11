import { createClient } from '@supabase/supabase-js';

import { Config } from './Config';

export const ServerSupabase = createClient(
  Config.SUPABASE_URL,
  Config.SUPABASE_SERVICE_KEY,
);
