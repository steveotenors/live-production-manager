# Database Schema Management Workflow

This document outlines the workflow for maintaining the alignment between our code and the Supabase database schema.

## Core Components

1. **Schema Definition File**: `src/schema/supabase-schema.ts`
   - Single source of truth for our database schema
   - Documents all tables, columns, and JSON structures

2. **Schema Validation Script**: `scripts/validate-schema.ts`
   - Validates the Supabase database against our schema definition
   - Generates migration SQL for missing tables

3. **Type Generation**: `npm run generate-types`
   - Updates TypeScript types based on the current Supabase schema

## Workflow

### When Making Code Changes

1. **Update the Schema Definition**
   - When adding new tables or fields in your code, also update `src/schema/supabase-schema.ts`
   - This ensures our schema definition stays in sync with code requirements

2. **Validate the Schema**
   - Run `npm run validate-schema`
   - Review any discrepancies between the schema definition and Supabase

3. **Apply Database Changes**
   - If validation generates a migration file, run the SQL in Supabase's SQL Editor
   - Or use `npx supabase migration new add_my_changes` to create a migration file manually

4. **Update TypeScript Types**
   - After schema changes are applied, run `npm run generate-types`
   - This ensures your TypeScript types match the updated database schema

### When Encountering TypeScript Errors

If you see TypeScript errors like:
- "Property 'x' does not exist on type 'y'"
- "Type '...' is not assignable to parameter of type '...'"

Follow these steps:

1. **Check the Schema Definition**
   - Verify that the field or structure exists in `src/schema/supabase-schema.ts`
   - If not, add it to reflect your code's requirements

2. **Validate the Schema**
   - Run `npm run validate-schema` to identify discrepancies

3. **Fix Database Structure**
   - Apply the generated SQL to add missing tables/columns
   - Or update your code to align with the existing database structure

4. **Regenerate Types**
   - Run `npm run generate-types` to update TypeScript definitions

## JSON Fields Best Practices

For JSON fields like `metadata` in various tables:

1. **Always use safe access patterns**:
   ```typescript
   if (data?.metadata && typeof data.metadata === 'object' && 'setlist' in data.metadata) {
     // Now it's safe to access data.metadata.setlist
   }
   ```

2. **Initialize JSON fields in the database**:
   ```sql
   UPDATE "projects"
   SET "metadata" = '{}'::jsonb
   WHERE "metadata" IS NULL;
   ```

3. **Define type guards for runtime validation**:
   ```typescript
   function isValidSong(obj: any): obj is Song {
     return (
       typeof obj === 'object' &&
       typeof obj.id === 'string' &&
       typeof obj.name === 'string' &&
       typeof obj.duration === 'number'
     );
   }
   ```

## Handling Required Changes

Based on your current database shown in the screenshots, you need to:

1. **Create a tasks table**
   - Required by the ProjectTodos component
   - SQL is provided in migrations/create_missing_tables.sql

2. **Update JSON field structures**
   - Ensure projects.metadata has a setlist array
   - Ensure assets.metadata has a song property