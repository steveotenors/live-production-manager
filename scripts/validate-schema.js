// scripts/validate-schema.js (plain JavaScript)
const { execSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

// Add debugging to see if environment variables are loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  if (!supabaseUrl) console.error('- NEXT_PUBLIC_SUPABASE_URL is not set');
  if (!supabaseServiceKey) console.error('- SUPABASE_SERVICE_ROLE_KEY is not set');
  console.error('\nPlease ensure these are set in your .env file or environment.');
  process.exit(1);
}

async function validateSchema() {
  console.log('Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log('Validating database schema...');
  
  try {
    // Get tables from Supabase
    const { data: tables, error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');
      
    if (error) {
      console.error('Error querying tables:', error);
      process.exit(1);
    }
    
    if (!tables || tables.length === 0) {
      console.warn('No tables found in the database. This might indicate a connection issue or an empty database.');
    }
    
    const existingTables = (tables || []).map(t => t.tablename);
    console.log('Tables in database:', existingTables.join(', ') || 'None');
    
    // Expected tables - hardcode or read from a config file
    const expectedTables = [
      'projects', 'assets', 'practice_sessions', 
      'users', 'tasks', 'folders'
    ];
    
    // Check for missing tables
    const missingTables = expectedTables.filter(t => !existingTables.includes(t));
    
    if (missingTables.length > 0) {
      console.error('Missing tables:', missingTables.join(', '));
      console.error('Run migrations to create these tables.');
      process.exit(1);
    }
    
    console.log('✅ All expected tables exist');
  } catch (err) {
    console.error('Unexpected error during validation:', err);
    process.exit(1);
  }
}

validateSchema().catch(err => {
  console.error('Validation failed:', err);
  process.exit(1);
});