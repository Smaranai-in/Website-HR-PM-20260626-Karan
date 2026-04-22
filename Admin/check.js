const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uqkqewydjbqqiuezxnqk.supabase.co';
const supabaseKey = 'sb_publishable_ZPjIspJAXUtFxFBwrVvTKQ_k6RITrqo';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase
        .from('internship_applications')
        .select('*')
        .eq('current_status', 'Under Review');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log("current_status:", data[0].current_status);
    console.log("is_select:", data[0].is_select);
}

check();
