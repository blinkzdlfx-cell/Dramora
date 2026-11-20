# DRAMORA — Technical Blueprint

**Status:** Revised after the November 20, 2026 fresh-start clarification  
**Purpose:** Architecture and implementation plan for review before coding  
**Repository:** `blinkzdlfx-cell/dramora`

---

## 1. Executive summary

Dramora is being rebuilt from a clean foundation. The previous GitHub repository/source, Supabase project, and Cloudflare resources were deleted as part of the reset. The current repository therefore does not contain the old application implementation, and the old backend/schema must not be treated as the starting point.

The new Dramora product has two principal work areas:

1. **AI Video Studio** — help users plan and prepare AI-video projects, research external video-generation platforms, understand their capabilities and workflows, and create platform-matched production materials. Dramora itself does not generate images or videos.
2. **Film Studio** — support movie development and production writing, including ordinary scriptwriting, story development, and creation/management of project documents. Users may optionally export selected project materials as ZIP files.

The application is a workspace and creative-production tool, not a general-purpose autonomous creative agent. The architecture must be designed around the two studios, project workspaces, reliable AI assistance, research, writing, documents, and exports.

**No implementation is authorized by this document.** The user must review and approve the blueprint before implementation begins.

## 2. Verified fresh-start decisions

The following decisions come from the user's November 20, 2026 clarification and prior planning conversation.

- The previous Dramora GitHub repository/source was deleted.
- The previous Supabase project was deleted.
- Previous Cloudflare resources were deleted.
- The project is starting afresh; old application code, database tables, migrations, embeddings, and deployment assumptions are not a baseline.
- Product scope is limited to **AI Video Studio** and **Film Studio**.
- Film Studio supports movie-related AI work, ordinary scriptwriting, and documents.
- ZIP export is optional.
- Dramora does **not** generate images.
- Dramora does **not** generate videos.
- External video-generation platforms are to be researched through web search, with guidance and workflows matched to the selected platform.
- The accepted frontend direction is React + Vite, Tailwind CSS, shadcn/ui, and assistant-ui.
- Supabase is the planned application backend.
- Cloudflare is the planned deployment/edge platform.
- npm is the package manager.
- LangGraph is under consideration, subject to a compatibility and necessity assessment before adoption.
- A feature-based architecture is preferred.
- The final folder structure remains undecided until the architecture research and dependency assessment are complete.

These decisions supersede historical notes about the previous Dramora implementation.

## 3. Product definition and boundaries

### 3.1 AI Video Studio

The AI Video Studio helps users prepare AI-video work without pretending that Dramora is itself a video or image generator.

Planned capabilities:
- Create and manage video projects.
- Help develop concepts, scenes, shot plans, prompts, and production instructions.
- Research external video-generation tools and their current capabilities using web search.
- Match a user's task to the workflow and constraints of the relevant external platform.
- Produce platform-specific prompts, shot breakdowns, and workflow instructions.
- Keep research results and generated text artifacts associated with the relevant project.
- Clearly identify which steps happen inside Dramora and which require an external platform.

Not included:
- Native image generation.
- Native video generation.
- A hidden or simulated generation action that implies Dramora has generated media when it has only prepared a prompt or workflow.

External platform information is time-sensitive. The application should distinguish verified current platform information from general guidance, identify the platform/source, and avoid claiming support for features that have not been checked.

### 3.2 Film Studio

The Film Studio supports movie development and writing work.

Planned capabilities:
- Project and film organization.
- Idea and concept development.
- Story, character, setting, and plot development.
- Conventional screenplay/scriptwriting.
- AI-assisted writing and revision.
- Creation and editing of project documents.
- Saving, organizing, and retrieving project materials.
- Optional export of selected documents and project materials as a ZIP archive.

The user remains the authority over creative decisions. The application should not silently replace or discard approved writing.

### 3.3 Shared workspace capabilities

The two studios may share foundational capabilities where appropriate:
- Authentication and user-owned workspaces.
- Projects and project settings.
- Conversations and message history.
- AI model/provider configuration.
- Document and artifact management.
- Search and research records.
- Export jobs and downloadable results.
- Notifications, loading, error, retry, and recovery states.

Shared capabilities should be implemented once and exposed through clear feature boundaries. Do not create a generic abstraction before at least two real use cases require it.

### 3.4 Explicit exclusions

The following are outside the current product scope:
- An autonomous all-purpose creative-director product or subsystem outside the two defined studios.
- Native image generation.
- Native video generation.
- Rebuilding or migrating the deleted application's old implementation.
- Reusing old database schemas, old migrations, old vector indexes, or old embeddings without a new explicit review.
- Unrequested studios or unrelated product modules.

