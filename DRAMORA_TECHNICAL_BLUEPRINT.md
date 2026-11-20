# DRAMORA — Technical Blueprint

**Status:** Research and architecture proposal for review  
**Prepared:** 20 November 2026  
**Repository inspected:** `blinkzdlfx-cell/dramora`  
**Default branch:** `main`  
**Scope:** Improve the existing Dramora product; do not rebuild it.

---

## 1. Executive summary

Dramora is intended to be an AI movie-writing and pre-production workspace centered on an intelligent Showrunner. The Showrunner should understand the active project, help develop stories, preserve approved creative decisions, maintain continuity, and support the user's writing and pre-production workflow.

The next engineering effort should strengthen the existing workspace and intelligence layer. It should not turn the initial release into a media-generation platform.

The proposed direction is:

1. Preserve the current Dramora product, working routes, authentication, Supabase data, conversation history, project workflows, and existing model integrations.
2. Integrate Assistant UI as a presentation/runtime layer only where it fits the existing implementation.
3. Keep Supabase PostgreSQL as the system of record and use pgvector for vector retrieval.
4. Improve the existing RAG (Retrieval-Augmented Generation) implementation rather than introducing a second memory/retrieval stack.
5. Keep structured project facts and approved creative decisions canonical in relational records; treat embeddings as a search index.
6. Build a governed Showrunner context pipeline combining active conversation, structured project state, and relevant project history.
7. Complete the source-code and database audit before changing application code or schema.

### Critical repository finding

The connected GitHub repository currently contains only an initial commit with `.gitignore` and `LICENSE`. GitHub reports a repository size of 2 KB, one branch (`main`), no pull requests, and no application source files. Fetching expected files such as `package.json` and `README.md` returns 404.

This is a verified finding from the repository as it is currently connected. It conflicts with the established Dramora project history, which describes an existing application, prior phases/PRs, Supabase integration, and production deployment. Consequently, **the actual application implementation cannot yet be inspected from this repository**. This blueprint records the known project history as historical context, not as freshly verified source-code facts. The correct application repository or current source must be identified before implementation.

---

## 2. Product definition and scope

### 2.1 Product identity

Dramora is an AI Movie Writing & Pre-Production Workspace, with the AI Showrunner as its central intelligence. It should act as a project-aware creative collaborator rather than a generic chatbot.

The Showrunner should understand story state, remember approved decisions, detect contradictions, ask for missing information, and help the creator progress through writing and pre-production work.

### 2.2 In scope

- Existing workspace experience and navigation.
- Assistant UI integration, subject to compatibility inspection.
- Conversation/thread experience and persistence.
- Project-aware Showrunner intelligence.
- Project/story context retrieval.
- Existing memory and RAG improvements.
- Supabase persistence and pgvector retrieval.
- Structured creative information and decision tracking.
- Existing story-development and pre-production workflows.
- Structured tool results and purpose-built UI components.
- Existing voice-input/transcription work, subject to verification of its merge and deployment state.
- Reliability, security, testing, observability, and performance.

### 2.3 Explicitly out of scope

The initial implementation covered by this blueprint does **not** include:

- AI image generation.
- AI video generation.
- Image/video generation providers, endpoints, queues, credit systems, or generation job management.
- Replacing Supabase or adding another database.
- A parallel memory store that duplicates Dramora's existing memory.
- Rebuilding the application from scratch.
- Replacing working routes/components without a demonstrated reason.

Existing uploaded image assets, image previews, and asset browsing may remain if already implemented. They are separate from generating new media.

### 2.4 Product principles

- **Continuity:** approved story facts remain consistent across sessions.
- **User authority:** the creator owns the story; the Showrunner must not silently rewrite canon.
- **Traceability:** important answers should be grounded in project records or retrieved sources.
- **Transparency:** distinguish established facts, assumptions, suggestions, and unresolved questions.
- **Recoverability:** refreshes, navigation, interrupted streams, and failed requests must not destroy work.
- **Progressive complexity:** add agent capabilities only when they improve outcomes.
- **Operational simplicity:** preserve the current stack unless measurements justify change.

---

## 3. Existing implementation assessment

### 3.1 What GitHub currently verifies

The connected repository `blinkzdlfx-cell/dramora` was inspected through GitHub:

| Item | Verified result |
|---|---|
| Repository | `blinkzdlfx-cell/dramora` |
| Default branch | `main` |
| Current branch list | Only `main` |
| Latest commit | `b2ad608fe43d7553afa7c49ccbf9cf63cf648994` — “Initial commit” |
| Files in initial commit | `.gitignore`, `LICENSE` |
| Repository size reported by GitHub | 2 KB |
| Pull requests returned by GitHub search | None |
| `package.json` | Not found |
| `README.md` | Not found |
| Application source | Not present in the inspected commit |
| Supabase migrations/schema | Not present in the inspected commit |
| Build/deployment configuration | Not present in the inspected commit |

