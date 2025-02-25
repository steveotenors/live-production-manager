// scripts/validate-schema.ts
import { createClient } from '@supabase/supabase-js';
import { SCHEMA } from '../src/schema/supabase-schema';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';  // Requires service key for schema info

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to validate schema
async function validateSchema() {
  console.log('Validating Supabase schema against application schema definition...');
  
  // Get existing tables
  const { data: tableData, error: tableError } = await supabase
    .from('pg_catalog.pg_tables')
    .select('tablename')
    .eq('schemaname', 'public');

  if (tableError) {
    console.error('Error fetching tables:', tableError);
    return;
  }

  const existingTables = (tableData || []).map(t => t.tablename);
  console.log('Existing tables in Supabase:', existingTables.join(', '));

  // Compare with schema definition
  const definedTables = Object.keys(SCHEMA.tables);
  console.log('Tables defined in schema:', definedTables.join(', '));
  
  // Find missing tables
  const missingTables = definedTables.filter(t => !existingTables.includes(t));
  
  if (missingTables.length > 0) {
    console.log('\n🔴 Missing tables in Supabase:');
    
    // Generate SQL for missing tables
    const migrationSQL = missingTables.map(tableName => {
      console.log(`  - ${tableName}`);
      return SCHEMA.generateTableCreationSQL(tableName) + SCHEMA.generateRLSPolicy(tableName);
    }).join('\n');
    
    // Save SQL to migration file
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
    const migrationDir = path.join(process.cwd(), 'migrations');
    
    if (!fs.existsSync(migrationDir)) {
      fs.mkdirSync(migrationDir, { recursive: true });
    }
    
    const migrationFile = path.join(migrationDir, `${timestamp}_add_missing_tables.sql`);
    fs.writeFileSync(migrationFile, migrationSQL);
    
    console.log(`\nSQL migration generated: ${migrationFile}`);
    console.log('You can run this SQL in the Supabase SQL Editor to create the missing tables.');
  } else {
    console.log('\n✅ All tables from schema definition exist in Supabase');
  }

  // Validate JSON structures if needed
  console.log('\nValidating JSON field structures...');
  
  for (const tableName of definedTables) {
    if (!existingTables.includes(tableName)) continue;
    
    const tableSchema = SCHEMA.tables[tableName as keyof typeof SCHEMA.tables];
    if (!tableSchema.jsonFields) continue;
    
    console.log(`\nChecking JSON fields for ${tableName}:`);
    
    // Sample a record
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
      
    if (error) {
      console.log(`  Error fetching data from ${tableName}:`, error.message);
      continue;
    }
    
    if (!data || data.length === 0) {
      console.log(`  No records found in ${tableName} to validate JSON structure`);
      continue;
    }
    
    const record = data[0];
    
    for (const [fieldName, expectedStructure] of Object.entries(tableSchema.jsonFields)) {
      console.log(`  - ${fieldName}:`);
      
      if (record[fieldName]) {
        console.log(`    Current structure: ${JSON.stringify(record[fieldName], null, 2)}`);
      } else {
        console.log(`    Field exists but no data or is null`);
      }
    }
  }
  
  console.log('\nSchema validation complete');
}

// Execute validation
validateSchema().catch(err => {
  console.error('Validation failed:', err);
  process.exit(1);
});