## 4. Existing implementation assessment

### 4.1 Current GitHub repository

The connected repository `blinkzdlfx-cell/dramora` was inspected during blueprint preparation. Its initial history contained only the repository foundation files (including `.gitignore` and `LICENSE`); the application source was not present. The blueprint itself was added to this repository for planning.

This is consistent with the declared fresh start. It is not evidence that the old application still exists in this repository.

### 4.2 Backend and deployment baseline

The previous Supabase project and Cloudflare resources were deleted by the user. Therefore:
- Do not query, modify, or assume the old Supabase project as Dramora's active backend.
- Do not assume old Cloudflare Worker names, bindings, routes, secrets, or deployments are active.
- Do not refer to old production URLs as current deployment targets.
- Create and verify new resources only when the user is ready to set them up and approves the relevant steps.
- Keep all credentials and secrets out of Git.

### 4.3 Assessment conclusion

There is no existing application implementation to audit in the fresh repository. The work is a new implementation guided by the approved product scope and this blueprint. The first engineering task, after approval, is to establish the foundation and verify each newly created service integration.

## 5. Proposed technology direction

| Area | Planned direction | Gate / qualification |
|---|---|---|
| Frontend | React + Vite | Confirm current stable versions and deployment/build compatibility |
| Language | TypeScript | Strict type checking for application code |
| Styling | Tailwind CSS | Use utility-first styling; keep custom CSS minimal |
| UI primitives | shadcn/ui | Use accessible, composable components |
| AI conversation UI | assistant-ui | Verify compatibility with the selected AI runtime and current package versions |
| Backend | Supabase | New project; define schema and RLS from the new product requirements |
| Database | Supabase PostgreSQL | Relational source of truth for projects, conversations, documents, and jobs |
| Authentication | Supabase Auth | Choose supported sign-in methods during setup |
| File storage | Supabase Storage | Private buckets and authorized access by default |
| Edge/deployment | Cloudflare | Select Pages/Workers architecture after validating Vite and backend integration needs |
| Package manager | npm | Commit lockfile and use reproducible installs |
| Agent orchestration | LangGraph, conditional | Adopt only if a concrete multi-step stateful workflow needs it and compatibility is verified |
| Search/research | Server-side web-search integration | Provider and quotas must be assessed; never expose API keys in the browser |
| ZIP export | Server-side export job | Optional feature; enforce authorization and resource limits |

This is a direction, not a claim that every dependency or service has already been created or connected.

## 6. Application architecture

### 6.1 Architectural principles

- Feature-based organization around AI Video Studio and Film Studio.
- Shared platform services for authentication, projects, AI runtime, persistence, files, search, and exports.
- Clear separation between browser UI and trusted server-side operations.
- Supabase remains the system of record for durable application data.
- AI responses are not automatically treated as saved project facts or approved documents.
- External research is stored with source metadata and retrieval time.
- Do not introduce a workflow engine, vector database, queue, or additional service without a demonstrated requirement.
- Build for refresh safety, resumable navigation, clear failure states, and recoverable user work.

### 6.2 Logical structure

The following is a conceptual boundary map, not the final folder tree:

- **Application shell:** routing, authentication boundaries, global layout, navigation.
- **Workspace:** project selection, project overview, shared project settings.
- **AI Video Studio:** video project workflows, platform research, prompt and shot-plan artifacts.
- **Film Studio:** story development, screenplay editor, writing conversations, documents.
- **AI interaction:** assistant-ui presentation, model/provider adapters, streaming and tool calls.
- **Research:** web search, source capture, source display, freshness and verification.
- **Documents:** create, edit, version, organize, and retrieve project artifacts.
- **Exports:** optional ZIP assembly, job status, download authorization.
- **Shared services:** Supabase access, validation, authorization, telemetry, error handling.

Do not finalize the directory tree until package compatibility, routing, data ownership, and server execution requirements have been checked.

### 6.3 Frontend and server boundaries

The browser may render UI and perform appropriately scoped authenticated requests. Privileged operations must run in trusted server-side code, including:
- AI provider calls when credentials are secret.
- Web-search provider calls when credentials are secret.
- Ownership and permission checks for mutations and downloads.
- ZIP assembly and temporary export-file handling.
- Any operation that uses service-role credentials.

Never ship Supabase service-role keys, model-provider secrets, or search-provider secrets to the client bundle.

## 7. AI interaction and orchestration

### 7.1 assistant-ui

assistant-ui is the planned conversation UI layer. It should provide the user-facing interaction experience, not become the database or application backend.

