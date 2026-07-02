const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function testUpload() {
  // Test if we can upload a dummy file anonymously
  const file = new Blob(['test'], { type: 'text/plain' });
  const { data, error } = await supabase.storage
    .from('Interview_Resumes')
    .upload('test_upload.txt', file, { upsert: true });
    
  console.log("Upload result:", data, error);
}
testUpload();
