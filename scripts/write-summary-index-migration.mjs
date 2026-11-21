import { readdir, writeFile } from "node:fs/promises";

const migrationDirectory = "supabase/migrations";
const candidates = (await readdir(migrationDirectory)).filter((name) =>
  /^\d+_index_summary_source_foreign_keys\.sql$/.test(name),
);

if (candidates.length !== 1) {
  throw new Error("Expected exactly one CLI-generated index_summary_source_foreign_keys migration; found " + candidates.length + ".");
}

const migrationPath = migrationDirectory + "/" + candidates[0];
const sql = "-- Cover the complete composite foreign keys on the provenance tables.\n-- The primary keys begin with summary_id but do not cover all scoped FK columns.\ncreate index if not exists conversation_summary_sources_summary_scope_idx\n  on public.conversation_summary_sources (summary_id, conversation_id, owner_id);\n\ncreate index if not exists project_context_summary_sources_summary_scope_idx\n  on public.project_context_summary_sources (summary_id, project_id, owner_id);\n";
await writeFile(migrationPath, sql, "utf8");
process.stdout.write("Wrote " + migrationPath + "\n");
