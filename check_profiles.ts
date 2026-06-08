import { supabase } from './src/lib/supabase.ts';

async function check() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log('Profiles:', data);
  console.log('Error:', error);
}
check();
