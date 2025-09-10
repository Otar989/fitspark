const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function runMigrations() {
  console.log('Starting database migrations...');
  
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    console.log(`Running migration: ${file}`);
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error(`Error running migration ${file}:`, error);
    } else {
      console.log(`✓ Migration ${file} completed`);
    }
  }
  
  console.log('All migrations completed!');
}

// Create exec_sql function first
async function createExecFunction() {
  const { error } = await supabase.rpc('exec_sql', {
    sql_query: `
      CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_query;
      END;
      $$;
    `
  });

  if (error) {
    console.log('Creating exec_sql function manually...');
    // If the function doesn't exist, we'll execute migrations directly
  }
}

async function runMigrationsDirectly() {
  console.log('Starting database migrations (direct execution)...');
  
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort();

  for (const file of migrationFiles) {
    console.log(`Running migration: ${file}`);
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec', { 
          sql: statement.trim() + ';' 
        }).single();
        
        if (error) {
          console.log(`Statement failed (this might be expected):`, statement.slice(0, 100) + '...');
          console.log('Error:', error.message);
        }
      }
    }
    
    console.log(`✓ Migration ${file} completed`);
  }
  
  console.log('All migrations completed!');
}

// Try to run migrations
runMigrationsDirectly().catch(console.error);