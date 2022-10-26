import { createClient } from '@supabase/supabase-js';

import { Config } from './Config';

export const getServerSupabase = () =>
  createClient(Config.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || '');
