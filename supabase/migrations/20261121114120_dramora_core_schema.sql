-- Dramora's first application schema.
-- Supabase Auth owns identities; application rows are scoped to auth.uid().
-- New public tables are explicitly granted to authenticated only and protected by RLS.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_length
    check (display_name is null or char_length(btrim(display_name)) between 1 and 80)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  studio text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint projects_title_length
    check (char_length(btrim(title)) between 1 and 160),
  constraint projects_studio_check
    check (studio in ('ai_video', 'film')),
  constraint projects_status_check
    check (status in ('active', 'archived')),
  constraint projects_id_owner_unique unique (id, owner_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'New conversation',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz,
  constraint conversations_title_length
    check (char_length(btrim(title)) between 1 and 180),
  constraint conversations_status_check
    check (status in ('active', 'archived')),
  constraint conversations_project_owner_fkey
    foreign key (project_id, owner_id)
    references public.projects (id, owner_id)
    on delete cascade,
  constraint conversations_id_owner_unique unique (id, owner_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  owner_id uuid not null references auth.users (id) on delete cascade,
  role text not null,
  content jsonb not null,
  status text not null default 'complete',
  metadata jsonb not null default '{}'::jsonb,
  idempotency_key uuid,
  created_at timestamptz not null default now(),
  constraint messages_role_check
    check (role in ('user', 'assistant', 'tool')),
  constraint messages_content_shape_check
    check (jsonb_typeof(content) in ('array', 'object')),
  constraint messages_status_check
    check (status in ('pending', 'streaming', 'complete', 'failed', 'interrupted')),
  constraint messages_metadata_object_check
    check (jsonb_typeof(metadata) = 'object'),
  constraint messages_conversation_owner_fkey
    foreign key (conversation_id, owner_id)
    references public.conversations (id, owner_id)
    on delete cascade
);

create index projects_owner_updated_idx
  on public.projects (owner_id, updated_at desc);

create index conversations_project_updated_idx
  on public.conversations (project_id, updated_at desc);

create index conversations_owner_updated_idx
  on public.conversations (owner_id, updated_at desc);

create index messages_conversation_created_idx
  on public.messages (conversation_id, created_at, id);

create unique index messages_conversation_idempotency_idx
  on public.messages (conversation_id, idempotency_key)
  where idempotency_key is not null;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

revoke all on table public.profiles, public.projects, public.conversations, public.messages
  from public, anon;

grant usage on schema public to authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.projects to authenticated;
grant select, insert, update, delete on table public.conversations to authenticated;
grant select, insert on table public.messages to authenticated;

create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "projects_select_own"
  on public.projects
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "projects_insert_own"
  on public.projects
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "projects_update_own"
  on public.projects
  for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "projects_delete_own"
  on public.projects
  for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "conversations_select_own"
  on public.conversations
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "conversations_insert_own"
  on public.conversations
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "conversations_update_own"
  on public.conversations
  for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "conversations_delete_own"
  on public.conversations
  for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "messages_select_own"
  on public.messages
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

-- Browser clients may append user messages only. Assistant/tool messages are
-- written by trusted server-side orchestration after ownership validation.
create policy "messages_insert_own_user_message"
  on public.messages
  for insert
  to authenticated
  with check (
    (select auth.uid()) = owner_id
    and role = 'user'
  );

comment on table public.profiles is
  'Private account profile data. Authorization never depends on user-editable auth metadata.';
comment on table public.projects is
  'User-owned creative projects. The studio is ai_video or film.';
comment on table public.conversations is
  'Project-scoped conversations. Original messages remain persisted independently of context summaries.';
comment on table public.messages is
  'Append-oriented conversation history. Browser users may append their own user messages; trusted server code writes assistant/tool messages.';
