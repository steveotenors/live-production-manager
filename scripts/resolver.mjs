// scripts/resolver.mjs
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { SCHEMA, generateTableCreationSQL, generateRLSPolicy } from '../src/schema/supabase-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Re-export 
export { SCHEMA, generateTableCreationSQL, generateRLSPolicy };