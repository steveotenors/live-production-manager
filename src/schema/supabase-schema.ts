// src/schema/supabase-schema.ts
// This file serves as a central reference for your Supabase database schema

interface SchemaField {
    name: string;
    type: string;
    primaryKey?: boolean;
    nullable?: boolean;
    defaultValue?: string;
    references?: string;
  }  

export const SCHEMA = {
    tables: {
      projects: {
        name: 'projects',
        fields: [
          { name: 'id', type: 'integer', primaryKey: true }, // Changed to integer
          { name: 'name', type: 'text', nullable: false },
          { name: 'musical_director_id', type: 'uuid', nullable: true, references: 'users.id' },
          { name: 'composer_arranger', type: 'text', nullable: true },
          { name: 'piece_name', type: 'text', nullable: true },
          { name: 'version_number', type: 'text', nullable: true },
          { name: 'department', type: 'text', nullable: true },
          { name: 'order_index', type: 'integer', nullable: true },
          { name: 'owner', type: 'uuid', nullable: true, references: 'users.id' },
          { name: 'created_at', type: 'timestamp with time zone', defaultValue: 'now()', nullable: false },
          { name: 'updated_at', type: 'timestamp with time zone', defaultValue: 'now()', nullable: false },
          { name: 'metadata', type: 'jsonb', nullable: true }
        ],
        jsonFields: {
          metadata: {
            setlist: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  duration: { type: 'number' }
                }
              }
            },
            genre: { type: 'string' },
            tempo: { type: 'number' },
            key: { type: 'string' },
            instrumentation: { type: 'string' }
          }
        }
      },
      assets: {
        name: 'assets',
        fields: [
          { name: 'id', type: 'uuid', primaryKey: true, defaultValue: 'uuid_generate_v4()' },
          { name: 'name', type: 'text', nullable: false },
          { name: 'size', type: 'integer', nullable: false },
          { name: 'type', type: 'text', nullable: false },
          { name: 'storage_path', type: 'text', nullable: false },
          { name: 'project_id', type: 'integer', nullable: true, references: 'projects.id' }, // Changed to integer
          { name: 'folder_id', type: 'uuid', nullable: true, references: 'folders.id' },
          { name: 'created_at', type: 'timestamp with time zone', defaultValue: 'now()', nullable: false },
          { name: 'department', type: 'text', nullable: true },
          { name: 'file_type', type: 'text', nullable: true },
          { name: 'version', type: 'text', nullable: true },
          { name: 'waveform_length', type: 'text', nullable: true },
          { name: 'metadata', type: 'jsonb', nullable: true }
        ],
        jsonFields: {
          metadata: {
            song: { type: 'string' },
            tempo: { type: 'number' },
            key: { type: 'string' },
            instrumentation: { type: 'string' }
          }
        }
      },
      practice_sessions: {
        name: 'practice_sessions',
        fields: [
          { name: 'id', type: 'uuid', primaryKey: true, defaultValue: 'uuid_generate_v4()' },
          { name: 'name', type: 'text', nullable: false },
          { name: 'project_id', type: 'integer', nullable: true, references: 'projects.id' }, // Changed to integer
          { name: 'created_at', type: 'timestamp with time zone', defaultValue: 'now()', nullable: false },
          { name: 'updated_at', type: 'timestamp with time zone', defaultValue: 'now()', nullable: false },
          { name: 'department', type: 'text', nullable: true },
          { name: 'metadata', type: 'jsonb', nullable: true }
        ],
        jsonFields: {
          metadata: {
            tempo: { type: 'number' },
            notes: { type: 'string' },
            difficulty: { type: 'string' }
          }
        }
      },
      users: {
        name: 'users',
        fields: [
          { name: 'id', type: 'uuid', primaryKey: true },
          { name: 'email', type: 'text', nullable: false },
          { name: 'full_name', type: 'text', nullable: true },
          { name: 'role', type: 'text', nullable: false },
          { name: 'department', type: 'text', nullable: false }
        ],
        jsonFields: {}
      },
      tasks: {
        name: 'tasks',
        fields: [
          { name: 'id', type: 'uuid', primaryKey: true, defaultValue: 'uuid_generate_v4()' },
          { name: 'description', type: 'text', nullable: false },
          { name: 'project_id', type: 'integer', nullable: true, references: 'projects.id' }, // Changed to integer
          { name: 'user_id', type: 'uuid', nullable: true, references: 'users.id' },
          { name: 'status', type: 'text', nullable: true, defaultValue: "'pending'" },
          { name: 'due_date', type: 'timestamp with time zone', nullable: true },
          { name: 'department', type: 'text', nullable: true },
          { name: 'created_at', type: 'timestamp with time zone', defaultValue: 'now()', nullable: false }
        ],
        jsonFields: {}
      },
      folders: {
        name: 'folders',
        fields: [
          { name: 'id', type: 'uuid', primaryKey: true, defaultValue: 'uuid_generate_v4()' },
          { name: 'name', type: 'text', nullable: false },
          { name: 'project_id', type: 'integer', nullable: true, references: 'projects.id' }, // Changed to integer
          { name: 'path', type: 'text[]', nullable: true },
          { name: 'created_at', type: 'timestamp with time zone', defaultValue: 'now()', nullable: false }
        ],
        jsonFields: {}
      }
    }
  };
  
  // Helper function to generate SQL for table creation
  export function generateTableCreationSQL(tableName: string): string {
    const table = SCHEMA.tables[tableName as keyof typeof SCHEMA.tables];
    if (!table) return '';
  
    const fields = table.fields.map((field: SchemaField) => {
      let sql = `"${field.name}" ${field.type}`;
      
      if (field.primaryKey) {
        sql += ' PRIMARY KEY';
      }
      
      if (field.nullable === false) {
        sql += ' NOT NULL';
      }
      
      if (field.defaultValue) {
        sql += ` DEFAULT ${field.defaultValue}`;
      }
      
      if (field.references) {
        sql += ` REFERENCES ${field.references}`;
      }
      
      return sql;
    }).join(',\n  ');
  
    return `
  CREATE TABLE IF NOT EXISTS "${table.name}" (
    ${fields}
  );
  `;
  }
  
  // Helper function to add RLS policies
  export function generateRLSPolicy(tableName: string): string {
    return `
  -- Enable Row Level Security
  ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY;
  
  -- Create policy for authenticated users
  CREATE POLICY "Musical directors can access their ${tableName}"
    ON "${tableName}"
    FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' = 'musical_director');
  `;
  }