-- Fix "new row violates row-level security policy" for the current frontend.
-- Run this in Supabase SQL Editor if inserts fail with 403/RLS errors.
-- This is development-friendly. For production, replace with proper RLS policies.

do $$
declare
  table_record record;
begin
  for table_record in
    select schemaname, tablename
    from pg_tables
    where schemaname = 'public'
  loop
    execute format('alter table %I.%I disable row level security', table_record.schemaname, table_record.tablename);
    execute format('alter table %I.%I no force row level security', table_record.schemaname, table_record.tablename);
  end loop;
end $$;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;