The GitHub connector has repository access, but the repository itself does not contain the application source expected from the previous project history. This is not simply a failed code-search index: the latest commit diff confirms that the initial commit adds only `.gitignore` and `LICENSE`.

### 3.2 Historical Dramora context — not freshly verified in this repository

Earlier Dramora work and project discussions established the following context. These details should guide the audit, but must be checked against the correct source and live backend before implementation:

| Area | Historical project context | Verification still required |
|---|---|---|
| Product | AI Movie Writing & Pre-Production Workspace; AI Showrunner | Confirm current product behavior |
| Production URLs | `https://dramora.brilinadev.name.ng`; `https://dramora.brilinadev.name.ng` was the app domain; Worker URL historically noted as `https://dramora.brilinadev.workers.dev` in some notes | Confirm exact canonical app/API domains and current deployment |
| Backend | Supabase PostgreSQL | Confirm project and live schema |
| Supabase project reference | Historical ID `eilbacycqntarrhstyce` | Confirm correct project |
| Data | Projects, conversations, messages, memory, embeddings, creative documents, approvals, and tasks were discussed | Inspect exact tables, constraints, indexes, triggers, and RLS |
| Retrieval | Existing semantic and full-text retrieval were discussed | Inspect actual implementation and quality |
| Embeddings | Historical model included `@cf/baai/bge-small-en-v1.5` | Verify exact deployed model and vector dimension |
| AI | Cloudflare Workers AI model integration was used | Verify active models, routes, fallbacks, and bindings |
| Workspace | Project/workspace routes, conversation list, composer, mode selector, rename/archive, and refresh persistence were developed | Inspect actual current UI and regressions |
| Voice | Phase 2 work included authenticated transcription, a `/api/transcribe` route, Whisper Large v3 Turbo, validation, and retry behavior | Verify PR/commit, route, model binding, limits, and deployment |
| Assets | Image display/asset collections were discussed separately from generation | Preserve existing functionality if present |

**URL caution:** prior notes contain inconsistent Worker URL spellings. Do not use any historical URL as an authoritative deployment target until checked in the actual project configuration and deployment dashboard.

### 3.3 Assessment conclusion

The repository currently connected to GitHub is not a usable snapshot of the existing Dramora application. It appears to be an empty project repository initialized with repository metadata, rather than the source repository described in the prior development history.

Therefore:

- Do not start implementation in this repository as if it contained the current app.
- Do not scaffold a replacement app here.
- Do not infer current package versions, routes, database schema, or RAG code.
- Identify the correct source repository or restore the current application source to this repository.
- Once source is accessible, update this same document's verified assessment section rather than creating another blueprint.

### 3.4 Required source and production audit

Before code changes, inspect and record:

1. Correct repository URL, default branch, current commit SHA, and merged PR history.
2. `package.json`, lockfile, framework/runtime versions, and scripts.
3. App route tree, workspace components, and design system.
4. Chat API, streaming protocol, tool execution, cancellation, retry, and error handling.
5. Thread/message persistence, URL synchronization, and refresh behavior.
6. Supabase migrations and deployed schema.
7. Tables, foreign keys, indexes, triggers, RPC functions, and RLS policies.
8. Existing embedding generation and retrieval code.
9. Vector column dimensions and embedding model identifiers.
10. Memory write/update/delete lifecycle.
11. Project/story/character/document/task/approval data models.
12. Deployment configuration and environment bindings, without exposing secrets.
13. Voice route, provider settings, transcription limits, retry behavior, and deployment status.

The audit should be written into this document before implementation design is finalized.

---

## 4. Target architecture

### 4.1 Logical architecture

Keep the current application and backend. Improve boundaries between UI, chat runtime, Showrunner orchestration, retrieval, and persistence.

```text
Dramora Workspace
  ├── Existing project/story/pre-production UI
  ├── Assistant UI components and runtime (integrated, not authoritative)
  ├── Composer and existing voice/attachment workflows
  └── Structured Showrunner result renderers
          |
          v
Existing Dramora application API / server routes
  ├── Authentication and ownership checks
  ├── Conversation orchestration
  ├── Showrunner context builder
  ├── Tool registry and approval gates
  ├── Model/provider adapter
  └── Existing RAG service (improved, not duplicated)
          |
          +--------------------------+
          |                          |
          v                          v
Supabase PostgreSQL              AI providers
  ├── Auth-linked data             ├── Text generation
  ├── Projects                     └── Embeddings
  ├── Threads/messages
  ├── Canonical story records
  ├── Documents and decisions
  ├── Tasks and approvals
  └── RAG chunks, pgvector, FTS
```

