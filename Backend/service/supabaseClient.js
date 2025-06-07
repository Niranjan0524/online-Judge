const {createClient} = require('@supabase/supabase-js');

const supabaseUrl=process.env.SUPABASE_URL;
const supabaseKey=process.env.SUPABASE_KEY;

const supabaseClient=createClient(supabaseUrl, supabaseKey);

module.exports = supabaseClient;