Before implementation:
1. Inspect the current assistant-ui documentation and package versions.
2. Verify the supported React version and runtime integration.
3. Choose a runtime that fits the selected AI backend and streaming protocol.
4. Confirm tool-call, attachment, message persistence, and custom component support.
5. Build a small compatibility proof before integrating it across both studios.

Do not assume a specific assistant-ui runtime or AI SDK version until the compatibility check is complete.

### 7.2 LangGraph decision gate

LangGraph is a candidate, not a mandatory dependency.

Use it only if Dramora requires durable, stateful, multi-step workflows such as:
- A research process that searches, verifies, compares, and produces a structured platform recommendation.
- A multi-stage writing workflow that needs explicit state, checkpoints, branching, and resumability.
- A workflow that must pause for user approval and continue from a saved state.

Do not use LangGraph merely to send a prompt to a model or stream a normal chat response. For simple requests, a direct server-side model call is easier to maintain.

Before adopting LangGraph, verify:
- Compatibility with the chosen JavaScript/TypeScript runtime.
- Compatibility with Cloudflare's execution constraints and any required persistence/checkpointing.
- Whether its persistence model can use the selected backend cleanly.
- Bundle size, operational complexity, and local-development requirements.
- Whether the same workflow can be implemented more simply with ordinary application services.

The decision must be documented before adding the dependency.

### 7.3 Model/provider abstraction

Keep provider-specific code behind a small server-side adapter boundary. The application should be able to:
- Identify the active provider and model.
- Validate supported capabilities.
- Stream responses where supported.
- Normalize provider errors.
- Apply timeouts and request limits.
- Record safe usage metadata without logging secrets or private prompt content unnecessarily.

Do not build a large multi-provider framework before there are multiple real providers to support.

### 7.4 Tool use

AI tools should be narrowly scoped and validated server-side. Likely tool categories include:
- Project/document lookup.
- Project document creation or update, with explicit authorization.
- External platform research.
- Structured script or production-document operations.
- Export request creation and status lookup.

Read-only tools should be separated from mutation tools. Any destructive or consequential document operation must be guarded by application authorization and an appropriate user confirmation flow.

## 8. Data and persistence design

### 8.1 Data-model approach

Design a new schema from the current product requirements. Do not carry over old table names or assumptions.

Likely conceptual entities:
- Users and profiles (with Supabase Auth as identity authority).
- Projects.
- Project membership or ownership, if collaboration is later included.
- Studio-specific project metadata.
- Conversations.
- Messages.
- Documents and document versions.
- Research queries and source records.
- Export jobs and export artifact metadata.
- Optional AI usage and operational event records.

These are conceptual entities, not an approved migration or final schema. Normalize only where it improves correctness and maintainability.

### 8.2 Source of truth

- Supabase PostgreSQL is the canonical source for durable project and workspace data.
- Supabase Storage holds uploaded files and generated export archives where needed.
- Conversation messages are persisted independently of transient UI state.
- Documents are canonical project artifacts; chat output is not a document until the user saves or explicitly creates one.
- Research records preserve source URL, title, retrieval timestamp, and relevant extracted content or summary.
- Export archives are derived artifacts and can be regenerated from authorized source documents.

### 8.3 Persistence and refresh behavior

The application must preserve:
- Authentication state through supported Supabase session handling.
- Current project and studio route.
- Conversation history and message order.
- Saved documents and their latest versions.
- Export job status.
- In-progress operations where safe and technically feasible.

A page refresh must not silently discard saved work. Unsaved editor changes need a clear save/autosave policy and visible save state.

### 8.4 Row Level Security

Enable and test Row Level Security for user-owned data. Every read and write must be scoped to the authenticated user and authorized project. Never rely only on hidden UI controls for authorization.

Tests must verify that one user cannot access another user's projects, conversations, documents, research records, or exports by changing an identifier.

### 8.5 Storage

Use private storage buckets by default. Use short-lived signed URLs or authorized server-side downloads. Validate file type, size, ownership, and storage path. Avoid public buckets for private project materials.

### 8.6 Vector search and RAG

Do not add pgvector, embeddings, or a RAG pipeline automatically at project initialization.

First establish whether users need semantic retrieval across long project documents and whether ordinary PostgreSQL search is insufficient. If semantic retrieval is justified:
- Select and verify an embedding model and vector dimensions.
- Store embeddings as derived data, not as canonical project truth.
- Scope retrieval by authenticated user and project.
- Preserve document/source provenance and version information.
- Evaluate retrieval quality with representative Dramora tasks before production use.

The deleted project's embedding model, dimensions, vectors, and retrieval functions are not to be reused by assumption.

