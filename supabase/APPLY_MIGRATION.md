# Apply Storage Bucket Migration

Since the Supabase CLI is having authentication issues, please apply the migration manually:

## Steps:

1. Go to https://supabase.com/dashboard/project/nhxyazfdliwxqzmmhgga/sql/new
2. Copy the contents of `supabase/migrations/20260120140000_setup_storage_bucket.sql`
3. Paste into the SQL Editor
4. Click "Run" to execute the migration

This migration will:
- Create the `manuals` storage bucket with 50MB file size limit
- Set up RLS policies for secure file access based on user roles
- Add RLS policies for the `manuals` table to match building access permissions

## Alternative: Using Supabase CLI

If you have Supabase CLI installed and authenticated:

```bash
npx supabase db push
```

This will push all pending migrations to your remote database.