This is a logical architecture, not a requirement to create a separate microservice for every box. Keep modules in the existing application unless measured operational needs justify separation.

### 4.2 Source-of-truth ownership

| Information | Canonical owner |
|---|---|
| User identity/session | Existing Supabase Auth integration |
| Project identity/settings | Existing project records |
| Thread metadata | Existing conversation/thread records |
| Messages | Existing message persistence |
| Approved story facts | Structured project/story records or approved creative documents |
| Approved creative decisions | Explicit decision/canon records or existing equivalent |
| Tasks and approvals | Existing task/approval records |
| Embedding chunks | Derived retrieval index |
| Model output | Conversation message; not automatically canon |
| UI transient state | Client runtime; persisted only when product behavior requires it |

Embeddings are a search index, not the source of truth. Exact facts such as a character's age or a story event should come from canonical records whenever available.

### 4.3 Backend authority

The browser must not decide whether a user owns a project or whether a tool action is permitted. The server must resolve the authenticated user and verify access before reading or mutating project data. Model calls and privileged operations remain server-side. The model must never receive database credentials.

---

## 5. Assistant UI integration

### 5.1 Role

Assistant UI should provide conversation interaction primitives: message rendering, composer components, thread-oriented UI, streaming states, tool result renderers, attachment interactions, and related components.

It must not become the owner of Dramora's product data, project model, authorization rules, or business logic.

Assistant UI separates frontend components, runtime, backend/agent behavior, integration protocol, and persistence. It supports an application's own backend and database; Assistant Cloud is optional. Dramora should keep its own backend and Supabase persistence.

Official references:
- Architecture: https://www.assistant-ui.com/docs/architecture
- Runtime selection: https://www.assistant-ui.com/docs/runtimes/pick-a-runtime
- Custom persistence: https://www.assistant-ui.com/docs/integrations/persistence/custom-adapter

### 5.2 Version compatibility gate

Do not install the latest runtime blindly. Inspect Dramora's actual `ai`, `@ai-sdk/react`, React, and framework versions first.

Current Assistant UI guidance distinguishes AI SDK versions:

- AI SDK v7: `@assistant-ui/ai-sdk` with `ai@^7` and `@ai-sdk/react@^4`.
- AI SDK v6: legacy `@assistant-ui/react-ai-sdk@1.3.40`.
- AI SDK v5: legacy `@assistant-ui/react-ai-sdk@1.1.21`.
- AI SDK v4: legacy data-stream integration.

For v7, `useChatRuntime` is the recommended high-level integration. If Dramora uses an incompatible or custom protocol, use a custom runtime/transport that preserves the current backend contract instead of forcing an unnecessary migration.

References:
- https://www.assistant-ui.com/docs/runtimes/ai-sdk/overview
- https://www.assistant-ui.com/docs/runtimes/ai-sdk/v7
- https://www.assistant-ui.com/docs/runtimes/custom/overview

### 5.3 Runtime decision matrix

Choose only after source inspection:

| Existing state/protocol | Candidate | Reason |
|---|---|---|
| Existing chat endpoint emits compatible AI SDK UI message stream | AI SDK runtime | Smallest integration surface |
| App store/custom controller owns chat state | ExternalStoreRuntime | Avoid duplicate state ownership |
| Backend emits compatible standard data stream | Data Stream runtime | Preserve backend protocol |
| Backend streams richer agent state/custom commands | AssistantTransport | Support custom state and commands |
| Existing backend can safely be wrapped by a small adapter | LocalRuntime | Keep integration bounded |

Assistant UI documents LocalRuntime, ExternalStoreRuntime, DataStream, and AssistantTransport as distinct integration patterns. Do not select one before checking the current chat route and state model.

### 5.4 Persistence

Supabase remains the only required persistence service.

If adapters are needed, map them to existing Dramora thread/message tables. Do not create parallel tables just to match a demo schema. Assistant UI's custom persistence pattern separates thread-list metadata from message history and uses adapters to translate stored records into runtime messages.

Acceptance requirements:

- Existing thread IDs remain stable.
- Existing messages remain readable.
- Reloading a thread restores the same conversation.
- Rename/archive/delete maps to existing Dramora operations.
- URL/thread routing remains functional.
- Streaming, stop, retry, and errors continue to work.
- No Assistant Cloud dependency is introduced without separate approval.
- No migration silently discards existing messages or metadata.

Reference: https://www.assistant-ui.com/docs/integrations/persistence/custom-adapter

### 5.5 Component/design integration

Use official Assistant UI component patterns, adapted to Dramora's existing design system. Do not blindly replace the app shell or product-specific workspace layout.