## 9. External video-platform research

This is a defining capability of the AI Video Studio.

### 9.1 Research behavior

When a user asks how to perform a task on an external AI-video platform, Dramora should:
1. Identify the requested outcome and constraints.
2. Search current, relevant platform documentation and trustworthy sources.
3. Verify whether the platform supports the requested workflow.
4. Explain the steps in the correct platform context.
5. Adapt prompts and production instructions to that platform's actual input model.
6. Cite or display sources and indicate when the information was retrieved.
7. State uncertainty where documentation is incomplete.

### 9.2 Research quality

- Prefer official platform documentation for feature and workflow claims.
- Use independent sources only as supplementary evidence.
- Do not invent platform capabilities, parameter names, limits, or UI controls.
- Treat pricing, model availability, duration limits, and feature support as volatile.
- Re-check time-sensitive details when the user asks for current guidance.
- Keep research provider credentials on the server.

### 9.3 Platform-neutral project data

Store reusable creative intent separately from platform-specific execution details. For example, a scene concept or shot description can be represented independently, then adapted into a platform-specific prompt or workflow. This avoids locking the entire project to one vendor.

## 10. Documents and ZIP exports

### 10.1 Document handling

Documents should be first-class project artifacts:
- Clearly named and associated with a project.
- Editable and persistently saved.
- Versioned or recoverable according to the approved versioning policy.
- Searchable within the user's authorized project scope.
- Distinguishable from transient chat messages and research citations.

Define supported document types and editor behavior before implementation.

### 10.2 Optional ZIP export

ZIP export is optional and should follow the core project/document workflow.

A secure export flow should:
1. Accept an explicit project and selected export contents.
2. Verify user and project authorization server-side.
3. Collect only the selected, accessible artifacts.
4. Sanitize archive paths and filenames.
5. Apply file-count and archive-size limits.
6. Assemble the archive in a trusted server-side environment.
7. Store it privately or stream it through an authorized download route.
8. Apply expiry and cleanup rules to temporary export artifacts.

Do not expose storage paths or permanent public links to private archives.

## 11. Conversation, streaming, and reliability

- Persist user and assistant messages with stable identifiers and ordering.
- Handle streaming interruptions without duplicating messages.
- Distinguish pending, streaming, completed, failed, and cancelled states.
- Provide retry behavior that does not accidentally submit duplicate mutations.
- Restore the conversation after refresh.
- Surface provider errors in understandable form while retaining safe diagnostic details server-side.
- Apply request timeouts, payload limits, and rate limits.
- Ensure route changes do not corrupt the selected project or active conversation.

Streaming protocol and persistence implementation must be selected after the assistant-ui/runtime compatibility test.

## 12. Security and privacy

- Supabase RLS for all user-owned records.
- Server-side validation for every mutation and tool call.
- Server-only storage of privileged credentials.
- Private project file storage by default.
- Authorization checks on signed URLs and export downloads.
- Input validation and upload limits.
- Rate limiting and abuse controls on AI and search endpoints.
- Safe logging that avoids secrets, access tokens, and unnecessary private content.
- Explicit separation of user content, retrieved research, and model-generated suggestions.
- No cross-user or cross-project retrieval.
- No silent destructive edits to user documents.

## 13. Performance, cost, and observability

- Prefer direct model calls for simple tasks; use orchestration only when justified.
- Avoid repeating web searches when a recent, reusable result is still valid, while rechecking volatile facts when needed.
- Keep retrieved context bounded and project-scoped.
- Set model and search timeouts, token/output limits, and request limits.
- Track latency, errors, token usage where available, search usage, export failures, and storage growth.
- Do not log credentials or full private documents by default.
- Establish Cloudflare resource and runtime limits during deployment design.
- Use the simplest service configuration that meets the actual workload and free/low-cost constraints.

## 14. Testing and acceptance criteria

### 14.1 Product scope
- Only AI Video Studio and Film Studio are present in the approved initial scope.
- No image-generation or video-generation feature is exposed or implied.
- AI Video Studio provides researched external-platform workflows, not native media generation.
- Film Studio supports ordinary scriptwriting and project documents.
- ZIP export is optional and works only for explicitly selected authorized materials.

### 14.2 Workspace and persistence
- Users can sign up, sign in, and sign out.
- Users can create and reopen projects.
- Projects, conversations, messages, and documents survive refresh.
- Users cannot access another user's records.
- Save and failure states are visible and recoverable.

### 14.3 AI interaction
- assistant-ui works with the chosen runtime and current package versions.
- Streaming, completion, error, cancellation, and retry states are tested.
- Provider secrets remain server-side.
- Tool calls are validated and authorized.
- LangGraph is included only if its decision gate is passed.

