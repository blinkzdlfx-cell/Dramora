-- Durable server-owned task state and versioned context summaries.
-- Browser roles may read their own records and submit task-control requests;
-- orchestration workers own task transitions, events and summary generation.

alter table public.conversations
  add constraint conversations_id_owner_project_unique
  unique (id, owner_id, project_id);

alter table public.messages
  add constraint messages_id_conversation_owner_unique
  unique (id, conversation_id, owner_id);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid not null,
  conversation_id uuid,
  task_type text not null,
  status text not null default 'queued',
  mode text not null default 'balanced',
  input jsonb not null default '{}'::jsonb,
  checkpoint jsonb not null default '{}'::jsonb,
  result jsonb,
  error jsonb,
  retry_count integer not null default 0,
  max_retries integer not null default 3,
  approval_required boolean not null default false,
  stop_requested_at timestamptz,
  idempotency_key uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  constraint tasks_type_length
    check (char_length(btrim(task_type)) between 1 and 120),
  constraint tasks_status_check
    check (status in ('queued', 'running', 'waiting_approval', 'paused', 'completed', 'failed', 'cancelled')),
  constraint tasks_mode_check
    check (mode in ('guided', 'balanced', 'autonomous')),
  constraint tasks_input_object_check
    check (jsonb_typeof(input) = 'object'),
  constraint tasks_checkpoint_object_check
    check (jsonb_typeof(checkpoint) = 'object'),
  constraint tasks_error_object_check
    check (error is null or jsonb_typeof(error) = 'object'),
  constraint tasks_retry_bounds_check
    check (retry_count >= 0 and max_retries >= 0),
  constraint tasks_project_owner_fkey
    foreign key (project_id, owner_id)
    references public.projects (id, owner_id)
    on delete cascade,
  constraint tasks_conversation_project_owner_fkey
    foreign key (conversation_id, owner_id, project_id)
    references public.conversations (id, owner_id, project_id)
    on delete cascade,
  constraint tasks_id_owner_unique unique (id, owner_id)
);

create unique index tasks_owner_idempotency_idx
  on public.tasks (owner_id, idempotency_key)
  where idempotency_key is not null;

create index tasks_owner_created_idx
  on public.tasks (owner_id, created_at desc);

create index tasks_project_created_idx
  on public.tasks (project_id, owner_id, created_at desc);

create index tasks_conversation_project_owner_created_idx
  on public.tasks (conversation_id, owner_id, project_id, created_at desc)
  where conversation_id is not null;

create index tasks_status_created_idx
  on public.tasks (status, created_at);

create table public.task_events (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null,
  owner_id uuid not null,
  sequence_number bigint not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint task_events_sequence_positive check (sequence_number > 0),
  constraint task_events_payload_object_check
    check (jsonb_typeof(payload) = 'object'),
  constraint task_events_task_sequence_unique
    unique (task_id, owner_id, sequence_number),
  constraint task_events_task_owner_fkey
    foreign key (task_id, owner_id)
    references public.tasks (id, owner_id)
    on delete cascade
);

create index task_events_task_owner_sequence_idx
  on public.task_events (task_id, owner_id, sequence_number);

create table public.task_control_requests (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null,
  owner_id uuid not null,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  idempotency_key uuid,
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  outcome jsonb,
  constraint task_control_action_check
    check (action in ('stop', 'continue', 'retry', 'approve', 'reject')),
  constraint task_control_payload_object_check
    check (jsonb_typeof(payload) = 'object'),
  constraint task_control_outcome_object_check
    check (outcome is null or jsonb_typeof(outcome) = 'object'),
  constraint task_control_task_owner_fkey
    foreign key (task_id, owner_id)
    references public.tasks (id, owner_id)
    on delete cascade
);

create unique index task_control_idempotency_idx
  on public.task_control_requests (task_id, idempotency_key)
  where idempotency_key is not null;

create index task_control_task_owner_created_idx
  on public.task_control_requests (task_id, owner_id, created_at);

create index task_control_unprocessed_idx
  on public.task_control_requests (created_at)
  where processed_at is null;

create table public.conversation_summaries (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  owner_id uuid not null,
  version integer not null,
  summary_content jsonb not null,
  summary_text text not null,
  covered_message_count integer not null,
  token_estimate integer,
  covered_through_message_id uuid not null,
  status text not null default 'current',
  created_at timestamptz not null default now(),
  constraint conversation_summaries_version_positive check (version > 0),
  constraint conversation_summaries_content_object_check
    check (jsonb_typeof(summary_content) = 'object'),
  constraint conversation_summaries_text_nonempty
    check (char_length(btrim(summary_text)) > 0),
  constraint conversation_summaries_covered_count_positive
    check (covered_message_count > 0),
  constraint conversation_summaries_token_estimate_nonnegative
    check (token_estimate is null or token_estimate >= 0),
  constraint conversation_summaries_status_check
    check (status in ('current', 'superseded')),
  constraint conversation_summaries_conversation_owner_fkey
    foreign key (conversation_id, owner_id)
    references public.conversations (id, owner_id)
    on delete cascade,
  constraint conversation_summaries_covered_message_fkey
    foreign key (covered_through_message_id, conversation_id, owner_id)
    references public.messages (id, conversation_id, owner_id)
    on delete cascade,
  constraint conversation_summaries_version_unique
    unique (conversation_id, owner_id, version),
  constraint conversation_summaries_id_scope_unique
    unique (id, conversation_id, owner_id)
);

create unique index conversation_summaries_one_current_idx
  on public.conversation_summaries (conversation_id, owner_id)
  where status = 'current';

