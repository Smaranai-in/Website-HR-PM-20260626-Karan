const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

async function testQuery() {
  console.log("Running simple query on w_leaves...");
  const { data, error } = await supabase
    .from('w_leaves')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Simple Query Error:", error);
  } else {
    console.log("Simple Query Success. Row count:", data.length);
  }

  console.log("Running join query on w_leaves & w_users...");
  const { data: dataJoin, error: errorJoin } = await supabase
    .from('w_leaves')
    .select('*, w_users:user_id(name, email)')
    .limit(1);

  if (errorJoin) {
    console.error("Join Query Error:", errorJoin);
  } else {
    console.log("Join Query Success:", dataJoin);
  }
}

testQuery();
