// scripts/validate-schema.js (plain JavaScript)
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Helper to load from all possible env files
function loadEnvFiles() {
  const envFiles = ['.env', '.env.local', '.env.development', '.env.development.local'];
  
  for (const file of envFiles) {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`Loading environment from ${file}`);
      require('dotenv').config({ path: filePath });
    }
  }
}

// Try to load from all possible env files
loadEnvFiles();

// Add debugging to see if environment variables are loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  if (!supabaseUrl) console.error('- NEXT_PUBLIC_SUPABASE_URL is not set');
  if (!supabaseServiceKey) console.error('- SUPABASE_SERVICE_ROLE_KEY is not set');
  console.error('\nPlease ensure these are set in your .env.local file or environment.');
  console.error('Current environment files checked: .env, .env.local, .env.development, .env.development.local');
  process.exit(1);
}

async function validateSchema() {
  console.log('Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log('Validating database schema...');
  
  try {
    // Use a direct SQL query to get the table names
    const { data, error } = await supabase.from('projects').select('id').limit(1);
    
    // First, just check if we can connect and query
    if (error) {
      console.error('Error connecting to database:', error);
      process.exit(1);
    }
    
    console.log('Successfully connected to database.');
    
    // Query each table to check if it exists
    const expectedTables = [
      'projects', 'assets', 'practice_sessions', 
      'users', 'tasks', 'folders'
    ];
    
    const tableCheckPromises = expectedTables.map(async tableName => {
      const { error } = await supabase.from(tableName).select('id').limit(1);
      return { 
        tableName, 
        exists: !error, 
        error: error ? error.message : null 
      };
    });
    
    const tableResults = await Promise.all(tableCheckPromises);
    
    // Show results
    console.log('\nTable Validation Results:');
    console.log('------------------------');
    
    let hasErrors = false;
    tableResults.forEach(result => {
      const statusSymbol = result.exists ? '✅' : '❌';
      console.log(`${statusSymbol} ${result.tableName}`);
      
      if (!result.exists) {
        hasErrors = true;
        console.log(`   Error: ${result.error}`);
      }
    });
    
    if (hasErrors) {
      console.error('\nSome tables are missing. Run migrations to create these tables.');
      process.exit(1);
    } else {
      console.log('\n✅ All expected tables exist');
    }
    
  } catch (err) {
    console.error('Unexpected error during validation:', err);
    process.exit(1);
  }
}

validateSchema().catch(err => {
  console.error('Validation failed:', err);
  process.exit(1);
});