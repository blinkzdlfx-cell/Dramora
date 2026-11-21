-- Supabase's inherited public-schema defaults grant broad privileges to
-- anon/authenticated. Keep future application objects closed unless a migration
-- explicitly grants only the privileges they need.
alter default privileges for role postgres in schema public
  revoke all on tables from public, anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from public, anon, authenticated;
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

-- Existing tables were created before the default privileges were tightened.
-- Remove inherited grants first, then grant only the operations intended by RLS.
revoke all on table public.profiles, public.projects, public.conversations, public.messages
  from public, anon, authenticated;

grant usage on schema public to authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.projects to authenticated;
grant select, insert, update, delete on table public.conversations to authenticated;
grant select, insert on table public.messages to authenticated;

-- Cover composite ownership foreign keys so deletes/updates of parent rows do
-- not require full-table scans. Keep the owner-only index for auth.users FK checks.
create index if not exists conversations_project_owner_idx
  on public.conversations (project_id, owner_id);

create index if not exists messages_conversation_owner_idx
  on public.messages (conversation_id, owner_id);

create index if not exists messages_owner_idx
  on public.messages (owner_id);
