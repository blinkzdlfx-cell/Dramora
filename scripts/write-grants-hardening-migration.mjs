import { readdir, writeFile } from "node:fs/promises";

const migrationDirectory = "supabase/migrations";
const candidates = (await readdir(migrationDirectory)).filter((name) =>
  /^\d+_harden_public_default_privileges\.sql$/.test(name),
);

if (candidates.length !== 1) {
  throw new Error(
    `Expected exactly one CLI-generated harden_public_default_privileges migration; found ${candidates.length}.`,
  );
}

const migrationPath = `${migrationDirectory}/${candidates[0]}`;
const sql = "-- Supabase's inherited public-schema defaults grant broad privileges to\n-- anon/authenticated. Keep future application objects closed unless a migration\n-- explicitly grants only the privileges they need.\nalter default privileges for role postgres in schema public\n  revoke all on tables from public, anon, authenticated;\nalter default privileges for role postgres in schema public\n  revoke all on sequences from public, anon, authenticated;\nalter default privileges for role postgres in schema public\n  revoke execute on functions from public, anon, authenticated;\n\n-- Existing tables were created before the default privileges were tightened.\n-- Remove inherited grants first, then grant only the operations intended by RLS.\nrevoke all on table public.profiles, public.projects, public.conversations, public.messages\n  from public, anon, authenticated;\n\ngrant usage on schema public to authenticated;\ngrant select, insert, update on table public.profiles to authenticated;\ngrant select, insert, update, delete on table public.projects to authenticated;\ngrant select, insert, update, delete on table public.conversations to authenticated;\ngrant select, insert on table public.messages to authenticated;\n\n-- Cover composite ownership foreign keys so deletes/updates of parent rows do\n-- not require full-table scans. Keep the owner-only index for auth.users FK checks.\ncreate index if not exists conversations_project_owner_idx\n  on public.conversations (project_id, owner_id);\n\ncreate index if not exists messages_conversation_owner_idx\n  on public.messages (conversation_id, owner_id);\n\ncreate index if not exists messages_owner_idx\n  on public.messages (owner_id);\n";
await writeFile(migrationPath, sql, "utf8");
process.stdout.write(`Wrote ${migrationPath}\n`);
