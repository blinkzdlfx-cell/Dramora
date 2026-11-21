# Dramora — Implementation Updates

**Repository:** `blinkzdlfx-cell/Dramora`  
**Last updated:** November 21, 2026  
**Purpose:** The single chronological record of implementation work, validation evidence, limitations and the next implementation step. The authoritative product and architecture decisions remain in `DRAMORA_TECHNICAL_BLUEPRINT.md`.

---

## Working rules

- Keep exactly two primary living project documents: this file and `DRAMORA_TECHNICAL_BLUEPRINT.md`.
- Put approved requirements and durable architecture decisions in the blueprint.
- Record implementation changes, PRs, test evidence, unresolved issues and next steps here.
- Do not call work complete without validation evidence.
- Preserve the approved strict-free-only rule. Do not enable paid services, paid credits or hidden fallbacks.
- Supabase PostgreSQL remains the only planned primary database.
- Use bounded implementation batches and update this log as work progresses.

## 2026-11-21 — Planning consolidation

### Completed
- Consolidated the approved product scope for AI Video Studio and Film Studio.
- Consolidated AI provider/model groups and strict recurring-free usage rules.
- Reconciled Supabase-primary and lightweight Cloudflare supporting architecture.
- Consolidated RAG, Project Bible, documents, reference cards, scenes/shots/segments and durable task execution.
- Added security, privacy, legal disclosure, storage lifecycle, backup portability and disaster-recovery requirements.
- Added explicit context compaction requirements: versioned summaries, source references, canonical project memory, bounded retrieval and preservation of original messages.
- Set the repository documentation rule: exactly two primary living documents.

### Architecture constraints retained
- No D1, Neon, OpenRouter, Cloudflare Workflows or Hyperdrive.
- No paid fallbacks, paid credits or hidden charges.
- Private creative project content is not used to train Dramora's own AI systems.
- External media-generation/editing platforms perform media creation in Release 1; Dramora prepares production materials.

### Validation
- Planning decisions were consolidated into the technical blueprint.
- Context compaction is specified as a requirement; it has not yet been implemented in application code.

## 2026-11-21 — Phase 0 foundation opened