Potential areas:
- Thread/message list and message primitives.
- Composer and action controls.
- Streaming/loading/error states.
- Tool call/result blocks.
- Approval cards.
- Attachment previews and message actions.

Use structured renderers for Dramora-specific outputs such as project summaries, character profiles, scene breakdowns, story decisions, and task/approval results. Avoid turning every structured result into a long markdown response.

### 5.6 Attachments

Assistant UI's built-in attachment handling can use in-memory base64 data URLs, which are not appropriate for large files. Use Dramora's existing upload path and Supabase Storage where applicable, then pass authenticated or signed references to the server. Do not move large audio/video files through chat payloads as base64.

Reference: https://www.assistant-ui.com/docs/guides/attachments

---

## 6. Supabase and database architecture

### 6.1 Supabase remains the backend

Do not replace Supabase, add a separate vector database, or introduce a hosted memory service that duplicates current capabilities.

Supabase PostgreSQL should continue to own user-linked application data, projects, threads/messages, creative documents, canonical story data, memory/source records, tasks/approvals, and vector chunks.

Reference: https://supabase.com/docs/guides/ai

### 6.2 Schema strategy

Inspect the deployed schema and repository migrations before proposing concrete migrations. Reuse current tables and relationships wherever possible.

Logical entities may include:
- Projects.
- Threads/conversations.
- Messages.
- Creative documents.
- Story entities (characters, locations, organizations, objects).
- Story facts/creative decisions.
- Tasks and approvals.
- Memory items.
- Knowledge/document chunks.
- Embedding processing status/jobs.

These are conceptual entities, not a mandate to create every table.

### 6.3 Retrieval chunk metadata

If the existing RAG design needs a chunk/index table, a chunk should be traceable and properly scoped. Candidate fields:

| Field | Purpose |
|---|---|
| `id` | Stable chunk identifier |
| `user_id` | Ownership/security scope |
| `project_id` | Project scope |
| `source_type` | Message, document, decision, entity, etc. |
| `source_id` | Canonical source record |
| `chunk_index` | Position within source |
| `content` | Normalized searchable text |
| `embedding` | pgvector embedding |
| `embedding_model` | Exact model/version |
| `content_hash` | Idempotency/change detection |
| `fts` | PostgreSQL full-text vector, if used |
| `metadata` | Non-authoritative supplemental attributes |
| timestamps | Lifecycle and freshness |

Use real foreign keys where feasible. Do not rely on JSON metadata for authorization or core filtering.

### 6.4 Embedding model compatibility

Historical notes mention `@cf/baai/bge-small-en-v1.5`, commonly associated with 384-dimensional embeddings. This is not verified as the current deployed model.

Rules:
- Verify exact live embedding model and actual vector length before schema changes.
- Record the exact model identifier/version for each index.
- Keep one compatible model/dimension per vector column/index.
- Never compare query vectors from one model with stored vectors from another.
- Do not silently change models in place.
- For model changes, use a controlled re-embedding migration: create a new index/version, backfill, validate, switch reads, then retire old vectors.
- Change models only when evaluation shows a meaningful improvement.

### 6.5 Vector indexing

Start with the simplest correct search. Exact nearest-neighbor search may be adequate at small scale. Add approximate indexing only when measurements justify it.

HNSW is a strong candidate when approximate search is needed, but it has memory/build tradeoffs. Selective filters can result in fewer returned rows because filtering may occur after candidate retrieval. pgvector 0.8.0 supports iterative scans to continue searching for enough filtered candidates.

References:
- https://supabase.com/docs/guides/ai/vector-indexes/hnsw-indexes
- https://github.com/pgvector/pgvector

Progression:
1. Confirm extension version and vector dimensions.
2. Measure exact-search latency and relevance.
3. Add HNSW only when justified.
4. Add B-tree indexes for common ownership/project/source filters.
5. Add GIN indexes for full-text search.
6. Tune iterative scans where filters underfill results.
7. Validate query plans using `EXPLAIN (ANALYZE, BUFFERS)`.
8. Consider partitioning only when data scale and query patterns justify it.

### 6.6 Hybrid search

Dramora needs semantic and keyword search:

- Semantic search finds conceptually related material.
- Full-text search helps with exact names, phrases, and terminology.
- Hybrid search combines the two and fuses rankings.

Supabase documents hybrid search using PostgreSQL `tsvector`, pgvector similarity, and Reciprocal Rank Fusion (RRF).

Reference: https://supabase.com/docs/guides/ai/hybrid-search

Recommended baseline:
- Run semantic and full-text retrieval with identical user/project scope.
- Fuse rankings using RRF.
- Preserve source IDs and metadata.
- Deduplicate overlapping chunks.
- Apply a bounded result count.
- Include approval/canon status and freshness in source policy.
- Add a reranker only if evaluation proves the quality improvement is worth the latency/cost.

