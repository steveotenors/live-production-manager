/**
 * Utility script to delete all test files from the Supabase storage.
 * Run with: npx tsx src/scripts/delete-test-files.ts
 */

import { deleteAllFiles } from '../lib/supabase-storage';

async function main() {
  console.log('Starting cleanup: Deleting all test files from storage...');
  
  try {
    await deleteAllFiles();
    console.log('All test files successfully deleted!');
  } catch (error) {
    console.error('Failed to delete test files:', error);
    process.exit(1);
  }
}

main(); 