create index conversation_summaries_covered_message_idx
  on public.conversation_summaries (covered_through_message_id, conversation_id, owner_id);

create table public.conversation_summary_sources (
  summary_id uuid not null,
  conversation_id uuid not null,
  owner_id uuid not null,
  message_id uuid not null,
  source_order integer not null,
  constraint conversation_summary_sources_order_positive
    check (source_order > 0),
  constraint conversation_summary_sources_pk
    primary key (summary_id, message_id),
  constraint conversation_summary_sources_order_unique
    unique (summary_id, source_order),
  constraint conversation_summary_sources_summary_fkey
    foreign key (summary_id, conversation_id, owner_id)
    references public.conversation_summaries (id, conversation_id, owner_id)
    on delete cascade,
  constraint conversation_summary_sources_message_fkey
    foreign key (message_id, conversation_id, owner_id)
    references public.messages (id, conversation_id, owner_id)
    on delete cascade
);

create index conversation_summary_sources_message_idx
  on public.conversation_summary_sources (message_id, conversation_id, owner_id);

create table public.project_context_summaries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  owner_id uuid not null,
  version integer not null,
  summary_content jsonb not null,
  summary_text text not null,
  source_conversation_count integer not null default 0,
  token_estimate integer,
  status text not null default 'current',
  created_at timestamptz not null default now(),
  constraint project_context_summaries_version_positive check (version > 0),
  constraint project_context_summaries_content_object_check
    check (jsonb_typeof(summary_content) = 'object'),
  constraint project_context_summaries_text_nonempty
    check (char_length(btrim(summary_text)) > 0),
  constraint project_context_summaries_source_count_nonnegative
    check (source_conversation_count >= 0),
  constraint project_context_summaries_token_estimate_nonnegative
    check (token_estimate is null or token_estimate >= 0),
  constraint project_context_summaries_status_check
    check (status in ('current', 'superseded')),
  constraint project_context_summaries_project_owner_fkey
    foreign key (project_id, owner_id)
    references public.projects (id, owner_id)
    on delete cascade,
  constraint project_context_summaries_version_unique
    unique (project_id, owner_id, version),
  constraint project_context_summaries_id_scope_unique
    unique (id, project_id, owner_id)
);

create unique index project_context_summaries_one_current_idx
  on public.project_context_summaries (project_id, owner_id)
  where status = 'current';

create table public.project_context_summary_sources (
  summary_id uuid not null,
  project_id uuid not null,
  owner_id uuid not null,
  conversation_id uuid not null,
  source_order integer not null,
  constraint project_context_summary_sources_order_positive
    check (source_order > 0),
  constraint project_context_summary_sources_pk
    primary key (summary_id, conversation_id),
  constraint project_context_summary_sources_order_unique
    unique (summary_id, source_order),
  constraint project_context_summary_sources_summary_fkey
    foreign key (summary_id, project_id, owner_id)
    references public.project_context_summaries (id, project_id, owner_id)
    on delete cascade,
  constraint project_context_summary_sources_conversation_fkey
    foreign key (conversation_id, owner_id, project_id)
    references public.conversations (id, owner_id, project_id)
    on delete cascade
);

create index project_context_summary_sources_conversation_idx
  on public.project_context_summary_sources (conversation_id, owner_id, project_id);

create index project_context_summaries_project_version_idx
  on public.project_context_summaries (project_id, owner_id, version desc);

alter table public.tasks enable row level security;
alter table public.task_events enable row level security;
alter table public.task_control_requests enable row level security;
alter table public.conversation_summaries enable row level security;
alter table public.conversation_summary_sources enable row level security;
alter table public.project_context_summaries enable row level security;
alter table public.project_context_summary_sources enable row level security;

revoke all on table
  public.tasks,
  public.task_events,
  public.task_control_requests,
  public.conversation_summaries,
  public.conversation_summary_sources,
  public.project_context_summaries,
  public.project_context_summary_sources
from public, anon, authenticated;

grant usage on schema public to authenticated;
grant select on table
  public.tasks,
  public.task_events,
  public.task_control_requests,
  public.conversation_summaries,
  public.conversation_summary_sources,
  public.project_context_summaries,
  public.project_context_summary_sources
to authenticated;

grant insert (task_id, owner_id, action, payload, idempotency_key)
  on table public.task_control_requests to authenticated;

create policy "tasks_select_own"
  on public.tasks
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "task_events_select_own"
  on public.task_events
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "task_control_requests_select_own"
  on public.task_control_requests
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "task_control_requests_insert_own"
  on public.task_control_requests
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "conversation_summaries_select_own"
  on public.conversation_summaries
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "conversation_summary_sources_select_own"
  on public.conversation_summary_sources
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "project_context_summaries_select_own"
  on public.project_context_summaries
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "project_context_summary_sources_select_own"
  on public.project_context_summary_sources
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

comment on table public.tasks is
  'Durable server-owned execution state. Browser users may read their own tasks and submit control requests but cannot mutate task state.';
comment on table public.task_events is
  'Append-only server-owned task event/checkpoint history, readable only by the owning user.';
comment on table public.task_control_requests is
  'User-issued stop/continue/retry/approval requests. A trusted worker validates and processes each request.';
comment on table public.conversation_summaries is
  'Versioned derived conversation context. Original messages remain the source of truth.';
comment on table public.conversation_summary_sources is
  'Exact message provenance for each versioned conversation summary.';
comment on table public.project_context_summaries is
  'Versioned derived project-level context. Structured Project Bible records remain canonical.';
comment on table public.project_context_summary_sources is
  'Conversation provenance for each versioned project-context summary.';