---

## 7. RAG system design

### 7.1 Objective

RAG should provide the Showrunner with relevant project knowledge without inserting the entire project history into every prompt.

Use cases include:
- Recalling an approved character detail.
- Finding the event that established a conflict.
- Retrieving a decision from a previous session.
- Identifying the current synopsis version.
- Detecting a possible contradiction in a new scene.
- Finding unresolved pre-production tasks.

RAG is not the authority for every fact. Exact structured facts should be loaded from relational records.

### 7.2 Ingestion pipeline

Use one consistent ingestion path for eligible sources:

1. **Source selection:** approved creative documents, relevant conversation turns, decisions, project notes, and structured entity descriptions.
2. **Normalization:** clean text while preserving headings, labels, speaker identity, and source references.
3. **Eligibility:** exclude transient UI state, secrets, irrelevant small talk, raw tool noise, and unapproved speculation unless explicitly marked as useful.
4. **Chunking:** split on semantic boundaries such as headings, scene sections, character sections, and decision records. Avoid splitting meaningful facts.
5. **Metadata:** attach user, project, source type, source ID, version, timestamps, approval/canon status, and visibility.
6. **Hashing:** calculate content hashes to avoid redundant embedding work.
7. **Embedding:** generate vectors using the configured model.
8. **Persistence:** upsert chunks and embeddings in Supabase.
9. **Lifecycle:** replace chunks when sources change; remove/tombstone chunks when sources are deleted.
10. **Observability:** track processing status, retries, errors, and source versions without unnecessarily logging private content.

Ingestion must be idempotent: retries must not create duplicate chunks.

### 7.3 Retrieval pipeline

For each user request:

1. Resolve authenticated user and active project.
2. Decide whether the request needs project retrieval, user-level memory, exact structured data, or no retrieval.
3. Load the active project's current structured state.
4. Build a query using the request and only the minimum necessary conversational context.
5. Generate a query embedding with the same model/version as the target index.
6. Run scoped semantic and full-text search.
7. Fuse ranked results using RRF.
8. Apply source authority policy.
9. Deduplicate overlapping chunks and sources.
10. Build a token-budgeted context pack.
11. Return source IDs/provenance.
12. Pass context to the Showrunner with explicit instructions about how to treat it.

### 7.4 Scope and authorization

Every retrieval operation must be scoped by the authenticated user. Project retrieval must also be scoped to the active project and verify access.

RLS must protect underlying rows. RPC functions must not bypass authorization. If a `SECURITY DEFINER` function is required, use a fixed safe `search_path`, explicit ownership checks, minimal grants, and review. A caller-supplied `user_id` is not proof of identity.

Reference: https://supabase.com/docs/guides/ai/rag-with-permissions

Cross-project leakage tests are mandatory. A query from Project A must never retrieve private Project B content, even when semantic similarity is high.

### 7.5 Ranking and authority

A highly similar old draft must not outrank a newer approved story decision simply because its wording matches.

Ranking/policy should consider:
- Semantic and keyword relevance.
- Active project scope.
- Approval/canon status.
- Source type/reliability.
- Version/currentness.
- Timestamp/recency where appropriate.
- Explicit supersession/conflict relationships.

Proposed authority order:
1. Explicitly approved current canon/decision.
2. Current structured project state.
3. Current approved creative document.
4. Current project notes.
5. Relevant conversation history.
6. Older drafts and superseded material.

Confirm this policy against current product behavior before implementation.

### 7.6 Context pack

The context builder should return bounded structured data, conceptually:

```ts
type ShowrunnerContext = {
  activeProject: ProjectSummary;
  currentConversation: ConversationWindow;
  canonicalFacts: CanonicalFact[];
  relevantSources: RetrievedSource[];
  openTasks: TaskSummary[];
  unresolvedApprovals: ApprovalSummary[];
  conflicts: ContextConflict[];
};
```

Do not blindly concatenate raw records. Include source identity, status, and provenance. Clearly distinguish facts from suggestions and retrieved historical material.

### 7.7 Evaluation

Build a curated evaluation set before tuning retrieval:
- Exact character-name questions.
- Approved decision questions.
- Facts only present in older sessions.
- Facts only present in current documents.
- Similar wording across multiple projects.
- Conflicts between old and new versions.
- Questions with no answer in the project.
- Cross-project isolation cases.
- Deleted/superseded source cases.

Measure recall@k, precision/relevance, source correctness, latency, and unsupported-claim rate. Human review of creative correctness is required; vector metrics alone are insufficient.

---

## 8. Showrunner intelligence and memory governance

### 8.1 Separate context classes