### 14.4 Research
- External platform guidance is supported by current sources.
- Unsupported claims and invented controls are avoided.
- Source metadata and retrieval time are available to the user.
- Platform-specific instructions are clearly distinguished from platform-neutral creative content.

### 14.5 Documents and exports
- Documents save to the correct project and can be reopened.
- Edits do not silently overwrite newer versions.
- ZIP export includes only selected authorized files.
- Export download access is protected and temporary artifacts are cleaned up.

### 14.6 Deployment
- Production build succeeds with the chosen Cloudflare setup.
- Environment variables and secrets are configured outside Git.
- Logs and error reporting are sufficient to diagnose failures without exposing sensitive content.

## 15. Implementation roadmap — subject to approval

### Phase 0 — Blueprint approval and setup verification
- User reviews and approves this blueprint.
- Confirm newly created GitHub, Supabase, and Cloudflare resources and their identifiers.
- Confirm domains and deployment target when ready.
- Record required environment variables without committing secret values.

### Phase 1 — Foundation
- Create the React + Vite + TypeScript application.
- Configure Tailwind CSS and shadcn/ui.
- Establish routing, app shell, feature boundaries, linting, type checking, and build checks.
- Connect the new Supabase project and implement authentication.
- Deploy a minimal verified foundation to Cloudflare.

### Phase 2 — Workspace and persistence
- Implement projects and studio navigation.
- Implement conversation persistence and document persistence.
- Add ownership policies and RLS tests.
- Verify refresh and route recovery.

### Phase 3 — AI interaction foundation
- Complete assistant-ui/runtime compatibility proof.
- Implement provider adapters and reliable streaming.
- Add project-aware context using authorized relational data.
- Decide whether LangGraph is needed for any specific workflow.

### Phase 4 — Film Studio
- Implement writing workflows and screenplay/document editing.
- Add save/version/recovery behavior.
- Test ordinary scriptwriting and document lifecycle end to end.

### Phase 5 — AI Video Studio
- Implement project planning and production artifacts.
- Implement external platform web research and source-grounded workflow guidance.
- Add platform-specific prompt/workflow adaptation.
- Verify that the application does not claim to generate images or videos.

### Phase 6 — Optional export and hardening
- Add ZIP export if approved after core documents are stable.
- Complete security, performance, accessibility, and production tests.
- Verify deployment, logs, limits, and recovery behavior.

No phase begins until the user approves the blueprint and the required setup gate.

## 16. Decisions still requiring review

1. Confirm this product definition: AI Video Studio + Film Studio only.
2. Confirm that native image and video generation remain excluded.
3. Confirm that the AI Video Studio's external-platform research and workflow-matching behavior is accurately represented.
4. Confirm the initial Film Studio writing and document capabilities.
5. Decide which document formats and editing experience are required for the first release.
6. Decide whether ZIP export belongs in the first release or a later phase.
7. Approve React + Vite, Tailwind, shadcn/ui, assistant-ui, Supabase, Cloudflare, and npm as the foundation.
8. Keep LangGraph conditional until a real workflow and compatibility test justify it.
9. Approve the feature-based architecture direction while leaving the exact folder structure open for the implementation design step.

## 17. Research and compatibility references

The following official documentation areas must be rechecked against current versions during implementation planning:

- assistant-ui installation, runtime architecture, custom persistence, tool integration, and attachments.
- React and Vite compatibility and production build requirements.
- Tailwind CSS and shadcn/ui setup for the selected Vite version.
- Supabase Auth, PostgreSQL, Row Level Security, Storage, and database migration guidance.
- Cloudflare's current Vite/React deployment options and runtime constraints.
- LangGraph JS/TS documentation and Cloudflare compatibility, only if LangGraph passes the decision gate.
- Official documentation for each external AI-video platform at the time the user requests a workflow.

Useful official references already consulted during the initial research include assistant-ui documentation and Supabase pgvector/hybrid-search documentation. Vector search remains optional and is not part of the initial baseline.

## 18. Final recommendation

Treat Dramora as a clean, new product build. Build the shared workspace foundation first, then deliver Film Studio and AI Video Studio as the two core product areas. Use assistant-ui for the interaction layer after compatibility verification, Supabase for durable application data and authorization, and Cloudflare for deployment. Keep LangGraph conditional. Make external video-platform research accurate and source-grounded. Keep documents first-class and ZIP export optional.

Do not restore old application assumptions or add excluded capabilities. Do not begin implementation until the user has reviewed and approved this revised blueprint.