**Pull request:** [#2 — Phase 0: establish Dramora React and Vite foundation](https://github.com/blinkzdlfx-cell/Dramora/pull/2)

### Changes currently in the PR
- React 19 + TypeScript + Vite foundation.
- Tailwind CSS v4 via the Vite plugin.
- Initial responsive entry screen with the two approved studios.
- Strict TypeScript type-check and production build scripts.
- GitHub Actions workflow for install, type-check and build.
- Browser-safe Supabase environment placeholders.

### Status and limitations
- PR #2 is open as a draft; it has not been merged.
- The scaffold has not yet been proven by a successful CI run in the recorded evidence.
- No generated npm lockfile has been committed yet.
- No Supabase project has been provisioned and no backend secrets are configured.
- The landing page is a foundation screen, not the completed product UI.

## 2026-11-21 — Next implementation batch

### Intended work
1. Complete foundation dependency/build verification and generate a reproducible lockfile.
2. Configure shadcn/ui for the existing Vite + Tailwind CSS v4 setup.
3. Add the assistant-ui package and build a small compatibility proof using its ExternalStoreRuntime with Dramora-owned message/task state.
4. Keep assistant-ui as a presentation/runtime adapter; Supabase remains the eventual persistence authority.
5. Do not connect the chat proof to a fake production backend or introduce AI provider credentials.
6. Update this document with exact validation outcomes and revise the blueprint only if a durable architecture decision changes.

### Compatibility direction under test
assistant-ui's ExternalStoreRuntime is the current candidate because Dramora needs to own message history, persistence, task checkpoints, cancellation and recovery. The runtime should bridge UI events to Dramora's own application service rather than take ownership of canonical conversation state. The existing/anticipated custom streaming protocol must be adapted explicitly; do not assume it is compatible with assistant-ui's Data Stream protocol.

### Acceptance evidence still required
- Dependency installation completes.
- TypeScript type-check passes.
- Production build passes.
- A minimal ExternalStoreRuntime provider type-checks and renders in the Vite app.
- No secrets are bundled into client code.
- CI result and generated lockfile are recorded before PR #2 is considered verified.


## 2026-11-21 — Phase 0.2: UI primitives and assistant-ui runtime bridge

**Implementation branch:** `phase-0/react-vite-foundation`  
**Pull request:** [#2 — Phase 0: establish Dramora React and Vite foundation](https://github.com/blinkzdlfx-cell/Dramora/pull/2)

### Changes added to PR #2
- Added shadcn/ui project configuration for the existing Vite + React + TypeScript + Tailwind CSS v4 application.
- Added shared `cn()` utility using `clsx` and `tailwind-merge`.
- Added reusable Button and Card primitives using class-variance-authority.
- Updated the landing screen to use the shared Button/Card primitives.
- Added `@assistant-ui/react` and a Dramora-owned `ExternalStoreRuntime` bridge.
- The runtime bridge accepts a conversation ID, initial persisted messages and an application-owned send handler. It does not own canonical persistence.
- Added the `@/*` TypeScript alias to both the root and app TypeScript configurations.
- Removed the temporary README so the repository follows the approved two-document rule.

### Design decision confirmed by current assistant-ui documentation
- Use `ExternalStoreRuntime` because Dramora must own conversation history, task state, persistence, cancellation and recovery.
- The assistant-ui runtime is a presentation/input adapter, not the source of truth.
- Do not assume the custom Dramora streaming protocol is compatible with assistant-ui Data Stream. Add an explicit adapter only after the backend event contract is defined.
- Keep LangGraph behind the application service boundary; do not couple the UI directly to a hosted LangGraph Cloud service.

### Validation status
- Package versions were pinned in `package.json`.
- TypeScript and Vite alias configuration has been added.
- A local npm install/build could not be run from the current execution environment because outbound DNS/network access to GitHub/npm is unavailable.
- GitHub Actions workflow is configured to install dependencies, inspect the dependency tree, type-check and build. No completed workflow run or green check was visible at the time this update was recorded.
- No lockfile has been generated/committed yet. PR #2 remains a draft and must not be merged until CI and lockfile validation are complete.
- The assistant-ui bridge is compile-time verified only; it is not yet mounted as an interactive chat UI or connected to Supabase, a real API, streaming, task cancellation or persisted conversations.

### Current implementation state
- Phase 0 foundation and the UI/runtime integration scaffold are present in PR #2.
- Context compaction is specified in the blueprint but has not yet been implemented in application code.
- Authentication, database schema, RLS, conversation persistence, backend streaming, durable task orchestration and provider adapters have not yet been implemented.

### Next implementation steps
1. Get PR #2's CI workflow to run and pass; resolve any dependency/type/build failures.
2. Generate and commit `package-lock.json` from a successful install.
3. Add a small rendered/interactive assistant-ui smoke test using a development-only in-memory handler; keep it separate from production persistence.
4. Once the foundation is verified and merged, begin the Supabase foundation: client/server boundaries, Auth integration, first migrations, RLS and automated isolation tests.
5. Do not start production chat/provider orchestration until the persistence and security boundary is in place.

## 2026-11-21 — Phase 0 verified and merged

**Pull request:** [#2 — Phase 0: establish Dramora React and Vite foundation](https://github.com/blinkzdlfx-cell/Dramora/pull/2)  
**Merge commit:** `1f77ace6c7c4c52851ce6295b37381925154c621`

### Completed
- Added the React 19, Vite 8 and TypeScript application foundation.
- Configured Tailwind CSS v4 through the Vite plugin.
- Added Vite client/CSS type declarations and matching `@/*` aliases for Vite and both TypeScript configuration layers.
- Added shadcn/ui-compatible project configuration and reusable Button/Card primitives.
- Added the shared `cn()` helper using `clsx` and `tailwind-merge`.
- Added `@assistant-ui/react` and a typed Dramora `ExternalStoreRuntime` bridge.
- Kept conversation state and send handling owned by Dramora's application layer; assistant-ui is not the canonical persistence layer.
- Generated and committed `package-lock.json` from the CI runner.
- Removed the temporary README so the repository retains only the two approved project documents.

### Validation evidence
GitHub Actions run **#33** completed successfully:
- Dependency installation: passed.
- Direct dependency tree verification: passed.
- TypeScript type-check: passed.
- Vite production build: passed.
- Lockfile generation and commit: passed.

The first type-check run exposed a missing Vite CSS module declaration. Added `src/vite-env.d.ts`; the subsequent validation run passed.

### Explicitly not implemented yet
- No Supabase project connection or credentials.
- No authentication or account flows.
- No database migrations, RLS policies or security tests.
- No persisted project/conversation/message backend.
- No real streaming API, durable task engine or LangGraph orchestration.
- No model-provider adapters or AI calls.
- No application-code context compaction. The context compaction design is documented in the blueprint and awaits its implementation phase.

### Current status
**Phase 0 is merged and its install/type-check/build pipeline is green.** This verifies the frontend/tooling foundation, not the complete application or the assistant-ui streaming/persistence integration.

## Next implementation phase — Supabase foundation

The next bounded implementation batch is:

1. Inspect the current Supabase project state and confirm whether a fresh project already exists. Do not create a project or enable a paid feature without approval.
2. Establish the browser/server client boundary using only the publishable key in browser code and server-side secrets for privileged operations.
3. Define the first versioned SQL migrations for profiles/account metadata, projects, conversations and messages.
4. Add RLS policies and automated tests proving users cannot read or mutate another user's data.
5. Add a minimal Auth flow and verify session handling, sign-out and protected routes.
6. Keep the schema and SQL functions version-controlled so the later portable PostgreSQL export/restore path can reproduce them.

Do not begin AI provider orchestration or production chat execution until authentication, persistence and RLS boundaries are established and tested. Context compaction should be implemented after conversation persistence exists, so summaries can be versioned and traced to immutable source messages.


## 2026-11-21 — Phase 1: Supabase authentication and initial schema

**Pull request:** [#4 — Phase 1: add Supabase authentication and initial data schema](https://github.com/blinkzdlfx-cell/Dramora/pull/4)

### Supabase project inspection
- Found an existing dedicated Supabase project named `dramora` in the connected Supabase account.
- Project ref: `hiyevsafaiehlzuqcngf`.
- Region: `eu-west-1`; PostgreSQL 17.12; project status active/healthy.
- The public schema had no application tables and the project had no application migration history.
- No new project was created, no data was deleted and no paid feature was enabled.
- The project contains standard Supabase Auth and Storage system schemas. The Auth users table was empty at inspection time.

### Implemented in PR #4
- Added pinned `@supabase/supabase-js@2.119.0`.
- Added a browser client that requires the project URL and publishable key; no secret/service-role key is exposed.
- Configured PKCE, persisted sessions, automatic token refresh and auth URL detection.
- Added a shared AuthProvider for session restoration, auth-state changes, password recovery and sign-out.
- Added email/password sign-in, registration, password reset and password-update screens.
- Connected the landing page header to the real auth state and made the pending workspace state explicit.
- Added a CLI-generated first migration for `profiles`, `projects`, `conversations` and `messages`.
- Added owner-scoped RLS, explicit authenticated grants, composite ownership foreign keys and append-oriented message policies.
- Browser roles cannot write assistant/tool messages or update/delete message history.
- Added `supabase/config.toml` with PostgreSQL 17 and `auto_expose_new_tables = false`.
- Added Supabase CLI local-state ignore rules.
- Added CI generation of the initial migration using the official Supabase CLI rather than inventing a timestamped filename.

### Security inspection and remediation included in migration
- Supabase Security Advisor reported one warning for the pre-existing `public.rls_auto_enable()` SECURITY DEFINER event-trigger function being executable by `anon` and `authenticated`.
- Confirmed it is called by the database-owned `ensure_rls` DDL event trigger.
- The migration conditionally revokes direct execution from `PUBLIC`, `anon` and `authenticated` while leaving the event trigger intact.
- Performance Advisor returned no findings at inspection time.
- Security Advisor must be rerun after the migration is applied to verify the warning is resolved.

### CI and validation evidence
- Initial attempt to install CLI using `v3.stable` failed because that dist-tag did not resolve to a published CLI version. Corrected to the published CLI version `3.0.0`.
- Supabase CLI setup and project initialization passed.
- Timestamped migration generated: `supabase/migrations/20261121114120_dramora_core_schema.sql`.
- npm dependency install and lockfile generation passed.
- Direct dependency-tree verification passed.
- TypeScript type-check passed.
- Vite production build passed.
- Latest successful GitHub Actions validation: run **#48**, all steps passed.

### Current limitations
- PR #4 has passed CI but is still open; its migration has not yet been applied to the hosted database.
- Authentication UI and client integration are implemented, but live authentication is not yet verified because the deployment environment has not been configured with the Dramora project URL/publishable key and the production Auth redirect allowlist has not been checked.
- No profile, project, conversation or message rows have been created.
- Cross-user RLS tests and post-migration advisors remain pending.
- Project/conversation/message service wiring, streaming, durable task orchestration, provider adapters and application-code context compaction remain unimplemented.

### Next steps
1. Finish review and merge PR #4.
2. Apply the reviewed initial migration to the existing Dramora Supabase project.
3. Verify tables, migration history, explicit grants, RLS policies, composite foreign keys and the RLS event-trigger privilege remediation.
4. Run transactional two-user isolation tests and confirm test rows are rolled back.
5. Rerun Supabase Security and Performance Advisors.
6. Retrieve the project's public URL/publishable key and configure deployment environment and Auth redirect allowlist without committing credentials.
7. Add project/conversation/message data-access services and connect authenticated workspace flows.
8. Implement context compaction only after persisted message history is available.


## 2026-11-21 — Database grant hardening and remote verification

**Pull request:** [#5 — Security hardening: remove inherited public-schema grants](https://github.com/blinkzdlfx-cell/Dramora/pull/5)  
**Merge commit:** `675de51e0fb77c4c65fa7342517af0983791ed9b`
### Why the follow-up migration was required
- After the initial schema migration, inspection of `information_schema.role_table_grants` showed that the Supabase project's inherited default ACLs still gave `authenticated` broad table privileges, including `TRUNCATE`, `REFERENCES` and `TRIGGER`.
- RLS does not protect against `TRUNCATE`; relying on RLS alone would have left a dangerous privilege path.
- This was caught before any real Dramora user/project data was created.
- The original migration was corrected for clean rebuilds, and a second migration was added for the already-initialised hosted project.

### Corrective changes
- Revoked all table privileges from `PUBLIC`, `anon` and `authenticated` before applying explicit least-privilege grants.
- Tightened default privileges for future `postgres`-created public tables, sequences and functions.
- Added indexes for composite ownership foreign keys and the messages owner foreign key.
- Kept `service_role` and `postgres` privileges intact for trusted administration/server-side operations.
- Applied the follow-up migration to the existing Dramora project.

### Remote database verification
Both migrations are recorded in Supabase migration history:
- `20261121114120_dramora_core_schema`
- `20261121114606_harden_public_default_privileges`

Effective application-table grants now match the intended allowlist:
- `profiles`: authenticated SELECT, INSERT, UPDATE only.
- `projects`: authenticated SELECT, INSERT, UPDATE, DELETE only.
- `conversations`: authenticated SELECT, INSERT, UPDATE, DELETE only.
- `messages`: authenticated SELECT, INSERT only.
- No application-table privileges for `anon`.
- Future public-schema tables, sequences and functions created by `postgres` no longer receive automatic privileges for `PUBLIC`, `anon` or `authenticated`.

A transactional two-user RLS test passed:
- User B could see their own project/conversation but could not see User A's project or message.
- Cross-owner project/conversation relationship was rejected by the composite foreign key.
- Browser-authenticated insertion of an assistant-role message was rejected by RLS.
- `authenticated` lacked TRUNCATE, UPDATE and DELETE privileges on messages.
- `anon` lacked SELECT privilege on projects.
- Synthetic users and test rows were rolled back; no test data was retained.

### Advisor results
- Security Advisor: **zero findings** after the corrective migration.
- Performance Advisor: no unindexed foreign-key findings remained. It reports unused indexes because the project is still empty; retain the planned indexes until real query patterns are available, then reassess with workload evidence.

### Current status
- Phase 0 frontend foundation is merged and verified.
- Phase 1 authentication client/UI and initial database schema are merged.
- Both database migrations are applied and remotely verified.
- RLS isolation and least-privilege grants have passed transactional tests.
- Live email/password authentication has not yet been tested from the deployed browser because the app's deployment environment variables and Supabase Auth redirect allowlist still need configuration.
- Project/conversation UI, persistence service integration, message chat flow, AI orchestration and application-code context compaction remain pending.

### Next implementation phase
1. Build the authenticated project dashboard for the two studios.
2. Add project creation/listing and conversation creation/listing services using the RLS-protected Supabase client.
3. Add project/conversation workspace navigation and explicit empty/loading/error states.
4. Keep assistant-ui connected only after conversation persistence and server-side message creation contracts are ready.
5. Configure deployment environment values and Auth redirect allowlist; do not commit the publishable key or any secret to Git.
6. Add application-level tests for project and conversation CRUD under authenticated sessions.


## 2026-11-21 — Phase 2: authenticated project and conversation workspace

**Pull request:** [#6 — Phase 2: add authenticated project and conversation workspace](https://github.com/blinkzdlfx-cell/Dramora/pull/6)

### Implemented
- Generated TypeScript database types from the live Dramora Supabase schema and committed them under `src/lib/supabase/database.types.ts`.
- Updated the shared Supabase client to use the generated `Database` type.
- Added typed project and conversation data-access functions:
  - list active projects for the signed-in owner
  - create a project with a user-defined title and selected studio
  - list active conversations within a project
  - create a conversation under the selected project
- Added the authenticated project dashboard.
- Added project creation flow for the two approved studios: AI Video Studio and Film Studio.
- Added project detail navigation and conversation list/create flow.
- Added loading, empty and error states.
- Authenticated users now land on their project dashboard rather than the public marketing entry screen.

### Behavior boundaries
- Project and conversation reads/writes use the browser Supabase client and the database's RLS policies.
- Client-side owner filters are for query scoping only; RLS remains the security boundary.
- Project deletion/archive and conversation deletion are not exposed in this batch.
- A conversation record is persisted and displayed, but the chat composer, message streaming and assistant execution are not yet wired. The UI states this explicitly.
- No assistant messages are inserted from the browser.

### Validation
- GitHub Actions run **#63** passed:
  - Supabase CLI setup and migration checks.
  - npm dependency install and lockfile verification.
  - TypeScript type-check.
  - Vite production build.
- The generated database types match the currently applied Supabase schema.
- Live browser CRUD testing remains pending until the deployed app has the project URL/publishable key configured and an allowed Auth redirect URL.

### Next steps
1. Merge the verified Phase 2 PR.
2. Configure the deployment environment with the Dramora Supabase project URL and publishable key; keep credentials out of Git.
3. Verify Auth registration/sign-in/password recovery against the actual deployed origin and configure the Supabase redirect allowlist.
4. Verify project and conversation creation/listing in a real signed-in browser session.
5. Implement the persisted chat composer and message service, including idempotency and status handling.
6. Define the server-side assistant orchestration/streaming contract before connecting assistant-ui to real model calls.
7. Implement context compaction after persisted message history and summaries have a stable contract.


### Phase 2 merge
- PR #6 merged into `main`.
- Merge commit: `0e62e556576a494f3481ce52cd71520ba766185e`.
- Latest validation on the merged PR branch: GitHub Actions run #64 passed install, Supabase CLI setup, type-check and production build.

## Next implementation batch — durable tasks and compaction storage

The next backend batch will add versioned database records for:
- Durable tasks and task event history/checkpoints.
- Conversation summaries and exact source-message provenance.
- Project-context summaries and source-conversation provenance.

The browser will be able to read only its own task/summary records. Task execution state and summary creation/updates remain server-owned. The next migration must preserve strict least-privilege defaults and be verified with two-user RLS tests and Supabase Advisors before chat orchestration uses it.


## 2026-11-21 — Phase 3: durable task and context-summary storage

**Pull request:** [#7 — Phase 3: add durable task and context compaction storage](https://github.com/blinkzdlfx-cell/Dramora/pull/7)  
**Merge commit:** `ce4fe9270add098854816b8003ca6b40e7a8577b`

### Implemented and applied to the hosted Dramora database- `tasks`: durable server-owned task state, checkpoints, retry counters, approval state, stop requests and result/error fields.
- `task_events`: append-only task event history with ordered per-task sequence numbers.
- `task_control_requests`: owner-scoped stop/continue/retry/approve/reject requests.
- `conversation_summaries`: versioned structured conversation summaries and covered-message metadata.
- `conversation_summary_sources`: exact source-message IDs and ordering for every conversation summary.
- `project_context_summaries`: versioned project-level context summaries, distinct from canonical Project Bible records.
- `project_context_summary_sources`: source-conversation provenance for each project summary version.
- Composite foreign keys bind tasks, summaries and provenance to the correct owner/project/conversation/message.
- One current summary per conversation/project is enforced by partial unique indexes; superseded versions remain stored.

### Security model
- All new tables have RLS enabled.
- Browser users can read only their own tasks, events and summary records.
- Task state, task events and summary creation/versioning are server-owned.
- Browser users can submit only scoped task-control requests.
- Task-control INSERT is column-scoped; clients cannot set IDs, creation/processing timestamps or server outcomes.
- Browser users cannot create/update/delete task state, event history or summaries.
- The database's existing strict default privileges remain in effect.

### Performance follow-up
**Pull request:** [#8 — Performance: index context summary provenance foreign keys](https://github.com/blinkzdlfx-cell/Dramora/pull/8)  
**Merge commit:** `0247fb2a62cdc8bffe38f272f04917d0be4c76fd`

- Performance Advisor identified two missing covering indexes for composite provenance foreign keys.
- Added the exact source-summary scope indexes and applied the migration.
- Latest Performance Advisor has no unindexed foreign-key findings. It reports unused indexes because the database is still empty; retain these planned indexes until real workload evidence supports removal.

### Hosted migration history
- `20261121115154_durable_tasks_and_context_summaries`
- `20261121115325_index_summary_source_foreign_keys`

### Validation evidence
- GitHub Actions run #67 passed the durable-task/summary migration generation, dependency install, type-check and production build.
- GitHub Actions run #70 passed the summary-source index migration generation, dependency install, type-check and production build.
- Transactional two-user tests passed:
  - User B could read only B's tasks, task events, control requests, conversation summaries, source rows and project summaries.
  - User B could not see User A's task.
  - User B could submit a stop request for B's task.
  - User B could not submit a control request for A's task.
  - Browser role could not insert tasks, change task state, insert task events, update control requests, or set server-owned processed timestamps.
  - Anonymous role could not read tasks.
- All synthetic test users, projects, conversations, messages, tasks, summaries and control requests were rolled back. A follow-up count confirmed zero retained auth users or application rows.
- Security Advisor: **zero findings**.
- Performance Advisor: **zero unindexed foreign-key findings**; only expected unused-index notices on the empty database.

### Current status
- Phase 0 frontend/tooling foundation merged and verified.
- Phase 1 Supabase Auth client/UI and core schema merged.
- Phase 2 authenticated project/conversation workspace merged.
- Core ownership/RLS schema, least-privilege grants, durable task records and context-summary provenance tables are applied and verified remotely.
- Authentication is not yet live-verified from the deployed app because environment variables and Auth redirect allowlist still need configuration.
- No task worker, AI execution, message streaming or actual context-compaction algorithm has been implemented yet. This phase provides the durable storage/security foundation for those systems.

### Next implementation phase
1. Add authenticated message loading and user-message persistence.
2. Define the server-side chat request contract and task creation flow.
3. Implement a durable worker/orchestrator that validates ownership, creates assistant/tool messages, checkpoints progress and processes task-control requests.
4. Implement token-budget estimation and context-compaction summary generation with source validation/versioning.
5. Connect assistant-ui to the persisted message/task lifecycle only after the server event/stream protocol is defined.
6. Configure the deployment's Supabase URL/publishable key and Auth redirect allowlist, then verify real sign-in and project/conversation CRUD.


### Phase 3 verification and generated type refresh
- PR #8 merged into `main`; merge commit: `0247fb2a62cdc8bffe38f272f04917d0be4c76fd`.
- Applied migration `20261121115325_index_summary_source_foreign_keys` to the hosted Dramora database.
- Performance Advisor now reports no unindexed foreign-key findings. Remaining notices are unused indexes on an empty database.
- Transactional two-user tests verified owner isolation for tasks, task events, control requests, conversation summaries, summary sources, project-context summaries and source conversations.
- Tests verified task state and event history are not writable by browser roles, task-control requests are owner-scoped, and server-owned processing columns cannot be inserted by clients.
- All synthetic data was rolled back; a follow-up count confirmed zero users or application rows remain.
- Security Advisor remains at zero findings.

**Generated types PR:** [#9 — refresh generated Supabase database types](https://github.com/blinkzdlfx-cell/Dramora/pull/9)  
**Merge commit:** `c81020121ade6c9c3719736c3e77188f1736a608`

- Regenerated `src/lib/supabase/database.types.ts` from the live schema, including tasks, task events, task-control requests and summary/provenance tables.
- GitHub Actions run #75 passed Supabase CLI setup, dependency installation, dependency verification, TypeScript type-check and production build.

## 2026-11-21 — Production authentication UI follow-up

**Pull request:** [#10 — Fix auth loading UI and password visibility](https://github.com/blinkzdlfx-cell/dramora/pull/10)

### Changes
- Replaced the header's visible `Checking session...` text with an accessible shimmer placeholder.
- Added a landing/workspace skeleton while the persisted Supabase session is being restored, preventing the logged-out landing page from flashing before auth state is known.
- Added accessible show/hide controls to password fields, including the password confirmation field.
- Improved browser-level `Failed to fetch` handling. The UI now identifies it as a network/reachability failure rather than presenting it as an invalid password, and the original exception is logged for diagnosis.

### Diagnostic evidence and limitation
- Supabase project `hiyevsafaiehlzuqcngf` was rechecked and reports `ACTIVE_HEALTHY`; the API URL returned by Supabase is `https://hiyevsafaiehlzuqcngf.supabase.co`.
- Supabase's current breaking-change changelog contains no relevant JavaScript Auth change affecting this implementation.
- A live browser/network reproduction could not be performed in this session. The reported `Failed to fetch` is a browser-level network error, so it does not establish that the email/password data is invalid. The exact failing request and browser network/console details are still required if the issue persists after the UI fix.
- The PR must pass CI before merge. Registration and sign-in must then be retested against the production deployment; a successful build alone does not verify authentication.

### Next steps
1. Review PR #10 and confirm type-check/build checks pass.
2. Merge and wait for the production deployment.
3. Retry registration. If it still fails, capture the failed request URL/status and the browser console's full network/CORS message (do not share passwords or auth tokens).
4. Verify email confirmation, sign-in, refresh persistence and password recovery before moving on to persisted chat messages.

## 2026-11-21 — Supabase infrastructure verification and auth entry-mode correction

### Supabase connection and project verification
- Queried both connected Supabase accounts to identify the intended Dramora backend rather than assuming the account/project from its display name.
- Confirmed the correct project is **dramora**, ref `hiyevsafaiehlzuqcngf`, under the **BlinkdlFx supabase** connection, in `eu-west-1`.
- Supabase reports the project as `ACTIVE_HEALTHY`; the Management API returned the matching API URL `https://hiyevsafaiehlzuqcngf.supabase.co`.
- Connected directly to the project's Postgres database as the administrative connection and confirmed database access. The database contains the expected 11 public application tables; all 11 have RLS enabled.
- Confirmed the four expected migrations are recorded in this project: core schema, public default-privilege hardening, durable tasks/context summaries, and summary-source FK indexes.
- Confirmed there are currently zero Auth users and zero rows in the application tables. No user data was modified.
- Security Advisor returned no findings. Performance Advisor returned only informational unused-index notices, expected while the new tables are empty.
- The other connected Supabase account contains no Dramora project. The similarly named Forge project is in a different account and is not the backend used for this application.
- `supabase/config.toml` uses `project_id = "dramora"` as the local Supabase CLI project slug. This is not a competing remote project reference. The browser client reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`; it does not hardcode a different Supabase project reference.

### Authentication request log inspection
- Inspected the target project's Auth logs for the recent 24-hour window.
- Logs include requests originating from `https://dramora.brilinadev.name.ng`, including successful Auth API requests, confirming that the production origin has contacted this project's Auth service.
- No `/signup` or `/token` request was present in the inspected Auth log window. This does not prove the browser-side failure's exact cause, but it means the current logs do not show a registration request reaching the Auth signup endpoint. A fresh registration attempt after this UI fix is needed to correlate a request with the logs.
- No Auth settings, database schema, keys, or user records were changed during this inspection.

### Auth entry-mode bug fixed directly on main
- `App.tsx` previously selected `sign-up` when Create Account was clicked but did not pass that selection into `AuthScreen`.
- `AuthScreen.tsx` independently initialized every new screen in `sign-in` mode, causing Create Account to display the Sign In form.
- Added a required `initialMode` prop and passed the selected mode from `App.tsx`. Password-recovery mode still takes precedence when a recovery event is active.
- Changes were committed directly to `main` as two small commits; no pull request was created, as requested.

### Validation
- GitHub Actions run **#83** for the direct-to-main change completed successfully: Supabase CLI setup, migration-generation check, dependency installation, dependency verification, TypeScript type-check and production build all passed.
- The CI run was triggered by the documentation commit after both source changes were already on `main`, so the validated commit includes the AuthScreen and App changes.
- Cloudflare production deployment completion and live browser behavior have not been independently verified in this session.
- Retest both Create Account entry points after Cloudflare finishes deploying. If registration still reports `Failed to fetch`, inspect fresh Auth logs and browser Network/Console details at the same timestamp. Do not change Supabase project settings without new evidence.