| Context type | Lifetime | Example |
|---|---|---|
| Current turn | One request | Latest instruction |
| Conversation window | Current thread | Recent dialogue and intent |
| Project working state | Across sessions | Synopsis, characters, open plot points |
| Approved canon | Durable until changed | Backstory, world rules, approved ending |
| Creative decision history | Durable/auditable | Decision, approver, date, superseded item |
| User-level preferences | Across projects where appropriate | Preferred writing format |

Do not mix user preferences and project facts. Do not silently infer or store sensitive personal information.

### 8.2 Memory write policy

Do not automatically promote every model-generated statement into durable memory.

Persist when:
- The user explicitly approves a fact or decision.
- The user directly asks Dramora to remember it.
- A defined workflow confirms a structured record should be created.
- An extraction is presented for user confirmation before becoming canon.

Durable items should include provenance, scope, status (proposed/approved/superseded/rejected), confidence where relevant, timestamps, approval source, and supersession/conflict links.

Users must be able to correct or remove stored facts. Corrections update canonical data and trigger retrieval-index refresh.

### 8.3 Conflict handling

When new content conflicts with approved canon:
- Do not silently overwrite canon.
- Identify the conflict.
- Determine whether the user intends a revision, alternate version, or mistake.
- Ask for confirmation if intent is ambiguous.
- If approved, update canonical data and mark the prior record superseded.
- Refresh affected retrieval chunks.

The newest statement is not automatically the most authoritative.

### 8.4 Showrunner behavior

The Showrunner should:
- Use active project context first.
- Retrieve only within authorized scope.
- Identify sources when useful.
- Say when information is not established.
- Distinguish canon from suggestions.
- Avoid inventing missing facts.
- Flag continuity conflicts constructively.
- Ask the most important clarification when blocked.
- Avoid dumping large amounts of history into responses.
- Keep creative control with the user.

### 8.5 Orchestration stages

1. Request validation and authentication.
2. Intent/task classification.
3. Active project/thread resolution.
4. Structured project-state loading.
5. Context retrieval, only when needed.
6. Conflict detection.
7. Prompt/context assembly.
8. Model selection and generation.
9. Tool execution under server-side authorization.
10. Approval handling for consequential actions.
11. Message persistence and stream completion.
12. Optional memory/decision extraction under the write policy.
13. Retrieval-index refresh when canonical sources change.

Keep these as testable modules in the existing application unless separate services are justified.

---

## 9. Tools and structured UI

### 9.1 Product tools

Only expose actions that the current product supports. Potential categories:

- Read project overview.
- Read current synopsis/treatment.
- Search project knowledge.
- Read character/story entity details.
- List open tasks.
- Read pending approvals.
- Propose a story decision.
- Save a draft document.
- Create/update a task.
- Record an approved decision.

Each tool needs a narrow schema, explicit description, server-side authorization, validation, and predictable output.

### 9.2 Read vs mutation tools

Separate read-only tools from mutation tools. Read-only tools may run automatically after authorization. Actions that change canon, delete data, overwrite documents, or mutate project state should require explicit approval unless the user clearly authorized that action in the current workflow.

Never expose arbitrary SQL, arbitrary URLs, shell commands, or unrestricted database mutations to the model.

### 9.3 Structured results

Prefer structured data and native renderers for:
- Character cards.
- Story-decision proposals and approval controls.
- Scene outlines.
- Task cards.
- Continuity warnings.
- Project summaries.

Assistant UI supports tool and generative UI patterns. Use them to render Dramora-specific objects, not to add tools merely for demonstration.

---

## 10. Conversation and streaming reliability

Preserve the current conversation model and make the Assistant UI adapter fit it.

Required behavior:
- New threads receive stable server-backed IDs.
- Refresh restores messages.
- Project navigation cannot attach the wrong thread.
- Streaming responses persist consistently.
- Stop/cancel terminates generation and leaves a valid message state.
- Retry does not duplicate user messages or corrupt threads.
- Failed responses can be retried without losing user input.
- Partial/incomplete assistant output is represented accurately.
- Rename/archive/restore/delete behavior remains intact.
- URL and selected project/thread remain synchronized.
- Tool calls and approvals survive reload where promised by the product.

Do not add resumable-stream infrastructure unless the current implementation demonstrates a need.

---

## 11. Voice input continuity

Voice transcription is not media generation. Preserve the existing Phase 2 voice workflow if it is already merged and deployed.

Historical notes describe:
- Authenticated `/api/transcribe`.
- Cloudflare Workers AI Whisper Large v3 Turbo.
- Validation and bounded upload size/duration.
- No permanent audio storage as part of the transcription request.
- Retry after transcription failure.
- A failed/empty transcript must not be submitted as valid text.

These are historical notes, not production verification. Confirm the actual PR/commit, route, model binding, limits, logs, and any required Supabase function deployment before changing this area.

