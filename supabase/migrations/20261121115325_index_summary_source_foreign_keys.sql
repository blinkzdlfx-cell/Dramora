-- Cover the complete composite foreign keys on the provenance tables.
-- The primary keys begin with summary_id but do not cover all scoped FK columns.
create index if not exists conversation_summary_sources_summary_scope_idx
  on public.conversation_summary_sources (summary_id, conversation_id, owner_id);

create index if not exists project_context_summary_sources_summary_scope_idx
  on public.project_context_summary_sources (summary_id, project_id, owner_id);
