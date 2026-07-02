const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function checkInterviews() {
  const { data, error } = await supabase
    .from('interviews')
    .select('id, video_url, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  console.log("Error:", error);
  console.log("Recent Interviews:", data);
}
checkInterviews();