---

## 12. Security and privacy

Security is a release requirement.

- Enforce authentication on every private route.
- Verify user/project/thread ownership server-side.
- Apply RLS to all user- and project-scoped tables.
- Ensure RPCs and privileged functions explicitly enforce ownership.
- Keep service-role keys and provider secrets server-only.
- Use signed URLs or authenticated storage access for private assets.
- Validate user input and tool arguments with schemas.
- Rate-limit expensive model and embedding requests.
- Bound file size, content type, duration, and request size.
- Avoid logging private prompts/documents/transcripts unnecessarily.
- Treat retrieved project documents as untrusted content, not system instructions.
- Defend against prompt injection in uploaded/retrieved material.
- Do not let retrieved text expand tool permissions.
- Require approval for destructive and canon-changing actions.
- Maintain audit trails for important mutations.
- Define retention/deletion behavior for messages, project content, memory, and derived embeddings.

RAG security tests must prove private content cannot cross user or project boundaries.

---

## 13. Performance, cost, and observability

### 13.1 Avoid unnecessary model work

- Do not embed the entire conversation on every request.
- Do not retrieve project knowledge for trivial requests.
- Use a bounded recent conversation window.
- Load structured project state selectively.
- Cache only safe, scoped, invalidatable data.
- Avoid duplicate model calls where a deterministic application operation is sufficient.

### 13.2 Retrieval limits

Start conservatively and tune from evaluation:
- Bounded semantic top-k.
- Bounded full-text top-k.
- RRF merge and deduplication.
- Token budget for retrieved context.
- Maximum source count and chunk size.
- Centralized configuration rather than scattered constants.

Exact values depend on the actual model context window, content volume, and measured latency.

### 13.3 Observability

Capture privacy-conscious structured metrics:
- Request/model latency.
- Retrieval latency.
- Retrieved chunk/source counts.
- Embedding latency and failures.
- Token usage where available.
- Tool and approval outcomes.
- Retrieval feedback.
- Stream cancellation/failure rates.
- Database query latency.
- Authorization denials.

Use request/correlation IDs. Do not log secrets or duplicate private content in logs.

---

## 14. Testing and acceptance criteria

### 14.1 Existing product regression

- Login/session behavior works.
- Project routes load.
- Thread list and active thread behavior work.
- Refresh restores the correct project/conversation.
- Rename/archive/restore works.
- Composer and mode selector work.
- Existing model selection/fallback works.
- Message rendering remains correct.
- Existing asset display/browsing remains intact if present.
- Voice transcription/retry works if part of the release.

### 14.2 Assistant UI

- Runtime adapter matches installed package versions and current backend protocol.
- Dramora backend remains authoritative.
- Supabase remains persistence.
- No duplicate thread/message store.
- Messages round-trip without losing metadata/tool parts.
- Streaming, stop, retry, and errors work.
- Structured renderers work on desktop and mobile.
- Unrelated workspace screens are not redesigned without approval.

### 14.3 RAG

- Exact project facts retrieve correctly.
- Semantic queries find relevant project material.
- Exact names/phrases work through full-text search.
- Hybrid retrieval is evaluated against both individual methods.
- Approved/current canon outranks superseded drafts as policy requires.
- Updated sources replace stale chunks.
- Deleted sources are no longer retrievable.
- Repeated ingestion creates no duplicates.
- Embedding model/dimensions are consistent.
- Unknown answers are not fabricated.
- Retrieved sources include provenance.

### 14.4 Security

- User A cannot retrieve User B's data.
- Project A cannot retrieve Project B's private data.
- Unauthenticated requests cannot access private data.
- Forged user/project IDs cannot bypass ownership.
- RPC/service-role pathways are reviewed.
- Retrieved prompt injection cannot authorize tools or override system policy.
- Destructive and canon-changing tools enforce approval.

### 14.5 Performance and migration

- Record baseline latency before optimization.
- Measure retrieval separately from model latency.
- Justify indexes with query plans/workload.
- Test filtered vector search with representative project scopes.
- Bound conversation/retrieval payloads.
- Prefer additive migrations.
- Make backfills restartable and idempotent.
- Document rollback/recovery.
- Verify production schema after deployment.
- Do not run destructive migrations without explicit review and backup strategy.

---

## 15. Implementation roadmap

This is a proposed sequence, not authorization to begin coding.

### Phase 0 — Correct source and production audit

- Identify the actual source repository or restore the current app source to this repository.
- Record main commit and merged PR state.
- Inspect app packages, routes, UI, chat runtime, and persistence.
- Inspect Supabase schema, RLS, migrations, RPCs, and vector dimensions.
- Verify production domains/deployments.
- Confirm Phase 2 voice status.
- Update the verified assessment in this document.

