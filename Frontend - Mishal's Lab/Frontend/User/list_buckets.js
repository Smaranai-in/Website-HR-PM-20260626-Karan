const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function listBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  console.log("Buckets:", data.map(b => b.name));
  console.log("Error:", error);
}
listBuckets();