**Exit gate:** user reviews the real-state inventory and approves the implementation plan.

### Phase 1 — Architecture alignment

- Select Assistant UI runtime based on actual package versions/protocol.
- Map existing thread/message persistence to Assistant UI.
- Confirm canonical data ownership.
- Document existing RAG flow and measurable failure modes.
- Add regression tests before changing behavior.

**Exit gate:** an integration plan proves existing data/routes will be preserved.

### Phase 2 — Assistant UI integration

- Install compatible packages/components only.
- Integrate into bounded workspace areas.
- Preserve existing app shell/navigation and product-specific workflows.
- Connect to the existing backend.
- Map persistence to existing Supabase records.
- Add structured renderers where useful.

**Exit gate:** regression suite passes and existing threads round-trip.

### Phase 3 — RAG improvements

- Reuse/refactor existing retrieval.
- Normalize source ingestion and chunk lifecycle.
- Verify embedding model/dimensions.
- Improve hybrid search and RRF.
- Enforce user/project scope.
- Add provenance/source authority.
- Build and run RAG evaluation.

**Exit gate:** relevance, freshness, isolation, and performance meet agreed criteria.

### Phase 4 — Showrunner memory/decision governance

- Separate transient context, project state, canon, and user preferences.
- Add explicit approval/provenance for durable creative decisions.
- Add conflict detection and supersession.
- Integrate the context builder.
- Add structured outputs and controlled tools.

**Exit gate:** approved decisions remain stable; conflicts are surfaced, not silently overwritten.

### Phase 5 — Reliability and production hardening

- Complete streaming/cancel/retry tests.
- Verify voice workflow if included.
- Run RLS/security tests.
- Run query-plan/performance tests.
- Verify deployment/logs.
- Update this same blueprint with outcomes and deviations.

**Exit gate:** production acceptance checklist passes.

---

## 16. Decisions for blueprint review

1. Integrate Assistant UI into the current workspace while preserving the outer Dramora shell unless a broader redesign is explicitly approved.
2. Choose the runtime adapter only after inspecting package versions and the current chat protocol.
3. Use existing Supabase thread/message tables; do not make Assistant Cloud a dependency.
4. Improve the existing RAG implementation; do not create a parallel retrieval stack.
5. Approved creative decisions outrank unapproved generated text and superseded drafts.
6. Retain the current embedding model unless evaluation justifies a change; verify exact ID/dimensions first.
7. Use exact vector search while scale permits; introduce/tune HNSW based on measurements.
8. Require confirmation for destructive operations and changes to approved canon.
9. Keep image and video generation out of this initial implementation.
10. Preserve Phase 2 voice behavior, after verifying its actual merged/deployed state.
11. Do not begin implementation until the correct source repository and live database state are inspectable.

---

## 17. Research references

### Assistant UI
- Architecture: https://www.assistant-ui.com/docs/architecture
- Runtime selection: https://www.assistant-ui.com/docs/runtimes/pick-a-runtime
- Custom runtime patterns: https://www.assistant-ui.com/docs/runtimes/custom/overview
- AI SDK runtime overview: https://www.assistant-ui.com/docs/runtimes/ai-sdk/overview
- AI SDK v7: https://www.assistant-ui.com/docs/runtimes/ai-sdk/v7
- Custom thread persistence: https://www.assistant-ui.com/docs/integrations/persistence/custom-adapter
- Attachments: https://www.assistant-ui.com/docs/guides/attachments

### Supabase and pgvector
- AI & Vectors: https://supabase.com/docs/guides/ai
- Semantic search: https://supabase.com/docs/guides/ai/semantic-search
- Hybrid search: https://supabase.com/docs/guides/ai/hybrid-search
- HNSW indexes: https://supabase.com/docs/guides/ai/vector-indexes/hnsw-indexes
- RAG with permissions: https://supabase.com/docs/guides/ai/rag-with-permissions
- Automatic embeddings: https://supabase.com/docs/guides/ai/automatic-embeddings
- pgvector: https://github.com/pgvector/pgvector

---

## 18. Final recommendation

Dramora should evolve as a project-aware AI writing and pre-production workspace. Assistant UI should improve the interaction layer, Supabase should remain the system of record, pgvector should support scoped retrieval, and a governed Showrunner context pipeline should protect story continuity.

The highest-priority issue is not a technology choice: it is locating the real application source. The connected repository currently contains no application code, so a source-level implementation assessment cannot honestly be completed yet.

**No implementation should begin until:**
1. The correct application repository/source is accessible.
2. The current app and deployed Supabase schema have been inspected.
3. The verified-state assessment has been added to this document.
4. The user has reviewed and approved the blueprint and implementation sequence.
