# DRAMORA — Technical Blueprint

**Status:** Approved consolidated architecture; implementation in progress (November 21, 2026)  
**Purpose:** Authoritative product and technical specification for implementation  
**Repository:** `blinkzdlfx-cell/dramora`

---

## 1. Executive summary

Dramora is being rebuilt from a clean foundation. The previous GitHub repository/source, Supabase project, and Cloudflare resources were deleted as part of the reset. The current repository therefore does not contain the old application implementation, and the old backend/schema must not be treated as the starting point.

The new Dramora product has two principal work areas:

1. **AI Video Studio** — help users plan and prepare AI-video projects, research external video-generation platforms, understand their capabilities and workflows, and create platform-matched production materials. Dramora itself does not generate images or videos.
2. **Film Studio** — support movie development and production writing, including ordinary scriptwriting, story development, and creation/management of project documents. Users may optionally export selected project materials as ZIP files.

The application is a workspace and creative-production tool built around one user-facing AI assistant: Dramora. Dramora coordinates understanding, planning, research, writing, and structured production workflows across the two studios. Deterministic application operations such as authentication, permissions, routing, and database authorization remain under application control.

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
- LangGraph is the desired orchestration foundation for Dramora's structured, stateful AI workflows. Its JavaScript/TypeScript runtime, Cloudflare compatibility, persistence/checkpointing, and operational constraints must be verified before implementation.
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
| AI orchestration | LangGraph JS/TS | Intended orchestration layer for structured multi-step workflows; verify runtime and checkpoint integration before rollout |
| Durable execution | Cloudflare Workflows | Background workflow execution, retries, persisted step state, and recovery; Supabase remains the canonical project/task record |
| PostgreSQL connectivity from Workers | Cloudflare Hyperdrive | Use the supported Hyperdrive connection path for LangGraph's Postgres checkpointer; do not connect with an unproxied raw Postgres connection |
| Search/research | Server-side web-search integration | Provider and quotas must be assessed; never expose API keys in the browser |
| ZIP export | Server-side export job | Optional feature; enforce authorization and resource limits |

This is a direction, not a claim that every dependency or service has already been created or connected.

## 6. Application architecture

### 6.1 Architectural principles

- Feature-based organization around AI Video Studio and Film Studio.
- Shared platform services for authentication, projects, AI runtime, persistence, files, search, and exports.
- Clear separation between browser UI and trusted server-side operations.
- Supabase remains the system of record for durable application data.
- AI responses are not automatically treated as approved project facts or documents; explicit user decisions and approved outputs become durable project context.
- Dramora should understand before it creates, plan before it executes, and preserve completed work as it progresses.
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

### 7.2 LangGraph orchestration foundation

The product direction is to use LangGraph as the orchestration foundation for Dramora's structured, stateful, multi-step workflows. It must not be treated as a reason to route every simple chat message through a heavyweight graph. Simple conversational turns may use a direct model call where appropriate, while workflows requiring planning, task state, checkpoints, branching, approvals, or resumability should use the orchestration layer.

Use LangGraph for workflows such as:
- A research process that searches, verifies, compares, and produces a structured platform recommendation.
- A multi-stage writing workflow that needs explicit state, checkpoints, branching, and resumability.
- A workflow that must pause for user approval and continue from a saved state.

Do not use LangGraph merely to send a prompt to a model or stream a normal chat response. For simple requests, a direct server-side model call is easier to maintain. Adoption is the intended direction, subject to the compatibility and runtime verification listed below.

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
- LangGraph workflows run reliably in the selected JavaScript/TypeScript and Cloudflare deployment model, with persistence and recovery verified.

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
8. Adopt LangGraph as the intended orchestration layer for structured workflows, subject to the runtime/checkpoint compatibility proof.
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

Treat Dramora as a clean, new product build. Build the shared workspace foundation first, then deliver Film Studio and AI Video Studio as the two core product areas. Use assistant-ui for the interaction layer after compatibility verification, Supabase for durable application data and authorization, and Cloudflare for deployment. Use LangGraph for structured AI workflows and Cloudflare Workflows for durable background execution, after the compatibility proof. Make external video-platform research accurate and source-grounded. Keep documents first-class and ZIP export optional.

Do not restore old application assumptions or add excluded capabilities. Do not begin implementation until the user has reviewed and approved this revised blueprint.


---

## 19. Authoritative product and interaction decisions — November 20, 2026

This section incorporates the latest user decisions and takes precedence over earlier wording wherever there is a conflict.

### 19.1 One user-facing AI: Dramora

There is one user-facing AI assistant named **Dramora**. Do not introduce separate named agents, personalities, or a Showrunner concept.

Internally, the system may use LangGraph nodes, tools, model calls, validators, and specialized workflow steps. These are implementation details coordinated by Dramora, not separate assistants presented to the user.

Dramora is responsible for:
- Understanding the user's intent and the project's current state.
- Discovering missing requirements through relevant follow-up questions.
- Planning suitable work before executing complex requests.
- Producing and revising creative and production materials.
- Coordinating research and structured tasks.
- Checking consistency against approved project information.
- Reporting useful task progress and asking for approval when needed.

The application—not the model—remains responsible for authentication, authorization, routing, ownership checks, database access policy, and other deterministic security-sensitive operations.

### 19.2 Public landing page and account navigation

The initial route for visitors is a public landing page, not the authenticated dashboard.

The landing page should have:
- A cinematic, minimal hero with large full-width background video(s).
- Showcase footage supplied as site assets or otherwise lawfully sourced; this is presentation media, not native Dramora generation.
- Muted autoplay and looping where supported, with a static/fallback presentation for slow connections or unsupported playback.
- Respect for reduced-motion preferences and mobile/network performance.
- A prominent **New Project** call to action.
- A profile icon in the top navigation.

The profile dropdown is state-aware:
- Signed out: Sign in and Create account, plus only other essential public account actions.
- Signed in: Profile, Settings, account information, and Sign out.

Keep navigation minimal. Do not fill the landing page with unnecessary buttons or controls. After authentication, route users into their workspace/dashboard.

### 19.3 Authentication lifetime and session restoration

Do not implement the previously discussed fixed two-hour inactivity timeout.

The requirement is a defined, finite authenticated session lifetime, rather than a user remaining signed in indefinitely simply because they once authenticated. The exact duration remains an open decision and must be agreed before implementation.

The design must distinguish:
- **Absolute session lifetime:** the maximum lifetime of an authenticated session before reauthentication is required.
- **Inactivity policy:** an optional separate policy, not assumed to be two hours and not to be conflated with absolute lifetime.

Requirements:
- A still-valid session survives page refresh.
- Session restoration follows Supabase Auth's actual supported refresh/session behavior.
- Expired sessions require authentication again.
- Sign out invalidates the authenticated session according to Supabase's supported behavior.
- Tab reactivation and protected operations must not rely solely on stale client-side state.
- Active work should not be interrupted unnecessarily; task execution and saved work must be independent of a browser tab remaining open.

Verify Supabase Auth token lifetime, refresh behavior, and any server-side enforcement options before choosing the implementation. Do not claim that a client-only timer enforces a secure session lifetime.

### 19.4 Project creation and user-defined project titles

New Project presents exactly two studio choices:
1. AI Video Studio
2. Film Studio

Selecting a studio opens its workspace. Do not require a long setup questionnaire before the user can begin.

**Project title and conversation title are separate fields:**
- The project title is user-defined and editable later. Do not automatically invent or assign the project title from a conversation.
- The conversation title is generated automatically from the conversation's content and can be edited by the user later.
- Do not confuse either title with the other.

Do not block entry into a studio with mandatory forms for genre, aspect ratio, duration, characters, plot, or similar details.

### 19.5 Conversational project discovery

Dramora should progressively learn what is needed through conversation instead of forcing users through a long initial configuration form.

For example, when a user brings a rough supernatural-thriller concept, Dramora should understand the idea and then ask only relevant questions needed to develop it: setting, mythology, characters, intended audience, format, and other material constraints. It should use information already supplied and must not repeatedly ask questions whose answers are already known.

Discovery behavior:
- Ask adaptive, context-aware follow-up questions.
- Ask only questions that materially affect the requested work.
- Stop asking when enough information exists to proceed.
- Avoid endless clarification loops.
- Let the user authorize reasonable assumptions and continue.
- Make assumptions visible when they materially affect the result.
- Preserve confirmed decisions in project context.
- Apply the same principle to both studios.

The governing principle is: **Dramora should understand before it creates, plan before it executes, and preserve completed work as it progresses.**

### 19.6 Project settings are editable controls, not mandatory onboarding

The workspace may expose structured settings such as aspect ratio, genre, duration, language, visual style, production format, and other studio-relevant properties.

These controls:
- Are optional and editable within the workspace.
- Reflect the current project state.
- Inform relevant future AI outputs.
- May be recommended by Dramora based on project context.
- Should permit custom values where a fixed category list would be restrictive.

They are not a mandatory initial questionnaire and should not prevent a user from starting a conversation.

### 19.7 Shared workspace and context boundaries

Both studios use the same chat experience and shared AI infrastructure. Use assistant-ui as the established conversation UI foundation after compatibility verification; customize its components and styling rather than rebuilding common chat functionality from scratch.

The workspace includes:
- A collapsible sidebar.
- Projects and their associated conversations.
- Multiple conversations per project.
- Separate message history for each conversation.
- A shared project context available to relevant conversations.
- A common composer and conversation renderer across both studios.

Keep three scopes distinct:

**Project context** contains durable, cross-conversation information such as:
- Original concept and project intent.
- Studio and project settings.
- Approved characters, locations, story decisions, and production requirements.
- Saved documents and important project updates.
- Other confirmed facts needed for continuity.

**Conversation context** contains:
- Messages in the active conversation.
- Immediate discussion history.
- Conversation-specific instructions and decisions.
- Relevant references to project materials.

**Retrieved working context** is the bounded set of project facts, documents, versions, and conversation summaries selected for the current task. Do not send every message from every conversation to the model on every turn. Retrieve only relevant, authorized context.

A new conversation should receive the relevant project context and its own conversation history, not an indiscriminate dump of all project messages.

### 19.8 Durable context, memory, and RAG

Supabase PostgreSQL remains the canonical source of truth for project data and approved decisions. Design explicit project-context records and document/version relationships rather than relying on the model's transient context window as memory.

Use a retrieval strategy in stages:
1. Fetch structured project settings and confirmed project facts.
2. Retrieve relevant documents, versions, and conversation summaries using appropriate metadata and PostgreSQL search.
3. Evaluate whether semantic retrieval is necessary for large project libraries.
4. Add pgvector and embeddings only where measured retrieval needs justify them.

The user has specifically requested investigation of pgvector and RAG. This must be researched and documented as part of the backend/context architecture, not dismissed without evaluation. The initial system should avoid unnecessary embedding costs and complexity, but the architecture must allow project-scoped semantic retrieval if justified. Embeddings remain derived indexes; source documents and approved project facts remain canonical.

### 19.9 Long-running tasks and durable execution

Large requests must not depend on a single open HTTP request remaining alive.

Examples include developing a complete screenplay, character breakdown, scene breakdown, storyboard descriptions, cast/location requirements, and multiple production documents.

The architecture must:
- Split large work into bounded, meaningful sub-tasks.
- Persist task state and outputs progressively.
- Track pending, in-progress, completed, failed, and approval-required steps.
- Save completed artifacts as soon as each stage is ready.
- Resume from the appropriate checkpoint after a timeout, worker restart, provider failure, or browser disconnect.
- Retry safely without duplicating completed mutations or documents.
- Keep task execution independent of the original request and browser tab.
- Provide visible progress and clear failure/recovery states.
- Preserve user-approved work and never silently overwrite it.

Do not assume LangGraph alone solves request-duration limits. Verify current Supabase limits and the execution constraints of the selected Cloudflare runtime. Design a durable background execution mechanism with bounded invocations, persisted checkpoints, and a recovery strategy. Evaluate the simplest low-cost architecture that meets these requirements; do not add infrastructure without a demonstrated need.

### 19.10 Visible progress without exposing private reasoning

The user wants useful visibility into what Dramora is doing, not hidden chain-of-thought.

Do not expose private internal reasoning, raw prompts, internal model analysis, or hidden chain-of-thought. Instead, show a concise task plan and operational progress, for example:
1. Understanding the project request.
2. Reviewing approved story and project decisions.
3. Planning the requested deliverables.
4. Developing the screenplay or production structure.
5. Preparing supporting breakdowns.
6. Saving completed documents.
7. Checking consistency.

Each task step can show:
- Pending
- In progress
- Completed
- Needs your approval
- Failed / retry available

Progress should describe observable work and deliverables, not claim to reveal the model's private thoughts. Include approval gates where the user should review a significant creative decision or consequential change.

### 19.11 Output and document delivery choices

Users should be able to choose how they receive substantial work:
- A complete text response in the conversation, suitable for copying.
- One structured document.
- Multiple organized production documents.
- Progressive delivery as sections or documents are completed.

Document creation is an available operation, not a separate assistant or mandatory outcome. Users should retain control over what becomes a saved project document. Support saving, updating, versioning, and retrieving documents, with safeguards against overwriting approved content.

For very large tasks, generate and persist deliverables progressively rather than waiting for one enormous response to finish.

### 19.12 Voice transcription; no image uploads in the initial release

Both studios should support speech-to-text through a microphone control in the composer:
- User activates the microphone and speaks.
- The audio is transcribed.
- The transcript appears in the composer for review and editing.
- The user explicitly sends the reviewed text.

This initial capability is transcription, not full duplex or live voice conversation. Do not add voice responses or continuous voice conversation to the initial scope.

The initial release is text-first:
- No image uploads in the initial release.
- No native image generation.
- No native video generation.

Any audio upload/transcription service must be evaluated for file limits, duration limits, execution constraints, privacy, and cost before implementation.

### 19.13 Existing-component-first implementation

Prefer established, maintained components and libraries over rebuilding common functionality.

In particular:
- Use assistant-ui as the chat foundation and customize it.
- Use shadcn/ui components and patterns rather than creating an entirely bespoke component system.
- Reuse suitable existing editor, document, interaction, and accessibility primitives where they fit.
- Check package compatibility, maintenance, licensing, security, and runtime fit before adopting a dependency.
- Avoid dependency accumulation and avoid introducing abstractions without a real need.
- Keep the application architecture understandable and maintainable.

This is a reuse-first approach, not permission to install packages without review.

### 19.14 Film Studio capability detail

Film Studio should support a practical film-development and production-writing workflow, including:
- Idea and concept development.
- Logline, synopsis, themes, plot, structure, and treatment.
- Character biographies, relationships, motivations, and arcs.
- World, setting, and location descriptions.
- Industry-standard screenplay writing and formatting, including scene headings, action, character cues, dialogue, parentheticals, transitions, and scene numbering where appropriate.
- Scene breakdowns and continuity information.
- Cast breakdowns, locations, props, and wardrobe.
- Production design and department-specific notes.
- Shooting schedule suggestions.
- Storyboards, shot lists, camera angles, movement, lighting, and composition descriptions.
- Director's vision and production notes.
- Structured production documents.

Consistency matters across all materials. If an approved character, location, or story fact changes, Dramora should identify affected documents and offer a controlled update. Do not silently rewrite approved artifacts. Human review remains necessary; do not claim to replace every film-production professional.

### 19.15 AI Video Studio capability detail

AI Video Studio should support:
- Project and concept development.
- Scene and shot planning.
- Visual direction and production instructions.
- Platform-specific prompt development.
- Research into external AI-video platforms and their current capabilities.
- Workflow guidance adapted to the selected platform.
- Respect for project aspect ratio, genre, visual style, duration, language, and other relevant settings.

Dramora prepares plans, prompts, and instructions. Actual image/video generation happens on external platforms and must be clearly identified as such.

### 19.16 Runtime, compatibility, and request-limit verification

Before implementation, explicitly verify:
- LangGraph JS/TS support and the exact packages required.
- Compatibility with the selected Cloudflare runtime and deployment adapter.
- Whether LangGraph checkpointing can use the chosen durable store safely.
- Whether graph execution can be resumed across bounded invocations.
- Supabase request/function duration limits applicable to the selected services and plan, using current official documentation.
- Cloudflare Worker/Workflow/Queue or other execution limits relevant to the proposed design.
- assistant-ui compatibility with React, streaming protocol, persistence, and tool calls.
- Supabase Auth session/refresh behavior and the enforceable session-lifetime options.
- Speech transcription provider limits and supported formats.

Record the source, date checked, practical implication, and chosen design for each material compatibility claim. Do not rely on remembered limits or assume a service feature exists in a particular plan.

---

## 20. Revised implementation roadmap and approval gates

The earlier roadmap remains a useful high-level sequence, but implementation must now follow these explicit gates.

### Gate A — Complete research and blueprint
- Inspect the actual current repository and confirm the fresh-start baseline.
- Research the chosen frontend stack and existing-component options.
- Verify assistant-ui compatibility and identify the correct runtime integration.
- Research LangGraph JS/TS, Cloudflare execution compatibility, and durable checkpointing.
- Research Supabase schema/RLS, pgvector/RAG options, Auth session behavior, and current request-duration limits.
- Design project/conversation/context ownership and retrieval boundaries.
- Design durable background execution, progressive persistence, and recovery.
- Define speech transcription architecture.
- Consolidate decisions and acceptance criteria in this technical blueprint.

### Gate B — User blueprint review and approval
- Present the updated blueprint and unresolved decisions.
- Resolve material open questions, including the desired absolute session lifetime and first-release document/editor requirements.
- Obtain explicit user approval before implementation.

### Gate C — Foundation and shared workspace
- Establish the React + Vite + TypeScript application.
- Configure Tailwind, shadcn/ui, routing, and the public landing page.
- Integrate assistant-ui using the verified runtime.
- Establish Supabase Auth, session policy, project/conversation schema, RLS, and storage.
- Implement the shared workspace, sidebar, project navigation, and persistent conversations.
- Implement user-defined project titles and automatically generated/editable conversation titles.

### Gate D — Dramora AI and context foundation
- Implement Dramora as the single user-facing assistant.
- Implement direct conversational turns and LangGraph-backed structured workflows where appropriate.
- Implement project discovery, project settings, project context, conversation context, and bounded retrieval.
- Evaluate and implement pgvector/RAG only to the level justified by the research and test data.
- Implement visible progress, task state, checkpoints, and progressive persistence.
- Implement recoverable background execution and failure handling.

### Gate E — Studio capabilities
- Deliver Film Studio development, screenwriting, editing, continuity, and production documents.
- Deliver AI Video Studio planning, external-platform research, shot planning, and platform-specific prompt workflows.
- Ensure both studios share the same conversation and project-context foundation.

### Gate F — Voice, documents, and hardening
- Implement reviewed speech-to-text in both studios.
- Complete document saving, versioning, and output-delivery choices.
- Add optional ZIP export only if approved.
- Complete security, RLS isolation, reliability, accessibility, performance, cost, and deployment verification.

No implementation starts before Gate B approval. Any later scope expansion or material architecture change must be documented and approved.

## 21. Open decisions and items to verify

The following remain unresolved or require current-source verification; do not silently invent answers:
1. Exact absolute authentication session lifetime.
2. Whether a separate inactivity policy is needed at all.
3. First-release document formats and the editor experience.
4. Whether ZIP export is included in the first release or deferred.
5. Exact assistant-ui runtime and package versions.
6. Exact LangGraph JS/TS packages and Cloudflare-compatible execution/checkpointing design.
7. Current Supabase request-duration limits for the actual selected service and plan.
8. The durable background execution mechanism and its cost/operational trade-offs.
9. Whether and when pgvector/RAG is justified by retrieval tests.
10. Speech transcription provider, model, audio limits, and cost.
11. The final folder structure after the integration and dependency research.

## 22. Acceptance criteria additions

In addition to the earlier criteria, the initial release must demonstrate:
- A public landing page is the signed-out entry point.
- New Project offers only AI Video Studio and Film Studio.
- Users can enter a studio without completing a lengthy mandatory setup form.
- Project titles are user-defined; conversation titles are automatically generated and editable.
- The same Dramora assistant experience is used across both studios.
- Project context is shared across relevant conversations without sending all project history on every turn.
- Dramora asks relevant questions, avoids repeated discovery, and can proceed with user-approved assumptions.
- Long-running tasks persist progress and completed outputs independently of one HTTP request or open browser tab.
- A failed task can resume safely without duplicating completed work.
- Progress UI exposes task stages and statuses, not private chain-of-thought.
- Both studios support speech transcription with transcript review before sending.
- The initial release has no image uploads and no native image/video generation.
- Approved creative facts and documents are protected from silent destructive changes.
- Cross-document consistency checks can identify affected materials after an approved project change.
- Supabase RLS and server-side authorization prevent cross-user and cross-project access.

## 23. Current implementation status

This blueprint is a planning artifact. The fresh repository does not contain the previous application implementation, and no implementation work is authorized yet.

The next activity after this update is user review of the consolidated blueprint and resolution of the open decisions. Research claims that depend on current vendor limits or runtime compatibility must be verified against current official documentation before the corresponding implementation decision is finalized.


---

## 24. Compatibility research and current service-limit findings — checked November 20, 2026

This section records findings from current vendor documentation. These are documentation-level findings, not a claim that a running integration has already been tested. Package versions and limits must be rechecked at implementation time because vendors can change them.

### 24.1 React + Vite on Cloudflare

**Finding:** Cloudflare documents a supported React + Vite deployment path using the Cloudflare Vite plugin and Workers. The official guide supports both scaffolding a new React SPA with a Worker API and adapting an existing Vite application.

**Recommendation:** Keep React + Vite + TypeScript. Use the Cloudflare Vite plugin and a Worker API entry point. Do not choose Cloudflare Pages as a separate architecture unless a concrete need appears; the current Workers Vite path can serve the SPA and API together.

Source: [Cloudflare React + Vite guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/react/).

### 24.2 assistant-ui and AI SDK

**Finding:** assistant-ui's current documentation identifies AI SDK v7 with `@ai-sdk/react` v4 and `@assistant-ui/ai-sdk` as the recommended integration for new projects. It documents `useChatRuntime`, custom transports, tool approval, history adapters, and support for custom thread lists. assistant-ui also documents resumable streams for client reloads and dropped connections.

**Recommendation:** Target the current assistant-ui AI SDK v7 integration, pinned to compatible package versions after a lockfile-level compatibility check. Use `useChatRuntime` unless a custom transport requires the lower-level runtime. Implement our own database-backed history/thread adapter so Supabase remains the source of truth. Do not use assistant-ui managed cloud persistence as the canonical project database.

**Important limitation:** assistant-ui's resumable-stream documentation describes in-memory storage as development/test only and Redis adapters for production. Do not add Redis solely to solve long-running Dramora tasks. Long tasks should be durable jobs with persisted task state and progress; chat stream reconnect is a separate, shorter-lived concern. If resumable byte streams are needed, evaluate a Supabase- or Cloudflare-backed store with user-bound stream IDs.

Sources: [assistant-ui AI SDK v7](https://www.assistant-ui.com/docs/runtimes/ai-sdk/v7), [assistant-ui resumable streams](https://www.assistant-ui.com/docs/guides/resumable-streams).

### 24.3 LangGraph JS/TS and PostgreSQL checkpointing on Cloudflare

**Finding:** LangGraph JS supports a formal checkpointer interface. Its PostgreSQL checkpointer uses node-postgres. The LangGraph JS PostgreSQL checkpointer documentation specifically warns that direct raw TCP/TLS database connections can hang in edge runtimes, and identifies Cloudflare Hyperdrive as the supported route for PostgreSQL connectivity from Cloudflare Workers.

Cloudflare's current Node.js compatibility documentation lists supported Node APIs and the runtime's compatibility behavior. Cloudflare's Hyperdrive documentation provides a node-postgres integration example and recommends a current `pg` release (the guide specifies `pg > 8.16.3`).

**Recommendation:** Keep LangGraph JS/TS as the intended AI orchestration framework. Use the LangGraph Postgres checkpointer with a Hyperdrive binding and the supported node-postgres setup, rather than direct Postgres connectivity from the Worker. Persist project and task records in Supabase independently of LangGraph checkpoints. Use stable, project-scoped thread IDs and never treat a LangGraph thread as the only copy of a user's project context.

**Compatibility status:** The official documentation supports a credible integration route, but an isolated runtime proof is still required before relying on it in production. The proof must validate graph compilation, model invocation, checkpoint writes/reads, resume after a simulated interruption, and Cloudflare deployment. If the Postgres saver or graph package proves incompatible, evaluate a custom `BaseCheckpointSaver` implementation using Supabase/Hyperdrive; do not fall back to in-memory checkpointing for production.

Sources: [LangGraph JS persistence](https://github.com/langchain-ai/langgraphjs/blob/main/docs/docs/concepts/persistence.md), [LangGraph JS Postgres checkpointer and Cloudflare note](https://github.com/langchain-ai/langgraphjs/blob/main/libs/checkpoint-postgres/README.md), [LangGraph checkpointer interface](https://langchain-ai.github.io/langgraphjs/reference/modules/langgraph-checkpoint.html), [Cloudflare Hyperdrive node-postgres guide](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/node-postgres/), [Cloudflare Node.js compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/).

### 24.4 Durable execution: Cloudflare Workflows

**Finding:** Cloudflare Workflows are available on Workers Free and Paid. They provide durable step execution, persisted step state, retries, and the ability to resume after failures. Their documentation recommends small, self-contained, idempotent steps instead of placing an entire multi-stage task inside one large step.

Current published limits/pricing checked:
- Workers Free: 100,000 requests per day shared across Workers/Workflows, 10 ms CPU time per invocation, 1 GB-month workflow state storage, and 3,000 workflow steps per day.
- Workers Paid: $5 USD/month minimum account charge, with 10 million requests/month and 30 million CPU milliseconds/month included in the standard plan; CPU allowance is 30 seconds by default per invocation and can be configured up to 5 minutes, subject to platform limits and billing.
- Workflow completed-state retention: 3 days on Free and 30 days on Paid by default.
- Workflows step count, storage, and CPU usage are metered; idle time waiting for network I/O does not consume CPU.

**Recommendation:** Use Cloudflare Workflows as the durable background execution and retry layer. Keep task/job status, completed deliverables, approval state, and recovery metadata in Supabase so the user's work remains available beyond Workflow state retention. Each Workflow step should perform a bounded unit of work and be idempotent. LangGraph coordinates AI-specific state transitions within bounded work units; Cloudflare Workflows handles durable job execution and retry. Do not rely on a single long-running HTTP response or `waitUntil()` as the durable job system.

**Cost warning:** The Free plan's 10 ms CPU allowance is restrictive for orchestration-heavy code. A small compatibility prototype should measure actual CPU use. The likely production baseline for nontrivial workflows is Cloudflare Workers Paid at its $5/month minimum, but this is not an unconditional requirement until measurements confirm it. If the user insists on remaining entirely free, keep graph steps extremely lightweight and accept the Free plan's limits.

Sources: [Cloudflare Workflows pricing](https://developers.cloudflare.com/workflows/reference/pricing/), [Cloudflare Workflows limits](https://developers.cloudflare.com/workflows/reference/limits/), [Cloudflare Workflow design rules](https://developers.cloudflare.com/workflows/build/rules-of-workflows/), [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/).

### 24.5 Supabase Edge Function limits and background execution

**Finding:** Supabase currently publishes the following hosted Edge Function limits:
- Free plan wall-clock duration: 150 seconds.
- Paid plan wall-clock duration: 400 seconds.
- CPU time: 2 seconds.
- Request idle timeout: 150 seconds.
- Memory: 256 MB.

Supabase background tasks use `EdgeRuntime.waitUntil()`, but their duration remains bounded by the function's wall-clock, CPU, and memory limits. The documentation says the instance shuts down when a limit is reached.

**Conclusion:** The previously discussed approximately 150-second Free-plan limit is confirmed for Supabase Edge Functions, but it is not an appropriate foundation for Dramora's durable long-running jobs. Use Supabase for durable data and Cloudflare Workflows for background execution. Supabase Edge Functions may still be used for bounded Supabase-specific operations if needed.

Sources: [Supabase Edge Function limits](https://supabase.com/docs/guides/functions/limits), [Supabase background tasks](https://supabase.com/docs/guides/functions/background-tasks).

### 24.6 Cloudflare Hyperdrive and Supabase Postgres

**Finding:** Hyperdrive is available on Workers Free and Paid. Free currently includes 100,000 database queries per day. Supabase recommends the Data API for frontend access and pooled PostgreSQL connections for serverless/edge functions. Supabase's shared pooler is available on every plan; its dedicated pooler is Pro and above.

**Recommendation:** Keep normal application CRUD on the Supabase Data API through `supabase-js` with RLS. Use Hyperdrive only for the LangGraph Postgres checkpointer if the PostgresSaver integration requires a native Postgres driver. Do not route all application reads and writes through raw SQL connections. Measure checkpoint query volume against the Free Hyperdrive allowance.

Sources: [Cloudflare Hyperdrive pricing](https://developers.cloudflare.com/hyperdrive/platform/pricing/), [Supabase connection methods and pooling](https://supabase.com/docs/guides/database/connecting-to-postgres), [Supabase pooling and limits](https://supabase.com/docs/guides/database/connecting-to-postgres/pooling-and-limits).

### 24.7 Supabase Auth session-lifetime restriction

**Finding:** Supabase documents absolute time-boxed sessions, inactivity timeouts, and single-session enforcement as features available on Pro plans and above. By default, sessions can remain active indefinitely until sign-out or another terminating event. The default access token lifetime is generally one hour; refresh tokens are rotated and can keep a session alive.

**Recommendation for the cost-conscious baseline:** Set a 30-day absolute application session lifetime and no separate inactivity timeout initially. On Supabase Free, enforce this as an application authorization policy using a server-created session record tied to the Supabase JWT `session_id`, with RLS and Storage policies checking that the record has not expired. The client should also sign out and request reauthentication when the deadline is reached. This must be security-tested against direct Data API and Storage requests; a client-only timer is insufficient.

If the user later chooses Supabase Pro, prefer Supabase's native time-boxed session control configured to the same agreed duration. Do not represent the Free-plan application policy as native Supabase Auth session termination.

**Proposed decision:** 30-day absolute lifetime, no inactivity timeout, no single-session restriction. This is a recommendation for user review, not yet approved.

Source: [Supabase Auth sessions](https://supabase.com/docs/guides/auth/sessions).

### 24.8 pgvector, full-text search, and RAG

**Finding:** Supabase supports pgvector in Postgres and documents hybrid search combining PostgreSQL full-text search (`tsvector`) with pgvector semantic search. Vector similarity queries can be exposed through SQL functions/RPC, and metadata filters can scope retrieval.

**Recommendation:** Build the first project-context retrieval layer with structured project facts, document metadata, PostgreSQL full-text search, and bounded summaries. Add pgvector only after representative project queries demonstrate that keyword/metadata retrieval is insufficient. When added, scope every search by user and project, record the embedding model/version and dimensions, and rebuild embeddings when the source document changes. Keep source documents and approved facts canonical.

This settles the architecture direction without forcing an embedding model or recurring embedding cost into the first migration.

Sources: [Supabase vector columns](https://supabase.com/docs/guides/ai/vector-columns), [Supabase hybrid search](https://supabase.com/docs/guides/ai/hybrid-search).

### 24.9 Screenplay and general-document editing

**Finding:** Fountain is a free, open, plain-text screenplay markup format designed for portability and long-term readability. It supports core screenplay elements but not all production-specific features. Tiptap is a modular React-compatible editor built on ProseMirror; its open-source core is MIT licensed and supports a Vite + React integration.

**Recommended first-release editing approach:**
- General production documents and notes: Tiptap-based rich-text editor, with only the required open-source extensions.
- Screenplays: a dedicated Fountain-based screenplay editor with a live formatted preview, using a maintained parser/renderer after license and compatibility review. Keep the screenplay's structured source exportable as `.fountain`.
- Screenplay exports: PDF for reading/printing, Fountain for portability, and Final Draft XML (`.fdx`) for compatibility with professional screenwriting software. FDX export must be validated with real test files and not merely renamed XML.
- General document exports: PDF and DOCX.
- ZIP export: defer until the core editor and document lifecycle are stable.

**Implementation caution:** Do not assume a generic rich-text editor automatically produces industry-standard screenplay pagination. Screenplay formatting, page breaks, dialogue widths, title pages, and scene numbering require a dedicated renderer and acceptance tests.

Sources: [Fountain format](https://fountain.io/), [Fountain FAQ](https://fountain.io/faq/), [Tiptap React setup](https://tiptap.dev/docs/editor/getting-started/install/react), [Tiptap overview and license](https://tiptap.dev/docs/editor/getting-started/overview), [Final Draft import guidance](https://kb.finaldraft.com/hc/en-us/articles/15575252515988-What-file-formats-can-I-import-into-Final-Draft).

### 24.10 Speech transcription

**Finding:** OpenAI's current file transcription guidance recommends `gpt-transcribe` for recorded audio. It accepts files up to 25 MB and supports common formats including FLAC, MP3, MP4, MPEG, MPGA, M4A, OGG, WAV, and WebM. The published model price is $0.0045 per audio minute. The model's API tier table does not list a free tier.

**Recommendation:** Use file-based transcription, not live voice conversation, for the initial release. The browser records a bounded clip, uploads it to a trusted server endpoint, receives the transcript, and displays it for editing before the user sends it. Apply duration and file-size limits below the provider maximum, and do not store raw audio after transcription unless the user explicitly requests it.

**Cost implication:** This is a low per-minute cost but not a free service; it requires API billing/credits. Confirm that the user accepts this provider and cost before enabling the feature in production.

Sources: [OpenAI speech-to-text guide](https://developers.openai.com/api/docs/guides/speech-to-text), [GPT-Transcribe model and price](https://developers.openai.com/api/docs/models/gpt-transcribe).

---

## 25. Recommended decisions to close the open items

The following are the recommended defaults to make the first release implementable without overbuilding. They are presented for user review and approval.

| Open item | Recommended decision | Reason |
|---|---|---|
| Absolute session lifetime | 30 days | Finite lifetime without forcing frequent sign-ins |
| Inactivity timeout | None initially | Avoid unexpectedly interrupting active creative work; absolute lifetime still applies |
| Single session per user | Disabled | Allow normal use across the user's devices |
| Supabase session enforcement | RLS-backed application session expiry on Free; native Supabase time-boxing if Pro is selected | Avoid requiring Pro solely for this control |
| General document editor | Tiptap open-source core | Mature React/ProseMirror foundation with modular extensions |
| Screenplay editor | Fountain source + dedicated editor and live screenplay preview | Portable screenplay source and explicit control over industry formatting |
| First-release screenplay exports | PDF, Fountain, Final Draft (.fdx) | Covers reading, portability, and professional screenwriting handoff |
| First-release production-document exports | PDF and DOCX | Practical sharing and editing |
| ZIP export | Defer until after core document workflows | Avoid adding archive complexity before documents are stable |
| Context retrieval | Structured project facts + PostgreSQL full-text search first; pgvector after retrieval evaluation | Lower cost and complexity while preserving a semantic-search upgrade path |
| Durable background jobs | Cloudflare Workflows; task records and completed artifacts in Supabase | Durable retry/recovery without depending on Supabase's 150-second Free Edge Function window |
| AI orchestration | LangGraph JS/TS with Postgres checkpointer through Hyperdrive | Aligns with the user's selected orchestration direction and documented Cloudflare connection route |
| Chat UI integration | assistant-ui with AI SDK v7 runtime and custom Supabase history | Reuse the established chat UI while keeping application data in Supabase |
| Voice transcription | OpenAI `gpt-transcribe` file transcription, subject to billing approval | Current recommended transcription model with a published per-minute price |
| Initial media scope | No image uploads, no native image/video generation, no live voice conversation | Matches the confirmed first-release scope |

### 25.1 Cost and plan decision

The lowest-complexity cost-conscious target is:
- Supabase Free for Auth, Postgres, Storage, and RLS, provided its operational limits are acceptable.
- Cloudflare Workers Free for the initial integration proof and low-volume testing.
- Cloudflare Workers Paid ($5/month minimum) if measured CPU use, Workflow step volume, or retention needs exceed Free-plan constraints.
- Cloudflare Hyperdrive Free initially, with a published allowance of 100,000 database queries/day.
- OpenAI transcription billed by audio minute.
- AI model inference and web search remain separate usage costs depending on the selected providers.

Do not promise that all production usage will remain free. The architecture should keep costs visible and avoid paid services until a measured requirement justifies them.

### 25.2 Remaining user choices before final approval

Only these points require a direct user decision rather than further technical research:
1. Accept the proposed 30-day absolute session lifetime, with no inactivity timeout and no single-session restriction.
2. Accept the recommended editor and export split: Tiptap for general documents; Fountain-based screenplay editor; PDF/Fountain/FDX for screenplays; PDF/DOCX for production documents.
3. Accept ZIP export being deferred until after the core document workflows.
4. Accept OpenAI `gpt-transcribe` and its usage-based cost, or request a different provider.
5. Confirm whether the target is Supabase Free + Cloudflare Free initially, with a possible $5/month Cloudflare Paid upgrade if measured limits require it.

These choices can be approved together with the blueprint or amended during review. No implementation is authorized until the user explicitly approves the final blueprint.

## 26. Research completion status and pre-implementation proof requirements

**Documentation research completed:** Current official documentation has been checked for the main stack, assistant-ui/AI SDK integration, LangGraph persistence, Cloudflare Workers/Workflows/Hyperdrive, Supabase Edge Function limits, Supabase Auth session controls, pgvector/RAG, Tiptap/Fountain, and transcription.

**Not yet runtime-verified:** No application code or integration proof has been run. The following small, isolated proofs are required after blueprint approval and before the corresponding production feature is committed:
1. Deploy a minimal React + Vite + assistant-ui + AI SDK v7 chat to Cloudflare Workers.
2. Run a LangGraph JS graph in the Worker and verify PostgresSaver checkpoint write/read/resume through Hyperdrive.
3. Run a Cloudflare Workflow with a bounded step, intentional failure, retry, and successful resume; confirm the task record remains correct in Supabase.
4. Test session expiry enforcement through direct Supabase Data API and Storage requests, not just the UI.
5. Test Fountain parsing/rendering and validate generated PDF and FDX files in compatible screenplay software.
6. Test speech transcription with representative English and Nigerian-accented speech, including transcript review/edit before send.

These are integration proofs, not permission to begin the full product implementation. The user must first review and approve the blueprint. If a proof exposes a material incompatibility or cost issue, update the blueprint and obtain approval for the changed design before proceeding.


---

## 27. Latest approved architecture and task-execution decisions

**Decision status:** This section records the latest decisions confirmed during the November 20–21, 2026 planning discussion. Where this addendum conflicts with older recommendations elsewhere in this document, this addendum is the newer decision and takes precedence. The older sections must be reconciled during the final blueprint consolidation so that the document does not contain contradictory architecture.

### 27.1 Product and studio scope — confirmed

Dramora has exactly two studios:

1. **AI Video Studio** — a broad video-production studio supporting formats such as YouTube videos, advertisements, social content, music videos, cinematic storytelling, short films, documentaries, and educational videos. It also supports dedicated cinematic planning when the user's project calls for it. Capabilities include concept development, scripts/narration/dialogue, story development, scene breakdowns, shot planning, character and environment planning, visual direction, external image/video-generation prompt preparation, organization of externally generated assets, production checklists, continuity, and review/refinement. Dramora prepares work for external generation platforms; native image and video generation are not part of the product.
2. **Film Studio** — a complete film-development and production studio covering concepts, premise, genre, themes, logline, synopsis, story structure, acts, sequences, plot, conflict, turning points, endings, character development, relationships and arcs, world/location development, professional screenplay writing and review, and production preparation such as scene breakdowns, cast/character lists, locations, props, costumes, schedules, production notes, and call sheets.

The two studios share the underlying project, conversation, document, asset, continuity, RAG, memory, and task foundations while retaining distinct specialist workflows and interfaces. Dramora must follow the user's actual intention; it must not force an advertisement, social video, or other request into a cinematic workflow when that is not what the user wants.

### 27.2 Conversational project setup and context — confirmed

- Project creation should be conversational and lightweight, not a mandatory long setup form.
- The user defines the project title.
- Conversation titles are generated automatically and remain editable.
- A project can contain multiple conversations.
- Project-level context is shared across its conversations; conversation-specific context remains distinct.
- Retrieve bounded, relevant context rather than injecting the entire project history into every model request.
- Workspace settings are editable within the workspace and are not a mandatory onboarding step.
- Ask questions only when missing information materially changes the outcome. Otherwise, make reasonable, visible assumptions and proceed.
- Users may answer naturally; optional selectable answers can be offered when useful but must not restrict free-text input.

### 27.3 AI autonomy selector — confirmed

Dramora provides a user-selectable autonomy setting with three modes:

- **Guided:** more frequent clarification and approval before major stages.
- **Balanced:** the default; handles routine decisions independently and asks when important decisions arise.
- **Autonomous:** executes the user's approved objective with minimal interruptions.

The selector belongs in workspace settings and may also be surfaced in the workspace UI. The user explicitly chooses the mode; Dramora must not silently auto-select a mode. Changing the setting does not silently alter the permissions or approved scope of a task already running. An in-progress task retains its existing approved scope unless the user explicitly changes it.

Autonomy rules:
- Do not ask for redundant approval for work the user explicitly requested.
- Approval is limited to the stated plan and scope; it is not unlimited authorization.
- Consequential actions require approval where appropriate, including changing established story facts, replacing approved documents, deleting documents/assets, making major project-direction changes, or taking external actions.
- Preserve the distinction between established facts, proposed ideas, and unresolved decisions. An AI suggestion does not become project canon until accepted.
- Persist approvals so a workflow can resume without repeatedly asking for the same approval.

### 27.4 Simplified task controls — confirmed

The user approved a deliberately small user-facing control set:

1. **Stop**
2. **Continue**
3. **Retry**
4. **Restore**, available within document version history rather than as a primary task control.

There are no separate primary **Pause**, **Cancel**, or **Modify** buttons. Changes to a task are communicated naturally through the conversation. If a new instruction materially changes an already-approved plan or scope, Dramora must identify the change and obtain any approval required by the selected autonomy mode and the consequential-action rules.

#### Stop

- During normal AI response generation, the composer’s Send button changes into a Stop button while Dramora is actively responding.
- Pressing Stop interrupts the active response generation.
- During a background workflow, the same user-facing Stop action requests a safe interruption. It is not merely a browser-side abort.
- Stop must preserve completed work and must not implicitly delete project artifacts or abandon the task.
- The UI should communicate when a stop request has been received and, where necessary, when the backend has reached a safe stopping point.

#### Continue

- Continue resumes an interrupted task from its latest safe, durable checkpoint.
- It must not restart already completed stages unnecessarily.
- The user may provide additional instructions after stopping; Continue should incorporate those instructions and validate whether they change the remaining plan.
- Before resuming, Dramora must verify the task's current state, project context, permissions, and approved scope.

#### Retry

Retry is distinct from Stop and is not a replacement for Continue.

- Retry is offered in or adjacent to the composer/text area when an operation has failed and another attempt is meaningful.
- Dramora should attempt bounded automatic recovery when appropriate, using sensible retry limits and backoff. It must not retry indefinitely.
- Retry only the failed or safely repeatable unit; do not repeat successful stages or duplicate saved artifacts.
- If automatic recovery cannot resolve the problem, Dramora must return a useful failure report explaining:
  1. What was completed successfully.
  2. What could not be completed.
  3. Why it failed, to the extent known.
  4. What it proposes to do next.
- A manual Retry action may then be shown when another attempt is viable. Do not show Retry when the failure is permanent or another attempt would be unsafe or meaningless.

#### Restore

- Restore is a document-version-history operation, not a task-control button.
- Restoring an earlier version must create a new version based on that historical content. It must not erase newer versions or silently destroy the current document state.

### 27.5 Task lifecycle and interruption semantics — confirmed

The backend must distinguish at least these conceptual states:

| State | Meaning and expected behaviour |
|---|---|
| Queued | Accepted and waiting to execute. |
| Running | Currently executing a bounded operation or workflow stage. |
| Stop requested | A durable request to stop at the next safe boundary. |
| Interrupted | Stopped before completion; completed work and checkpoint are preserved and Continue is available when safe. |
| Awaiting input/approval | Execution is waiting for a user answer or required approval. |
| Failed | The task could not proceed; explain the failure and offer Retry only if recovery is viable. |
| Completed | All requested work has finished and its outputs are durably saved. |
| Abandoned | The user intentionally decides not to continue. Completed work remains preserved; the task is not resumed automatically. |

These are internal lifecycle states; they do not all need separate user-facing buttons. An interrupted task must not become abandoned merely because the user closes a tab, refreshes, navigates away, loses connectivity, or closes the browser. Abandonment is an intentional user decision, not a side effect of navigation or disconnection.

### 27.6 Normal response generation versus background workflows — confirmed

These two execution types require different backend handling while presenting a consistent Stop interaction.

**Normal text generation**
- Stop interrupts the current generation.
- Define and implement a clear policy for whether partial generated text is persisted as an interrupted/partial assistant message; never present incomplete text as a completed answer.
- The user may provide a new instruction or ask Dramora to continue where meaningful.
- A page refresh or navigation must not be interpreted as an explicit user cancellation.
- A disconnected client must not corrupt already-persisted messages or project data.

**Background workflows**
- The backend owns execution state; the browser does not.
- Stop writes a persistent stop request that workers inspect at safe checkpoints.
- A running operation may need to finish or safely exit its smallest atomic unit before stopping; the UI must not falsely promise instantaneous termination.
- Save completed stage outputs and a durable checkpoint before marking the task interrupted.
- Once the stop request is acknowledged at a safe boundary, do not start another stage.
- Continue resumes from the latest safe checkpoint after checking for changed instructions, project state, permissions, and approval scope.
- Browser refresh, tab closure, navigation, or temporary network loss must not cancel a durable background job.
- A task must not depend on a single long-lived browser request remaining open.

### 27.7 Required execution-safety mechanisms — confirmed requirements

The implementation must provide:
- Durable task and stage records in the canonical database.
- Checkpoints after meaningful workflow stages and at safe interruption boundaries.
- Idempotency keys or equivalent safeguards to prevent duplicate work and duplicate artifact creation.
- Persistent stop-request state and cooperative cancellation checks.
- Safe recovery after network failures, worker restarts, and execution timeouts.
- Protection against concurrent workers executing the same task or stage.
- Durable persistence of completed deliverables before acknowledging queue/workflow progress.
- Retry limits, backoff, and clear permanent-versus-recoverable error classification.
- Task progress and status that can be reloaded after refresh or from another device.
- Auditability of approvals, scope changes, stop requests, retries, and restoration actions.

Exactly-once execution must not be promised. Use durable state, idempotent operations, and reconciliation to make retries safe.

### 27.8 Current backend and cost constraints — latest decisions

The latest architecture direction is **Supabase-primary**, with Supabase serving as the main application backend and system of record. Use Supabase PostgreSQL, Auth, Storage, RLS, pgvector, Edge Functions, Queues (pgmq), and Cron where appropriate. Cloudflare is used selectively for frontend delivery and Workers AI inference rather than being the central application backend.

The user's cost constraint is strict: use free tiers only. Do not require paid upgrades, paid AI credits, paid fallbacks, or automatic switches to paid services. If a free quota or limit is reached, stop or defer the affected operation, explain the limitation, and resume when the free allocation resets or the user chooses an approved alternative. Never silently incur a charge.

For Supabase Edge Functions, design bounded units of work that checkpoint and finish comfortably within hosted limits. Supabase Queues are durable Postgres-backed queues but do not run consumers continuously by themselves; use Cron or another approved scheduler to invoke bounded consumers. Persist results before acknowledging queue messages and make consumers idempotent. Do not rely on one long-running function invocation for a complete multi-stage creative workflow.

### 27.9 RAG is core architecture — confirmed

RAG is a foundational requirement from the initial schema, not an optional later add-on.

The approved direction is:
- Supabase PostgreSQL with pgvector.
- Hybrid retrieval combining semantic vector search and PostgreSQL full-text search.
- Reciprocal Rank Fusion (RRF) to combine candidate rankings.
- Content-aware chunking: paragraph/section chunks for general documents; scene-based chunks for screenplays; character-section chunks for profiles; act/sequence chunks for outlines; heading/section chunks for production documents; topic/decision chunks for conversation summaries.
- Canonical source documents and project data remain authoritative; embeddings are derived indexes.
- Knowledge categories remain distinguishable: project documents, structured project memory, conversation memory, and user-level preferences.
- Do not automatically embed every message. Use bounded recent context and retrievable topic/decision summaries.
- Preserve provenance, document versions, content hashes, and the distinction between established facts, proposals, and unresolved decisions.
- Enforce user/project/studio/document authorization in database-side retrieval policies and RLS, not only in the UI or orchestration layer.
- Update affected chunks incrementally where feasible; remove or disable embeddings when source content is deleted.
- Query and document embeddings must use the same model and dimensions. Do not mix vector spaces.
- EmbeddingGemma 2 through Cloudflare Workers AI at 512 dimensions is a candidate, not a finally verified model decision. Benchmark retrieval quality on representative Dramora documents before locking it.

If free embedding quota is exhausted, pause new semantic indexing and continue with full-text retrieval where possible. Resume indexing when quota resets. Do not switch to a different model and mix vectors.

### 27.10 Seven required RAG integration proofs — approved

Before treating the RAG implementation as production-ready, prove:

1. Generate EmbeddingGemma 2 embeddings through the Cloudflare REST API from an approved Supabase Edge Function flow.
2. Store and retrieve 512-dimensional vectors using pgvector.
3. Execute hybrid semantic + keyword retrieval and combine results with RRF.
4. Demonstrate content-aware chunking, including correct screenplay scene boundaries.
5. Prove isolation: one project cannot retrieve another project's information.
6. Demonstrate incremental indexing after a document edit, reprocessing only affected content where feasible.
7. Simulate free-quota exhaustion: semantic indexing pauses, full-text retrieval remains available, and indexing resumes after quota availability returns.

These are integration proofs. The embedding model/dimension remains a candidate until the benchmark and proofs pass.

### 27.11 AI provider and quota policy — confirmed

- Maintain a central provider/model capability registry and track applicable free quotas.
- Never expose provider credentials to the browser.
- Never automatically fall back to a paid model, paid API, or paid plan.
- Provider selection must account for supported capabilities, rate limits, free quotas, and the task's requirements.
- If a quota is exhausted, report it clearly and defer or use an already-approved free alternative only when doing so does not compromise the task or mix incompatible embedding spaces.
- Workers AI's free daily Neuron allocation is shared across applicable Workers AI workloads, including inference, embeddings, and transcription; quota must therefore be managed centrally.
- Gemini free limits are model-specific and must be verified for the selected model.
- OpenRouter's free-model limits must be treated as finite and must not be bypassed by purchasing credits.
- No provider-specific quota or capacity should be presented as guaranteed without checking current official limits.

### 27.12 Authentication session policy — confirmed user requirements

The user-selected session behaviour is:
- 30-day absolute session lifetime.
- 5-day inactivity timeout.
- Multiple devices allowed.
- Refresh preserves a session only while it remains valid.
- Expired sessions require reauthentication.

On Supabase Free, enforce the policy through application-level per-device session records linked to the Supabase JWT session identifier, with server-side/RLS enforcement. Do not rely on a client-only timer. Test direct Data API and Storage access after expiry and inactivity timeout. Do not assume Supabase's Pro-only native time-boxed controls are available on Free.

### 27.13 Product releases and implementation governance — confirmed

- Plan explicit product releases with features introduced, improvements, dependencies, acceptance criteria, known limitations, and deliberate deferrals.
- Release 1 must be a strong, coherent and genuinely useful product, not an artificially restricted MVP.
- Foundational project memory, RAG, continuity, durable task execution, safe interruption/recovery, and essential workflows must be included in the architecture from the beginning.
- Keep three documentation categories distinct: **Confirmed decisions**, **Technical findings**, and **Implementation roadmap**.
- Do not represent recommendations, candidates, or untested technical assumptions as user-approved decisions.
- Do not begin implementation until the user has reviewed and explicitly approved the final consolidated blueprint.

### 27.14 Next planning discussion — not yet decided

The next discussion is **Documents, Editors and Creative Workspace**. It must define document creation, editing, organization, versioning, autosave/persistence, editor experiences, and how creative artifacts are presented across AI Video Studio and Film Studio.

No decisions from that discussion should be inferred or added as confirmed until the user has reviewed and approved them.

## 28. Performance, streaming and real-time delivery architecture — confirmed direction

This section records the user's approved performance architecture and the selected real-time notification transport. It supplements section 27 and must be reconciled with older infrastructure recommendations during final blueprint consolidation. The strict free-tier-only policy in section 27.8 applies to every component below.

### 28.1 Separate fast conversational responses from durable background work — confirmed

Dramora must use two execution paths rather than routing every interaction through a heavyweight workflow engine.

**Fast conversational path**
- Handle ordinary questions, discussion, clarification, small edits and short reviews through a lightweight request path.
- Stream model output to the client immediately as it becomes available.
- Avoid invoking LangGraph or multi-stage orchestration when a simple direct model request is sufficient.
- Keep context preparation bounded and avoid unnecessary database round trips.

**Durable background-work path**
- Use durable task and stage records for substantial multi-step work, such as screenplay development, film planning, production packages, multi-document generation and substantial revisions.
- Use LangGraph where structured multi-stage orchestration materially helps.
- Execute bounded stages, persist outputs and checkpoints, and recover independently of the browser connection.
- Continue to follow the Stop, Continue, Retry, checkpoint, idempotency and recovery requirements in sections 27.4–27.7.

### 28.2 Streaming and time-to-first-token — confirmed

- Normal AI text responses use Server-Sent Events (SSE) for incremental server-to-browser delivery.
- The interface must show the user's message and a responding state immediately, then render generated text incrementally as tokens arrive.
- Do not wait for the complete model response before beginning delivery.
- Keep the interface interactive during generation; avoid rerendering the entire conversation for every token.
- Do not reload the full conversation after each message.
- Define persistence for interrupted or failed partial responses; never represent incomplete output as a completed answer.
- Measure time to first token (TTFT) separately from total generation duration.
- Provider/network latency remains an external factor; the architecture should remove avoidable internal delays but must not promise a fixed response speed.

### 28.3 Bounded context retrieval and RAG performance — confirmed

Use layered, relevance-based context assembly rather than retrieving the entire project on every turn:
1. Recent conversation context.
2. A compact project summary.
3. Relevant established facts and structured project memory.
4. Relevant document chunks selected through the approved hybrid RAG system.
5. Older conversation summaries or history only when the current request requires them.

Additional requirements:
- Run independent retrieval operations in parallel where safe.
- Cache or reuse compact summaries when appropriate, with clear invalidation when source content changes.
- Index documents incrementally and do not re-embed unchanged content.
- Keep database queries selective and indexed around common user, project, conversation, task and timestamp access patterns.
- Reuse the Supabase pooler for appropriate serverless/edge database access.
- Avoid a database write for every generated token. Persist the user message before generation and persist the completed assistant response; persist partial output when required by interruption/failure semantics.
- Benchmark retrieval quality and latency without weakening project isolation, RLS or provenance.

### 28.4 Approved real-time notification architecture — Cloudflare Durable Objects + WebSockets

The user approved **Cloudflare Durable Objects using the WebSocket Hibernation API** as Dramora's primary real-time notification delivery layer, subject to free-tier integration tests and usage validation.

Responsibilities are deliberately separated:

- **Supabase PostgreSQL remains the system of record.** It owns authoritative project, conversation, document, task, stage, checkpoint and approval state.
- **Cloudflare Durable Objects provide real-time connection coordination and event delivery.** They do not become a second source of truth for Dramora's application data or task lifecycle.
- **WebSockets** deliver low-latency background-task notifications to connected clients.
- Prefer the Durable Objects WebSocket Hibernation API for server-side WebSocket connections so idle objects can hibernate without disconnecting clients.
- Use narrowly scoped, authenticated connections and subscriptions. A user must only receive events for resources they are authorized to access.
- Publish meaningful state transitions and appropriately coalesced progress updates; do not emit an event for every token or tiny internal progress change.
- Normal AI text generation continues to use SSE. Durable Objects/WebSockets are for real-time application and background-task notifications, not a replacement for the normal response-streaming path.
- The background execution system writes durable state to Supabase first, then publishes a notification. A notification must never be treated as proof that a task state was durably committed.
- If notification delivery fails, the task continues according to its durable backend state. The client reconnects and fetches authoritative state from Supabase.
- If WebSockets are unavailable or the free allowance is temporarily exhausted, use bounded lightweight polling for status recovery/updates where appropriate. Do not switch to a paid service or upgrade automatically.

### 28.5 Free-tier limits and technical findings — verify at implementation time

Official documentation reviewed on 21 November 2026 establishes the following current published limits and behaviours. These are technical findings, not promises of capacity or performance; re-check official documentation before implementation and deployment because quotas can change.

**Cloudflare Durable Objects on Workers Free**
- SQLite-backed Durable Objects are available on the Free plan; the key-value storage backend is not available for newly created Free-plan Durable Objects.
- Published Free allowance: 100,000 requests per day and 13,000 GB-seconds of duration per day.
- Requests include HTTP requests, RPC sessions, WebSocket messages and alarm invocations.
- Creating a WebSocket connection requires a request.
- Outgoing WebSocket messages do not incur additional request charges; incoming WebSocket messages use a 20:1 ratio for compute-request billing purposes.
- Hibernatable WebSockets can remain connected while an idle Durable Object hibernates; eligible hibernation periods do not consume active duration.
- Cloudflare documents that a Durable Object can coordinate thousands of WebSocket clients, and the Hibernation API permits up to 32,768 WebSocket connections per object. Actual practical capacity depends on CPU, memory, message rates, workload and application design; Dramora must not assume the documented maximum is a safe target.
- On the Free plan, exceeding a Durable Objects free limit causes further operations of that type to fail; the application must handle this gracefully and must never incur paid usage.

**Supabase Realtime Free — retained as a comparison, not the selected notification transport**
- Published Free limits include 200 concurrent connections, 2 million messages per month and 100 messages per second.
- Database changes and broadcasts can count once per receiving subscribed client, so fan-out affects message consumption.
- Supabase Realtime is not selected as Dramora's primary background-notification transport under this approved architecture. Supabase remains the canonical database and backend.

### 28.6 Real-time delivery and resource-management safeguards — confirmed requirements

Implement an internal delivery/resource-management layer that:
- Tracks Durable Object requests, incoming WebSocket message volume, active connection counts, duration and relevant free-tier usage.
- Tracks provider quotas separately through the central provider/quota registry in section 27.11.
- Uses authenticated, narrowly scoped subscriptions and avoids duplicate subscriptions.
- Coalesces high-frequency progress changes into meaningful updates.
- Applies bounded reconnect attempts with backoff and jitter.
- Re-fetches authoritative task state from Supabase after reconnect, refresh or suspected event loss.
- Uses lightweight polling only as a controlled fallback, with sensible intervals and termination when no relevant task is active.
- Handles connection loss, delivery errors, hibernation/wake-up and quota exhaustion without losing task state.
- Applies backpressure or drops/replaces obsolete progress notifications when necessary; durable task state and completed artifacts must never be dropped.
- Never depends on the browser remaining connected for background execution.
- Never silently upgrades, purchases credits or routes usage to a paid fallback. When a Free allowance is exhausted, defer or use the approved fallback behaviour and clearly report the limitation.

### 28.7 Performance observability and acceptance benchmarks — confirmed requirements

Measure and test at least:
- Time to first token (TTFT).
- Total model response duration.
- Database query and persistence duration.
- Context assembly and RAG retrieval duration.
- Provider response latency and quota/rate-limit failures.
- Background task stage duration and end-to-end completion time.
- Task failure, retry, interruption and recovery rates.
- Durable Object connection count, request consumption, incoming message volume, duration and delivery failures.
- Reconnection recovery time and correctness of state reconciliation.

Before production acceptance, run integration/load tests that:
1. Verify SSE delivers incremental text and Stop interrupts generation correctly.
2. Verify WebSocket Hibernation connections remain connected through idle hibernation and wake correctly.
3. Verify authenticated users cannot receive another user's or project's events.
4. Verify background task state is persisted in Supabase before notification publication.
5. Verify refresh, disconnection and reconnection recover the correct task state from Supabase.
6. Verify notification coalescing, bounded reconnect behaviour and polling fallback.
7. Simulate Durable Objects Free quota exhaustion and confirm graceful failure/defer behaviour without paid usage.
8. Measure realistic concurrent connections, event fan-out and resource consumption; do not infer production capacity solely from Cloudflare's per-object maximum.
9. Verify normal conversational requests use the fast path and substantial workflows use durable background execution.
10. Verify performance optimizations do not bypass RLS, project isolation, approval rules, checkpoints or idempotency.

No numerical latency or scale target is approved yet. Set measurable targets after representative baseline tests rather than inventing guarantees.

### 28.8 Approved responsibility map

| Responsibility | Selected technology |
|---|---|
| Main application backend and system of record | Supabase |
| Relational data and durable task state | Supabase PostgreSQL |
| Authentication and authorization | Supabase Auth + RLS and approved application session enforcement |
| File storage | Supabase Storage |
| RAG | PostgreSQL + pgvector + full-text search |
| Normal AI response streaming | SSE |
| Background task execution and orchestration | Durable Supabase-backed jobs; LangGraph where appropriate |
| Background task real-time notifications | Cloudflare Durable Objects + WebSockets (Hibernation API) |
| Task recovery and authoritative status | Supabase PostgreSQL |
| Real-time fallback | Bounded lightweight polling |
| AI inference and embeddings | Approved free-tier providers under section 27.11 |

### 28.9 Planning sequence

The next product-design discussion remains **Documents, Editors and Creative Workspace**, as recorded in section 27.14. This performance and real-time architecture selection does not authorize implementation. Implementation remains blocked until the user reviews and explicitly approves the final consolidated blueprint.

## 29. Documents, editors and creative workspace — confirmed

The user approved a unified document-management architecture with specialised editing experiences, reliable persistence, version history and AI integration. This section records the approved direction. Implementation remains subject to approval of the final consolidated blueprint.

### 29.1 Core document model — confirmed

Dramora uses one unified project-content system built around four distinct concepts:

1. **Project** — the container for a creative undertaking and its shared context.
2. **Conversation** — a distinct discussion within a project.
3. **Document** — a persistent, independently addressable creative work.
4. **Asset** — an image, video, reference file or other media resource.

Documents and assets are separate entities. Documents are not merely messages embedded in conversation history. A project can contain multiple conversations, documents and assets. Conversations may create, revise and reference documents without creating unnecessary duplicate copies.

The document model must support cross-links to its project, originating or related conversations, relevant assets, document category and version history. Project-level and conversation-level context boundaries from section 27.2 remain in force.

### 29.2 Editor foundation — confirmed direction

Use the open-source Tiptap editor core, built on ProseMirror, as the foundation for Dramora's general creative editor and specialised screenplay editor.

- Do not make paid Tiptap Cloud services a required dependency.
- Do not assume managed collaboration or hosted document-history features are available on the Free-only architecture.
- Use Tiptap extensions and custom node/mark schemas for Dramora-specific structures.
- Store canonical document content as structured JSON using a versioned schema. HTML and other formats are rendered or exported representations, not the authoritative source.
- Validate the selected Tiptap version, extension licences, export libraries and compatibility during implementation research.

### 29.3 Specialised editing experiences — confirmed

Dramora provides at least two editing experiences on the shared document foundation.

**General creative editor**

Used for concepts, ideas, synopses, story outlines, character profiles, research notes, production plans, narration, scripts and other general creative documents.

Expected capabilities:
- Headings and text formatting.
- Ordered and unordered lists.
- Tables, quotes and callouts.
- Images and asset references.
- Internal document references.
- Search and replace.
- Word count and relevant document statistics.
- Undo and redo.
- AI-assisted rewriting, expansion, summarisation and refinement.

The editor should be focused and uncluttered rather than attempting to reproduce every feature of a full desktop word processor.

**Dedicated screenplay editor**

Use a screenplay-specific Tiptap configuration with structured screenplay elements:
- Scene headings, including INT./EXT., location and time.
- Action.
- Character cues.
- Dialogue.
- Parentheticals.
- Transitions.
- Optional shot/camera-direction elements.

Expected capabilities:
- Automatic screenplay formatting and keyboard navigation.
- Scene navigation and scene numbering.
- Character identification and references.
- Scene summaries.
- Page and word statistics.
- Screenplay preview and export.
- Scene-level AI editing and review.
- Links to relevant character, location and project-reference information.

The screenplay representation must preserve structural distinctions between screenplay elements rather than storing the screenplay as undifferentiated rich text.

### 29.4 Fountain interoperability — confirmed

Support the open Fountain screenplay format for import and export.

- Import Fountain into Dramora's structured screenplay representation.
- Export a screenplay to Fountain.
- Preserve scene headings, action, character cues, dialogue, parentheticals and transitions to the extent supported by the format.
- Validate conversions and report unsupported or lossy elements rather than silently discarding them.
- Fountain is an interchange format, not Dramora's sole canonical internal document representation.

### 29.5 AI document operations — confirmed

Dramora must support four core document-operation patterns:

1. **Create document:** generate a new document and save it as a persistent project resource.
2. **Insert content:** generate material and insert it at the selected or specified location.
3. **Revise selection:** work on a selected paragraph, scene, section or other structured range.
4. **Revise document:** propose a substantial revision of the document as a whole.

AI operations must understand the active project, open document, selected range and relevant project context, subject to bounded retrieval and authorization.

For substantial revisions, provide a review experience that makes the existing content, proposed content and differences understandable, with explicit accept/reject controls. Small changes explicitly requested by the user may be applied directly where safe.

AI suggestions must not silently overwrite established or approved creative work. Apply the autonomy, approval, established-fact and consequential-action rules in section 27.3. Preserve provenance and document versions for AI-generated changes.

### 29.6 Autosave and persistence — confirmed

Implement reliable automatic saving as the normal editing behaviour.

- Debounce ordinary typing changes; the proposed initial target is to schedule a save after approximately one second without input, subject to testing and tuning.
- Persist validated document changes to the backend and clearly expose save state.
- Display understandable states such as Saving, Saved, Offline, Save failed and Reconnecting.
- Preserve unsaved edits locally when network or persistence operations fail, and retry safely when connectivity returns.
- Prevent out-of-order saves from overwriting newer content. Use revision numbers, optimistic concurrency or an equivalent conflict-detection mechanism.
- Provide a manual save action where useful, without making it necessary for normal operation.
- Do not create a permanent historical version for every keystroke.

Canonical persistence responsibilities:
| Data | Authoritative location |
|---|---|
| Document content and metadata | Supabase PostgreSQL |
| Version history and revision metadata | Supabase PostgreSQL |
| Large attachments and exported files | Supabase Storage |
| Searchable chunks and embeddings | PostgreSQL + pgvector |
| Document editor working state | Client-side temporary state, reconciled with canonical server state |

Use RLS and server-side authorization for all document and version access. Local working state is a recovery aid, not the canonical record.

### 29.7 Document version history and restoration — confirmed

Provide document version history from the initial product architecture.

- Autosave updates the current document revision without necessarily creating a permanent snapshot for every keystroke.
- Create historical snapshots at meaningful milestones, configured intervals or other tested boundaries.
- Important AI-generated revisions should be identifiable in history.
- Users can create named versions.
- Users can inspect previous versions and restore them.
- Restoring an older version creates a new current version based on the selected historical content; it must never erase newer history.
- Preserve version metadata such as author/source, timestamp, revision relationship and meaningful change description where available.

Version history must integrate with the Restore semantics already approved in section 27.4.

### 29.8 Creative workspace interface — confirmed direction

Use a responsive workspace with three principal areas:

**Project navigation panel**
- Project title and navigation.
- Conversations.
- Documents and folders.
- Assets.
- Project organisation controls.
- Collapsible on desktop and adapted for mobile.

**Central creative area**
- General document editor.
- Screenplay editor.
- Document preview.
- Asset viewer.
- Version history and comparison/review views.

**Dramora assistant panel**
- Remains accessible while a document is being edited.
- Understands the active document and selected content.
- Supports contextual requests such as improving a paragraph, rewriting a scene, expanding a character, checking continuity, reviewing a screenplay or generating a scene breakdown.
- Can be collapsed to provide more writing space.

On mobile, prioritise a focused editing experience. Navigation, document actions and the assistant should be accessible through compact, responsive controls rather than forcing a desktop three-column layout onto a narrow screen.

### 29.9 Document organisation — confirmed direction

Support project-level folders and document categories together.

Users should be able to:
- Create folders.
- Rename and move documents.
- Duplicate documents.
- Archive documents.
- Search documents.
- Pin important documents.

Dramora may suggest or automatically assign sensible categories for generated documents, but users retain control of organisation. A suggested category must not silently move or hide existing user content.

The system should support useful starter organisation such as Development, Characters, Screenplay, Production and Reference without requiring every project to use a fixed folder template.

### 29.10 Import and export — confirmed direction

Dramora must provide document portability and must not trap user work in a proprietary editor.

**Initial export formats**
- PDF.
- DOCX.
- Markdown.
- TXT.
- Fountain for screenplay documents.
- Structured JSON for interchange/backup use.

**Initial import formats**
- DOCX.
- PDF.
- Markdown.
- TXT.
- Fountain.

Conversion must preserve structure and content as far as reasonably possible. Where source formatting or elements cannot be represented, provide a clear conversion warning or report instead of silently discarding information.

Validate the availability, quality, licensing and resource requirements of import/export libraries during implementation research. Keep file processing bounded and compatible with the Free-only infrastructure constraints.

### 29.11 Collaboration scope — confirmed initial boundary

Initial editing is single-user per document at a time. The architecture should not prevent future multi-user collaboration, but real-time collaborative editing is deferred until there is a demonstrated product need and a separately approved design.

Do not confuse:
- Cloudflare Durable Objects and WebSockets for application/task notifications, approved in section 28; and
- Collaborative document synchronization, which requires conflict-aware shared editing semantics and is not included merely by having WebSockets.

Future collaboration research may evaluate Yjs or an equivalent CRDT-based approach, synchronization hosting, permissions, presence, concurrent edits, offline changes and conflict recovery. Do not introduce paid managed collaboration services as a required dependency.

### 29.12 Release 1 scope — confirmed direction

Release 1 should include a coherent and genuinely useful document system with:
1. Document creation and management.
2. General creative editor.
3. Dedicated screenplay editor.
4. Reliable autosave and recovery of unsaved changes.
5. Document version history and safe restoration.
6. AI document creation, insertion, selection revision and substantial revision review.
7. Project folders, categories and organisation.
8. Initial document import and export formats listed above.
9. Integration with project memory, hybrid RAG, permissions and document provenance.
10. Responsive creative workspace with project navigation, central editor and assistant panel.

Real-time multi-user collaborative editing is deliberately deferred. This does not defer the foundational document model, persistence, version history or AI integration.

### 29.13 Technical validation before implementation

Before production acceptance, prove:
- Tiptap JSON documents round-trip through persistence without structural loss.
- Document schema versions can be migrated safely.
- Autosave handles rapid edits, out-of-order requests, refresh, offline recovery and concurrent revision conflicts without losing newer content.
- Version snapshots, comparisons and restore-as-new-version behave correctly.
- Screenplay nodes, keyboard navigation, Fountain import/export and screenplay preview preserve screenplay structure.
- AI insertion and revision target the intended document/range and cannot silently overwrite protected or approved content.
- RLS and server-side checks prevent cross-user and cross-project document, asset and version access.
- RAG indexing updates incrementally from canonical document versions and deleted/changed content is handled correctly.
- PDF, DOCX, Markdown, TXT, Fountain and JSON import/export are tested with representative documents, including explicit reporting of conversion limitations.
- The workspace remains usable on mobile and does not lose edits when panels are opened, closed or navigated.

### 29.14 Planning status

This section records the user's approval of the proposed document, editor and creative workspace architecture. Specific library versions, detailed schema definitions, export implementation choices, autosave tuning and migration strategy remain technical implementation findings to validate; they are not fixed merely by approving this architecture.

The next planning discussions are to be prepared in pairs:
1. **Visual Assets and Media Management**
2. **Project Continuity, Production Bible and Entity Management**

Prepare both together as a researched, consolidated proposal for user review. Do not begin implementation until the final consolidated blueprint has been reviewed and explicitly approved.



---

## 30. Visual Reference Cards and External Media Generation Management

### 30.1 Product principle — confirmed

Dramora is a creative planning, prompt-authoring and production-organisation system. It is not intended to become a large image/video hosting, processing or transcoding platform.

The primary managed visual resource is the **visual reference record/card**: the structured information, prompt, generation settings and project relationships needed to create or reproduce a visual externally.

Dramora does not natively generate images or videos. Users copy prompts and use external generation platforms. The generated media normally remains in the external platform and does not need to be uploaded to Dramora.

The core Release 1 workflow must not depend on uploading, storing, processing, serving or transcoding generated images or videos. Optional external media URLs or lightweight attachments may be considered where useful, but they are not prerequisites for the reference-card system and must not turn Dramora into a media-hosting dependency.

This direction supersedes the earlier proposal to make uploaded image/video libraries the centre of asset management. The word “asset” may still be used as a broad product concept, but the primary managed resources in this workflow are prompts, reference cards, structured entity information and their relationships.

### 30.2 Reference cards and resource boundaries — confirmed

Use cards only for resources that benefit from a compact visual-card presentation, including:
- Image-generation prompts and visual references.
- Video-generation prompts.
- Character sheets.
- Environment, costume, prop, animal/creature and other visual reference sheets where appropriate.
- Other discrete visual-generation instructions that benefit from quick scanning, copying and opening.

Do not represent every project resource as a card. Characters, locations, props, costumes and other entities remain structured entity/profile pages. Screenplays and other written materials remain documents. Scenes and shots remain structured production records. Timelines remain timeline views; continuity findings remain review/report records; relationships remain navigable through the Project Relationship Map.

A card is a presentation and interaction surface for a reference record. It is not the canonical parent of the entity or scene it describes. Cards connect to stable entity, scene, shot and document IDs.

### 30.3 Reference-card content — confirmed direction

A reference record should support fields appropriate to its type, rather than forcing every card into one rigid schema.

Common fields include:
- Stable reference ID.
- Clear, concise title that identifies what the card is for; use the character, animal, location, object or scene name where appropriate.
- Reference type (for example image, video, character sheet, environment, costume, prop, scene or shot reference).
- Associated entity/entities.
- Associated project, scene and/or shot.
- Intended output aspect ratio.
- Prompt text and optional negative prompt where supported.
- Generation settings and platform-specific parameters where known.
- Short preview/summary of the prompt.
- Status and approval information.
- Created/updated timestamps and provenance.
- Version history.
- Related references and dependencies.
- User notes and external platform information where useful.

Support relevant aspect-ratio labels, including but not limited to 16:9, 9:16, 1:1, 4:3 and 21:9. The aspect ratio is metadata describing the intended generated output; it does **not** dictate the physical dimensions or layout ratio of the UI card. Cards remain compact and responsive to preserve workspace space. The ratio label must remain visible and must not disappear when the card is compact.

### 30.4 Character sheets — confirmed requirements

When Dramora creates a character sheet, it must prepare a comprehensive sheet by default. The standard output/reference layout is always **16:9 landscape**, regardless of whether the final production is vertical 9:16, horizontal 16:9 or another format.

The character sheet should normally include, as appropriate:
- Full-body front view.
- Full-body side view.
- Full-body back view.
- Three-quarter view.
- Facial close-up.
- Multiple relevant facial expressions.
- Distinctive physical characteristics.
- Clothing and accessories relevant to the established design.
- Additional camera angles or views needed to understand and reproduce the character accurately.

Dramora determines the appropriate comprehensive set; users do not have to choose the required views every time. Users may suggest additional views, request adjustments or ask Dramora to modify the sheet. Such suggestions are considered and incorporated where appropriate, but they do not remove the expectation that Dramora prepares a complete standard sheet.

A character sheet is a visual reference, not the character's canonical identity record. It is connected to the character entity and its Visual Identity Profile. Approved character-sheet changes must preserve history; a new version must not silently erase an approved earlier appearance.

The 16:9 rule applies to character-sheet output/reference composition. It does not force individual scene images, shot references or generated video to use 16:9.

### 30.5 Visual Identity Profiles — confirmed direction

Visual Identity Profiles provide reusable, structured descriptions for characters, animals/creatures, locations, objects/props, costumes and other relevant entities.

They may include stable characteristics, variable characteristics, visual descriptions, identifying details, style constraints and linked reference cards. For characters, for example, facial structure or distinctive marks may be designated as stable, while clothing, pose and expression may vary by scene.

Visual Identity Profiles are **encouraged, not mandatory**. Dramora must not block a simple project or scene-specific prompt because a complete profile has not been approved. It should use available information, identify important gaps when relevant, and recommend creating a profile when doing so would materially improve consistency.

A profile is distinct from a generation prompt:
- The profile describes the established or proposed visual identity of an entity.
- A prompt describes a particular intended generated result, composition or action.
- Multiple prompts and reference cards may reuse one profile without duplicating or replacing the canonical entity.

### 30.6 Prompt types and external generation compatibility — confirmed direction

Support both image prompts and video prompts as first-class reference types. Do not label all prompt cards as image prompts.

Prompt records may be associated with:
- An entire scene.
- An individual shot.
- A scene segment/generation clip.
- A multi-shot sequence, where the target external platform supports it.
- An entity or visual reference independently of a particular scene.

Image prompts describe a still visual result, composition and relevant visual identity. Video prompts additionally describe motion and time-dependent behaviour, including action, camera movement, duration, start/end state and optional timeline instructions.

Keep platform-independent/general prompt content separate from platform-adapted instructions and settings. External platforms have different capabilities and constraints; Dramora must not assume universal support for character references, reference images, seeds, negative prompts, camera controls, multi-shot generation or particular durations. Platform-specific adapters may be added when supported and separately validated. Release 1 primarily prepares, organises, edits and copies prompts rather than requiring deep external-platform integrations.

### 30.7 Compact card interface — confirmed

**Desktop**
- Cards remain compact and space-efficient.
- Show a clear title, reference type (IMAGE or VIDEO, as applicable), associated entity/context where useful, and a permanently visible aspect-ratio label.
- Show only a short prompt preview; do not expose the entire prompt by default or overcrowd the gallery.
- Hover may reveal additional preview information and quick actions such as Copy Prompt. Hover must not be required to access essential functionality.
- Clicking a card opens a full-detail view/page where the user can read the complete prompt, copy it, edit it, save changes, inspect versions and see relationships/dependencies.

**Mobile**
- Do not depend on hover.
- Show compact cards with the title and aspect-ratio label visible.
- Provide a three-dot action menu for quick actions.
- Tapping a card opens a full-detail view/page with the complete prompt and the same core copy, edit, save, history and relationship functions available on desktop.

Card titles must be understandable without opening the card. For an entity-specific reference, the entity name should be prominent (for example, “DAVID — CHARACTER SHEET” or “DAVID ENTERS THE HOSPITAL”).

### 30.8 Reference-card status, editing and version history — confirmed direction

Support meaningful lifecycle statuses such as Draft, Awaiting approval, Approved, Needs revision and Archived. Status transitions and approval requirements must follow the autonomy and consequential-change rules in section 27.

Users can edit prompts directly in the full-detail view. Preserve meaningful prompt revisions, including original/AI-created and user-edited versions, authorship/source, timestamps and change descriptions where available. Users can inspect and restore an earlier prompt version by creating a new current version; never erase newer history.

Changing a prompt does not automatically change an entity's established identity or project canon. Changes to approved visual identity or references must be reviewed according to their impact and the user's autonomy mode.

### 30.9 Reference dependencies and change impact — confirmed direction

Reference cards may depend on or reference multiple entities, scenes, shots, documents and other reference cards. A scene or shot may use multiple character, environment, costume, prop and style references. One entity/reference may be reused by many scenes and shots.

Maintain explicit, stable-ID relationships and dependency records. If an established entity profile or approved reference changes, Dramora should identify potentially affected cards, scenes, shots and production packs. It should explain the impact and propose a review/update. It must not silently rewrite dependent approved prompts or creative work.

### 30.10 Production Reference Packs — confirmed

Users can create and export reference packs at all three scopes:
1. Entire project.
2. A particular scene or sequence.
3. Selected entities, such as chosen characters, locations, animals, props or costumes.

A pack should collect the relevant prompts, reference-card information, aspect ratios, generation settings, entity/scene/shot relationships, visual identity information and useful production notes. It should preserve a clear folder/file structure and identify dependencies or missing references.

Support a readable document-style export and a structured ZIP package containing organised prompt files and metadata. The package does not require generated image/video files. If optional external media links are included, label them as external references and do not imply that Dramora hosts or controls those files.

### 30.11 Infrastructure and data boundaries — confirmed direction

The reference-card system should primarily use the existing Supabase PostgreSQL architecture for structured records, relationships, status, versions and metadata. Relevant searchable text may be indexed through the approved hybrid RAG architecture. Large media storage, image transformations, video transcoding and media-delivery infrastructure are not required for the core workflow.

Do not make Supabase Storage, Cloudflare R2 or another media-storage provider a mandatory dependency for generated media. Cloudflare R2 remains rejected as a required choice under the user's prior constraints. Any future optional attachment or external-storage capability requires separate cost, free-tier, access-control and operational review.

The strict Free-only rule remains in force. No paid generation, storage, processing, delivery or integration fallback may be activated automatically.

### 30.12 Release 1 scope and validation

Release 1 should include:
- Structured image and video reference records/cards.
- Compact responsive card gallery and full-detail views.
- Permanent aspect-ratio labels independent of card dimensions.
- Prompt copy, edit, save and version history.
- Comprehensive 16:9 character-sheet prompt/reference preparation.
- Encouraged, non-mandatory Visual Identity Profiles.
- Entity, scene and shot relationships.
- Draft/approval/revision states.
- Dependency identification and impact review.
- Project, scene and selected-entity Production Reference Pack exports.
- No requirement to upload or host generated images/videos.

Validate:
- Card metadata and prompt versions persist and restore safely.
- Desktop hover and mobile three-dot/full-detail interactions are accessible.
- Aspect-ratio labels remain visible at compact sizes.
- Character sheets consistently specify a 16:9 comprehensive reference layout, independent of final output ratio.
- Prompts retrieve the correct approved entity identity and relevant references.
- Entity/reference changes identify dependent resources without silently modifying them.
- Production packs preserve prompt text, metadata, relationships and folder structure.
- The core workflow functions when no media files are uploaded and when AI quota is unavailable.

---

## 31. Project Bible, Entity, Scene, Shot and Continuity Management

### 31.1 Core principle — confirmed

Scenes and shots are first-class structured project resources. They are not merely temporary AI outputs or unstructured sections of a screenplay.

Dramora must connect creative development, screenplay/document content, structured scenes, shots, visual reference cards, entities, video prompts, continuity information and production exports.

The underlying resources remain distinct and are connected through stable IDs and explicit relationships. The Project Relationship Map visualises those relationships; it does not replace the canonical records or normal navigation.

### 31.2 Project Bible — confirmed direction

Each project should have a structured Project Bible containing the project's established information and useful creative/production knowledge, including as relevant:
- Project identity, premise, genre, themes and creative direction.
- Characters and their profiles.
- Locations and world/environment details.
- Props, objects, costumes and other entities.
- Relationships between entities.
- Story rules and established facts.
- Timeline and significant events.
- Visual direction and linked visual references.
- Relevant production information.

The Bible should be useful for both simple and complex projects. It must remain lightweight and activate only the sections relevant to the user's project; a simple social video must not be forced through a full film-production setup.

The Project Bible is structured and editable, not merely one long document or an unfiltered conversation transcript. Dramora may also generate a readable document view/export from the structured records.

### 31.3 Entity management — confirmed direction

Support structured project entities, including:
- Characters.
- Locations/environments.
- Props and objects.
- Costumes/wardrobe.
- Organisations.
- Vehicles.
- Animals and creatures.
- Other project-specific entity types where needed.

Scenes, sequences and shots are structured production records and may be represented in the relationship map, but should not be forced into the same semantic category as a character or physical object.

An entity should have, as appropriate:
- Stable unique ID and project ID.
- Entity type and name.
- Aliases.
- Description and structured attributes.
- Visual Identity Profile, where useful.
- Relationships to other entities.
- Linked documents.
- Linked scenes and shots.
- Linked reference cards.
- Canon/fact status and provenance.
- Version/change history.

Entity names may change; stable IDs preserve relationships. Alias and identity-resolution support should prevent similarly named entities from being incorrectly merged. Dramora may suggest a possible match but must not merge distinct entities without appropriate confirmation.

### 31.4 Canon, facts, proposals and provenance — confirmed

Distinguish at least these statuses:
- **Confirmed:** accepted as project canon or an established project fact.
- **Proposed:** suggested but not accepted.
- **Unresolved:** requires a decision.
- **Rejected:** explicitly rejected by the user.
- **Deprecated:** formerly established but superseded or retired.

Important facts and changes should preserve provenance, including source document/conversation or user action, author/source, timestamp, approval and prior value where available.

Dramora's suggestions do not become canon merely because the model generated them. User approval and the autonomy rules in section 27 govern canon changes, consequential changes and replacement of approved work.

### 31.5 Entity relationships and implementation direction — confirmed

Represent relationships using Supabase PostgreSQL relational records rather than introducing a separate graph database as a required service.

The schema should support typed, project-scoped relationships such as:
- Character is related to another character.
- Character owns or uses a prop.
- Character wears a costume.
- Character appears in a scene or shot.
- Scene takes place at a location.
- Prop appears in a scene or shot.
- Reference card describes or visually represents an entity.
- Document describes or establishes information about an entity.
- Event involves entities and occurs at a point/period in story chronology.

Use stable IDs, relationship types, relevant metadata and project-level authorization. The Project Relationship Map can query and visualise these records. Avoid a separate graph database unless a demonstrated need and separately approved architecture justify it.

### 31.6 Story timeline and chronology — confirmed direction

Support a structured story timeline and project events. Distinguish:
- Story chronology (when an event happens in the fictional world).
- Screenplay/reading order (where the scene appears in the written work).
- Production/shooting order (when the scene is produced).
- Flashbacks, flash-forwards and simultaneous events.

A scene's position in the screenplay must not be treated as proof of its chronological position in the story. Events may link to scenes, characters, locations and other entities. Dramora can identify potential chronology conflicts and provide evidence, but intentional non-linear storytelling must remain supported.

### 31.7 Scene records — confirmed

A **scene** represents a continuous story event or dramatic unit in a particular setting/time. It is distinct from the screenplay document that contains or describes it.

A scene record should support, as relevant:
- Stable scene ID and project ID.
- User-facing scene number and title.
- Story sequence/order and optional chronology link.
- Scene purpose and summary.
- Interior/exterior, location, time of day and environment.
- Characters and other participating entities.
- Story actions, conflict, emotional progression and important revelations.
- Dialogue/script content references.
- Props, costumes and production requirements.
- Estimated duration.
- Related screenplay/document sections.
- Related shots and scene segments/generation clips.
- Related reference cards and prompts.
- Continuity notes and findings.
- Status, approvals, provenance and version history.

Internal scene IDs must remain stable when display numbering or screenplay order changes. Display numbers can be recalculated without breaking relationships.

Users must be able to create, edit, reorder, organise and manage scenes manually. Dramora must also be able to create scenes from conversation instructions, story outlines, screenplays and other relevant project material. It should ask for clarification only when missing information materially affects the result; otherwise it may make clearly identified proposals.

### 31.8 Shot records and automatic shot breakdown — confirmed

A **shot** is a specific camera view/composition or visual moment within a scene. It is not synonymous with a scene or a video-generation clip.

Dramora should automatically propose a suitable shot breakdown from a scene, subject to user review and editing. Users can also create and manage shots manually.

A shot may contain, where relevant:
- Stable shot ID and display number/order.
- Parent scene ID.
- Shot title and purpose.
- Framing/shot size.
- Camera angle.
- Camera movement.
- Composition and character positioning.
- Characters and other entities present.
- Character action and expression.
- Location/environment.
- Lighting and visual direction.
- Dialogue/narration or sound instructions.
- Estimated duration.
- Continuity requirements.
- Required visual references.
- Related image and video prompts/cards.
- Version and approval information.

Shot lists must support adding, editing, duplicating, reordering, removing, and requesting additional or revised shots. Shot breakdowns should be appropriate to the scene and the user's intent; Dramora must not impose an unnecessarily elaborate cinematic shot structure on a simple video.

### 31.9 Scene segments and generation clips — confirmed requirement

A scene may be longer than the maximum duration supported by a chosen external video-generation platform. Dramora must therefore distinguish the story scene from the smaller **scene segments/generation clips** used to produce it.

A scene can remain one continuous story scene while being divided into multiple generation segments. For example, a 50-second scene intended for a platform with a 10-second per-generation limit may be planned as five sequential 10-second generation clips. These clips remain parts of the same scene; they must not be misrepresented as five separate story scenes.

The system should support:
- Total intended scene duration.
- Selected/target external generation platform where known.
- Configurable or platform-informed maximum clip duration.
- Proposed segment count and duration per segment.
- User adjustment of segment boundaries and durations.
- Handling of a final remainder when the total duration does not divide evenly.
- Segment order and stable IDs.
- Segment-specific actions, dialogue, camera direction and prompts.
- Links from each segment to one or more shots.
- Continuity handoff information between consecutive segments, including character position, action state, environment, costume, props, lighting and camera state where relevant.
- Segment-specific image/video reference cards and generation settings.
- Total-duration and segment-duration validation.

Dramora should recommend a practical segmentation based on the target generator's verified capabilities, not assume every platform supports 10-second clips. If the platform is unknown, it can use a user-selected target duration and clearly label it as an assumption.

**Do not conflate scenes, shots and generation segments.**
- A scene is a story unit.
- A shot is a camera composition or view.
- A generation segment is a bounded clip-generation unit required by the target platform's duration or workflow constraints.

A segment may contain one shot or, where appropriate and supported, multiple shots. A shot may be represented across generation segments if the action requires it. The relationships must support these cases without forcing a one-to-one mapping.

Dramora should propose segment boundaries that preserve coherent action and continuity. It should avoid arbitrary cuts that create broken movement, inconsistent character positions or impossible transitions. Users can review and adjust the proposed segmentation.

### 31.10 Scene/shot prompt relationships — confirmed direction

Support prompts at multiple levels:
- Scene-level image or video prompts describing an overall visual direction or sequence.
- Shot-level image or video prompts describing a specific composition or action.
- Segment-level video prompts describing the bounded clip to be generated.
- Optional multi-shot video prompts combining multiple shots when the external platform supports that workflow.

A video prompt may belong to an entire scene, an individual shot, a scene segment or a supported multi-shot sequence. It is not restricted to only one level.

Do not automatically combine all shots into one video prompt. Keep individual shot/segment control available so users can regenerate or revise a specific part without unnecessarily changing the rest of the scene.

Prompt records are reference cards under section 30 and connect to the relevant scene, shot, segment and entities. Scene/shot/segment records remain independent of their prompts.

### 31.11 Scene and shot workspace — confirmed direction

Each scene should have a dedicated responsive workspace with:
1. **Scene overview:** title/number, purpose, duration, setting, characters, story information and continuity status.
2. **Shot breakdown:** ordered shots with controls to create, edit, duplicate, reorder and request AI changes.
3. **Segments/generation clips:** total duration, target clip duration, ordered segments, duration controls, continuity handoffs and associated shots/prompts.
4. **Visual references:** relevant character sheets, entity references, image prompts and video prompts.
5. **Documents/script context:** linked screenplay section and other relevant documents.
6. **Dramora assistant:** context-aware of the active scene, selected shot or segment, and relevant project information.

Users should be able to ask Dramora to revise a selected shot or segment without unnecessarily rewriting the whole scene. Examples include changing camera framing, adjusting an action, revising a prompt or adding a shot while preserving approved character identity and unrelated work.

### 31.12 Screenplay/document integration and change impact — confirmed

Screenplay documents and structured scene/shot records are connected but distinct:
- The screenplay remains the authoritative written document for its script content.
- Structured scene records represent the production/story breakdown.
- Shot records represent camera compositions.
- Generation segments represent bounded external video-generation units.
- Reference cards hold prompts and visual-generation instructions.

Dramora should be able to create or update structured scene records from screenplay content and connect them to the corresponding screenplay sections. Changes to screenplay content should trigger an impact review of affected scenes, shots, segments and prompts.

The user explicitly approved this behaviour subject to a strict protection rule:
- Never silently overwrite approved scene, shot, segment, prompt or other creative work.
- Identify what changed in the source screenplay and which dependent resources may be affected.
- Explain proposed changes and obtain approval where required by section 27.
- When an approved change is applied, automatically run appropriate consistency/integrity checks on the affected records and relationships.
- Report clearly what was changed, what was checked, the outcome, and anything that could not be updated or verified.
- Preserve previous versions and provenance.
- Do not claim successful verification if a check was not actually performed or failed.

The same dependency-review approach applies when established character, location, costume, prop or visual identity information changes.

### 31.13 Continuity checking — confirmed direction

Dramora should provide on-demand and relevant workflow-stage continuity checks rather than continuously invoking AI on every edit.

Checks may cover:
- Character appearance and identity.
- Character age and other established attributes.
- Character knowledge and information access.
- Character relationships and motivations where canonically established.
- Location and environment details.
- Props and object ownership/position/state.
- Costume and wardrobe continuity.
- Injuries and physical condition.
- Story chronology and event order.
- Scene transitions and generation-segment handoffs.
- Visual references and approved identity constraints.

Each finding should provide:
1. Severity/category, such as Conflict, Potential issue or Suggestion.
2. What was detected.
3. The relevant established fact or prior state.
4. The scene, shot, segment or document where the issue appears.
5. Supporting evidence and source references.
6. A proposed resolution where useful.

Continuity findings are advisory until accepted. Dramora must account for intentional exceptions such as disguise, flashbacks, lies, character transformation, deliberate costume changes or unreliable narration. It must not silently rewrite content to resolve a finding.

AI continuity checking cannot guarantee detection of every inconsistency. The UI and documentation must not promise perfect continuity.

### 31.14 Project Relationship Map — confirmed

Provide a visual **Project Relationship Map** that shows how project resources connect. It is an additional navigation and exploration surface, not a replacement for normal project navigation, entity pages, documents, scene workspaces or reference-card galleries.

The map should be able to visualise relevant relationships among:
- Project and project sections.
- Conversations.
- Documents and screenplay sections.
- Characters and other entities.
- Locations, props and costumes.
- Timeline events.
- Scenes.
- Shots.
- Scene segments/generation clips.
- Image/video reference cards.
- Continuity findings.
- Production Reference Packs.

Expected interactions:
- Zoom and pan.
- Move/reposition nodes where appropriate.
- Click a node to open its resource.
- Search for an entity, scene, shot or document.
- Filter by resource type.
- Expand/collapse groups.
- Highlight direct and related connections.
- Provide focused views such as character relationships, scene/shot structure, visual-reference dependencies and the overall project map.

The map should be generated from canonical relational data and stable IDs, not maintained as a separate manually duplicated source of truth. It must respect project permissions and avoid exposing cross-project information.

### 31.15 Production Reference Packs and production preparation — confirmed

Scene/shot/segment relationships feed into Production Reference Packs as defined in section 30. Packs can be produced for a whole project, a scene or selected entities.

For a scene pack, include relevant scene information, ordered shots, generation segments, character/location/prop references, image prompts, video prompts, aspect ratios, generation durations/settings, continuity notes and dependencies.

The Film Studio may additionally prepare production-oriented outputs such as scene breakdowns, character/location lists, props, costumes, production notes and shooting schedules. These should remain structured and linked to the canonical project resources.

### 31.16 Studio-specific workflows — confirmed direction

Both studios share the same underlying entity, scene, shot, segment, prompt, reference-card and relationship architecture, but should not be forced into identical workflows.

**AI Video Studio**
- Focus on video concepts, scenes, shots, duration planning, generator-aware scene segmentation, image/video prompts and visual reference preparation.
- Support simple social/marketing/educational videos with lightweight structures as well as complex cinematic productions.
- Do not force a full film-production workflow when the user's intent does not require it.

**Film Studio**
- Support professional screenplay development and structured scene extraction.
- Provide deeper scene and shot breakdowns, character/location/prop/costume continuity and production preparation.
- Connect screenplay changes to structured scene/shot/segment impact reviews.
- Support shooting/production order separately from story chronology.

### 31.17 Release 1 scope — confirmed direction

Release 1 should include a coherent foundational system:
1. Structured Project Bible and project facts.
2. Entity profiles and typed relationships.
3. Canon/proposal/unresolved/rejected/deprecated statuses and provenance.
4. Character, location, prop, costume, animal/creature and other relevant entities.
5. Structured story events and chronology.
6. Manual scene creation and management.
7. AI scene creation from conversation and screenplay material.
8. Automatic proposed shot breakdowns with user review/editing.
9. Manual shot creation and management.
10. Scene duration and generator-aware segmentation into multiple generation clips.
11. Segment-to-shot relationships and continuity handoff details.
12. Scene-, shot- and segment-level image/video prompt relationships.
13. Screenplay-to-scene links and change-impact review.
14. Evidence-backed on-demand/workflow-stage continuity checks.
15. Project Relationship Map based on canonical records.
16. Integration with reference cards and Production Reference Packs.
17. Version history, approval, provenance and safe restoration across meaningful structured resources.

Advanced visual analysis of generated media and other capabilities that require hosting or processing uploaded media are not prerequisites for this architecture and require separate research/approval if considered later.

### 31.18 Technical validation before implementation

Before production acceptance, validate:
- Stable IDs preserve links when scene/shot display numbers or ordering change.
- Manual and AI scene creation produce valid structured records.
- Automatic shot breakdowns are editable and do not overwrite approved content.
- Scene duration can be divided into configurable generation segments, including non-even remainders.
- A 50-second scene can be represented as five 10-second generation segments without becoming five story scenes.
- Segment-to-shot relationships support one-to-many and many-to-one cases where required.
- Segment continuity handoff data is preserved and surfaced in prompts.
- Platform duration constraints are configurable/validated and are not assumed universally.
- Scene-, shot-, segment- and multi-shot prompts connect to the correct references and entities.
- Screenplay changes identify affected records and produce a review before protected changes.
- Approved changes trigger real integrity/consistency checks and a truthful completion report.
- Version history and restore-as-new-version preserve previous work.
- Continuity findings cite relevant project evidence and do not automatically rewrite canon.
- Project Relationship Map is generated from canonical relationships, supports filtering/navigation and enforces project isolation.
- RAG and relational retrieval remain scoped by user/project permissions.
- Production Reference Packs preserve ordering, relationships, metadata and prompt content.

### 31.19 Planning status

This section records the user's approval of the Project Bible, entity, scene, shot, scene-segmentation, continuity and Project Relationship Map architecture described here. The detailed relational schema, graph rendering library, generation-platform capability registry, segment-boundary algorithms and exact UI layout remain implementation research and design tasks. They must be validated against the approved architecture and Free-only constraints before implementation.

The overall product remains subject to the user's requirement that the final consolidated technical blueprint be reviewed and explicitly approved before coding begins.


---

# 32. Final consolidated architecture decisions — November 21, 2026

**Status:** Consolidated from the user's approved planning decisions. This section is authoritative wherever earlier sections conflict with it. The user explicitly authorised consolidation and the start of implementation on November 21, 2026.

## 32.1 Product scope and operating model

Dramora has exactly two studios:
1. **AI Video Studio** — creative development and complete production preparation for AI-video projects.
2. **Film Studio** — film/story development, professional screenplay work and production preparation.

There is one user-facing assistant: **Dramora**. LangGraph, where validated and appropriate, is an internal orchestration implementation detail; it is not a separate assistant or product identity.

Dramora understands before creating, plans before executing, and preserves completed work. Users can work conversationally without being forced through long setup forms. Users control project titles; conversation titles are generated automatically and remain editable. A project can contain multiple conversations with shared project context and distinct conversation context.

The product is a creative planning, writing, research and production-management workspace. External platforms perform actual image/video generation and professional media editing. Dramora prepares the concepts, scripts, scenes, shots, prompts, references, continuity information and production materials needed to use those platforms. Dramora must never imply that it generated media when it only prepared instructions.

The architecture should leave room for future expansion, but future possibilities are not Release 1 commitments. Possible later capabilities include native image/video generation, audio/voice generation, video editing, advanced storyboarding, external integrations, collaboration and advanced media management. Each requires separate feasibility, free-tier, privacy and approval review.

## 32.2 Release 1 scope and boundaries

Release 1 is a coherent, substantial product, not a deliberately crippled MVP. It includes:

**Shared platform**
- Public landing page and account registration/login.
- Supabase Auth and private user workspace.
- Project and conversation management.
- One Dramora assistant across the two studios, with studio-aware context.
- Guided, Balanced (default) and Autonomous modes.
- Durable background tasks, progress, checkpoints, approvals, stop/continue/retry and recovery.
- Persistent conversations and bounded context retrieval.
- Project Bible, structured project memory and provenance.
- Documents, editing, autosave, meaningful version history, restore-as-new-version, folders and import/export.
- Visual reference cards, prompts, entity profiles and Production Reference Packs.
- Project Relationship Map and relevant continuity/impact checks.
- Storage lifecycle management and usage visibility.
- Security, privacy, legal disclosures, operational monitoring and tested backup/export recovery.
- Responsive desktop and mobile workspace.

**AI Video Studio**
- Conversational concept and format development for social videos, advertising, YouTube, music videos, documentaries, educational content, cinematic storytelling and other user-defined video work.
- Script, narration, scene, shot and duration planning appropriate to the user's intent.
- Character, location, prop, costume and other visual entity development.
- Image/video prompt authoring and platform-adapted prompt instructions.
- Research into external generation platforms, with current source-backed capability checks.
- Generator-aware scene segmentation, continuity handoffs and production preparation.
- Reference cards, scene/shot workspaces and exportable production packs.

**Film Studio**
- Concept, premise, theme, logline, synopsis, genre and story development.
- Story structure, acts, sequences, plot, conflict, turning points and endings.
- Character histories, motivations, relationships and arcs.
- World/location development.
- Professional screenplay creation, revision, review and a dedicated screenplay editor.
- Structured screenplay-to-scene links and change-impact review.
- Scene breakdowns, cast, locations, props, costumes, shooting schedules, production notes and call sheets.
- Project documents and exportable production materials.

The detailed Project Bible, scene, shot, segment, reference-card and document requirements in sections 29–31 are Release 1 requirements, subject to the technical validation gates already recorded there. The product must support lightweight workflows for simple videos as well as deeper cinematic workflows when appropriate.

## 32.3 AI provider policy and model groups

Approved providers:
- **Cloudflare Workers AI**
- **Google Gemini API**
- **GroqCloud**

OpenRouter is explicitly excluded and must not be reintroduced.

Strict free recurring usage is mandatory:
- No paid upgrades or paid credits.
- No automatic paid usage or paid billing fallback.
- No hidden charges.
- No reliance on temporary trial credits.
- A free tier that requires a payment method is not automatically considered an acceptable sustainable free option; verify the actual provider/account requirements.
- When a quota is exhausted, pause/defer or use only an already-approved compatible free alternative.
- Provider/model availability, rate limits, data policies and free eligibility must be rechecked against official documentation and the actual account console before enabling production use.

Do not assign a separate model to every item in the 120-task inventory. Organise model capability into these broad groups:
1. **Main Intelligence and Production Models** — conversation, reasoning, planning, creative development, screenplay, documents and structured workflows.
2. **Lightweight Background Models** — titles, summaries, classification and small repetitive tasks.
3. **Visual Intelligence** — image understanding, visual analysis and document interpretation.
4. **Image Generation** — capability group reserved for a future approved integration; not a Release 1 native generation feature.
5. **Audio Specialists** — transcription and related audio capabilities.
6. **RAG Support** — embeddings and retrieval support.
7. **Safety Support** — prompt-injection detection and content classification.

Use a capability-aware router within each group. Keep provider-specific code behind small adapters. Do not create a large routing framework before actual provider integrations justify it. Deterministic application operations must remain ordinary code, not AI calls. Preserve room to add models later.

The 120-task inventory is a functional task inventory, not 120 model assignments. Select models by broad capability, context requirements, latency, reliability, quota and privacy. Model selection must not over-engineer quality scoring or add needless model calls.

### Audio specialists

Retain both Whisper variants through GroqCloud, subject to current free quota and availability:
- Default transcription: Whisper Large V3 Turbo.
- Higher-accuracy alternative: Whisper Large V3.
- Use only the approved Groq free quota; no paid fallback.
- Do not assume the Turbo model supports translation-to-English; its supported task differs from full Whisper Large V3.

### Candidate models are not guaranteed production approvals

The previously researched Cloudflare, Gemini and Groq model names are candidates, not guarantees of current free availability. Verify exact model IDs, free eligibility, limits and provider terms before enabling them. In particular, Cloudflare's catalogue may contain models that require a paid Workers plan or otherwise do not fit the free-only policy. Do not activate a model solely because it appears in a catalogue.

## 32.4 Backend and infrastructure — authoritative direction

Use **one primary database: Supabase PostgreSQL**. Do not introduce Cloudflare D1, Neon or another database as an additional production database. Supabase remains the system of record.

Planned backend responsibilities:
- Supabase Auth for identity.
- Supabase PostgreSQL for canonical application records.
- PostgreSQL RLS for data isolation and database-enforced permissions.
- Supabase Storage for private file objects.
- Supabase Edge Functions for protected server-side business logic, AI orchestration and privileged operations where appropriate.
- Supabase Queues/pgmq for durable queued work where appropriate.
- Supabase pgvector plus PostgreSQL full-text search for approved hybrid retrieval.
- Supabase Cron only where its free availability and operational suitability are verified.

Do not route every CRUD operation through an Edge Function. Ordinary authorised reads/writes may use the Supabase client directly with RLS. Use Edge Functions for operations that require protected secrets, privileged checks, orchestration or server-side processing. Batch related operations and avoid unnecessary function invocations.

Cloudflare is a supporting edge platform, not a second database or heavy compute platform:
- Cloudflare Workers for lightweight edge routing/delivery where useful.
- Cloudflare Durable Objects and WebSockets for realtime notification delivery where justified.
- Polling is the recovery fallback for notifications.
- Cloudflare CDN/frontend delivery as validated against the selected deployment architecture.
- Keep Worker CPU work minimal because the Free plan's per-request CPU constraint is restrictive.
- Do not use Cloudflare D1.
- Do not use Cloudflare Workflows or Hyperdrive as required architecture components. This supersedes earlier proposals in sections that list them as planned dependencies.

Supabase PostgreSQL remains authoritative for task status, checkpoints, approvals, project data and outputs. Realtime transport is not the source of truth. A dropped WebSocket must not lose task state.

Use strict free recurring plans only. Before deployment, revalidate official plan limits, pausing behaviour, invocation limits, storage limits, execution limits, data transfer limits and whether any required feature is paid-only. Never silently enable a paid service.

## 32.5 AI workflow execution and autonomy

Expose three modes:
- Guided.
- Balanced (default).
- Autonomous.

Provide Stop, Continue, Retry and Restore controls. Restore applies to document/version history; it must not be presented as an arbitrary rollback of external side effects.

Substantial workflows must be durable and backend-owned. Persist task ID, status, input, stage, checkpoint, retry state, stop request, approvals, outputs, errors and timestamps. Browser refresh, tab closure or connection loss must not cancel durable tasks. Reconnection must restore actual persisted state.

Use checkpoints, idempotency keys, unique operation identifiers, bounded retries/backoff and output verification. Never claim exactly-once execution across external providers. Aim for effectively-once persisted application outcomes where feasible.

User approval is required for consequential changes and protected creative work. Approval records persist. AI suggestions do not become canon until accepted. A stop request must be persisted and observed at safe checkpoints; do not promise instant interruption of a provider request already in flight.

## 32.6 Project memory, RAG and retrieval

RAG is a core architecture capability, implemented with Supabase PostgreSQL and pgvector, not a separate vector database.

Use hybrid retrieval:
- Semantic vector retrieval.
- PostgreSQL full-text retrieval.
- Reciprocal Rank Fusion or a validated equivalent to combine results.

Use content-aware chunking for screenplay scenes, character/entity sections, acts/sequences, document headings and conversation summaries. Store source IDs, document/version references, project scope, chunk hashes and provenance. Retrieval must be scoped by authenticated user, project, studio and resource permissions.

Embedding model and vector dimensions remain subject to benchmark and current free-tier verification. Embeddings are derived/regenerable data, not canonical project truth. Query and document embeddings must use the same model and dimensions; never mix vector spaces. Incremental re-indexing must verify replacement chunks before deleting obsolete ones. If embedding quota is exhausted, continue PostgreSQL full-text search and pause semantic indexing until quota is available.

Use bounded retrieval, not indiscriminate submission of all project history. Distinguish project memory, structured canon, conversation summaries and user-level preferences.

## 32.7 Security, privacy and legal requirements

Security and privacy are foundational Release 1 requirements.

**Authentication and authorisation**
- Supabase Auth is the identity authority.
- RLS protects all user-owned records.
- Server-side functions independently validate permissions before privileged operations.
- Never trust browser-supplied user/project identifiers without authentication and ownership checks.
- Keep service-role credentials and provider keys server-side only.
- Private storage buckets and authorised access by default.

**Secrets**
- Use server-side secret management.
- Never place provider keys, service-role keys, tokens or credentials in browser bundles, ordinary project records or AI prompts.
- Support credential rotation and avoid logging secrets.

**Untrusted content and prompt injection**
- Treat imported documents, scripts, research content, web pages and user-supplied files as untrusted input.
- Separate system instructions from untrusted content.
- Detect and constrain prompt injection.
- Validate model-generated structured outputs.
- AI-discovered instructions inside a document must never become executable instructions automatically.
- Read-only tools and mutation tools must have separate permission boundaries.
- Destructive/consequential operations require application authorisation and suitable confirmation.

**Privacy policy**
- Projects are private by default.
- No public sharing unless the user explicitly enables it.
- Users own their creative work and project materials, subject to applicable law and third-party rights.
- Dramora will not use private creative project content to train or improve Dramora's own AI systems.
- Send external providers only the minimum context needed for the current task.
- Never send passwords, authentication tokens or private credentials to models.
- External AI providers have their own data-handling terms. Disclose relevant external processing and verify each provider's applicable retention/training terms before production use. Do not imply that Dramora's own no-training policy controls external providers.
- Provide appropriate data export, archive and deletion controls.

**Legal pages and contextual notices**
Create dedicated public Terms of Service and Privacy Policy pages. Include relevant copyright/intellectual-property, AI accuracy, external-platform responsibility, commercial-use, production-safety and limitation-of-liability terms. Make both policies accessible during registration, login and account settings. Registration must capture explicit acceptance of the applicable policy versions where legally appropriate. Store policy version and acceptance timestamp. Material policy changes must trigger an appropriate re-acceptance flow.

Show contextual notices where relevant, including external AI processing and limitations of AI-generated information. Do not bury material disclosures exclusively in a long legal document.

Dramora is not a legal adviser, copyright authority, production-safety certifier or guarantee of commercial success. Users remain responsible for reviewing outputs, third-party rights, external platform terms and real-world production safety. Obtain jurisdiction-appropriate legal review before public launch; the product must not claim that generic disclaimers eliminate liability.

## 32.8 Database Storage Lifecycle Management

Implement a permanent backend capability named **Database Storage Lifecycle Management**.

Classify data as:
1. Active user data.
2. Historical/versioned data.
3. Temporary operational data.
4. Regenerable/derived data.
5. User-deleted data within its recovery window.

Protect projects, final/approved documents, screenplay materials, accepted canon, approved reference cards/prompts, important conversations and user-created production resources. Never automatically delete protected creative work merely because a storage threshold is approaching.

Temporary outputs, expired caches, abandoned uploads, completed temporary task details, obsolete embeddings and duplicate indexing jobs may be cleaned according to explicit, documented retention policies. Exact retention periods and thresholds must be selected after measuring actual usage and reviewing the applicable free limits; previously discussed durations/percentages are proposals, not fixed approved constants.

Archiving must not silently delete original conversation history. User deletion must explain the recovery period and final deletion consequence. Storage object deletion must be coordinated with database references; deleting a row does not delete the corresponding Storage object.

Monitor database size, largest tables/indexes, vector growth, conversation/version growth, Storage use, cleanup backlog and growth rate. Cleanup must be batched, idempotent, FK-safe, audited and conservative. PostgreSQL DELETE does not immediately shrink allocated database size; account for MVCC, vacuum and bloat. Do not run disruptive maintenance such as VACUUM FULL routinely.

Provide a storage dashboard showing usage, major categories, temporary/regenerable data, cleanup history and estimated recoverable space. If limits are approached, clean eligible temporary/derived data first, then warn or restrict nonessential writes. Never sacrifice important user content automatically.

## 32.9 Reliability, backup, portability and disaster recovery

All substantial tasks use durable backend state, checkpoints, idempotency, bounded retries and safe resume. Provider failures must be classified:
- Transient availability/network error: bounded retry with backoff.
- Rate limit: respect provider retry instructions and quota.
- Free quota exhausted: pause/defer or use an already-approved free alternative.
- Invalid response: validate and retry within limits.
- Model unavailable: route only to a compatible approved model.
- All approved providers unavailable: pause and inform the user.
- Authentication/configuration failure: stop and report clearly without exposing secrets.

The browser is never responsible for keeping an important task alive. Polling must recover missed notifications. Errors shown to users must be understandable and must not expose raw secrets or internal stack traces.

### Portable PostgreSQL backup and restoration

Database portability is a first-class requirement. Supabase remains the initial primary database; this requirement does not authorise adding Neon, D1 or another database now.

Maintain version-controlled schema migrations and database logic. The backup/export path must use standard PostgreSQL logical backup/restore capabilities (for example, custom-format `pg_dump`/ `pg_restore` where supported) and include:
- Schemas, tables and data.
- Primary/foreign keys, constraints and sequences.
- Indexes, views and materialized views.
- Functions, procedures and triggers.
- RLS policies and grants.
- Required extension declarations and compatibility information.
- Relevant role/grant definitions, handled securely and adapted to the destination.

The restore process must check PostgreSQL version, extension availability, required roles, ownership and platform-specific dependencies before applying the backup. Do not promise a one-click restore to an arbitrary PostgreSQL host without these checks.

A PostgreSQL dump does not by itself reproduce the entire Supabase platform. Keep separate, version-controlled and recoverable manifests/source for:
- Supabase Auth configuration and identity migration requirements.
- Storage bucket configuration and actual object files.
- Edge Function source code and deployment configuration.
- Function secrets and environment configuration (encrypted; never included in plaintext backups).
- Realtime/publication settings and other Supabase-specific service configuration.
- Provider and OAuth settings requiring destination credentials.

Provide a documented, automated-as-possible restore workflow for another compatible Supabase project and a separate compatibility path for a plain PostgreSQL destination. A plain PostgreSQL restore preserves database logic/data where compatible, but Supabase Auth, Storage, Edge Functions and Realtime need compatible replacement services or a compatible self-hosted Supabase environment.

Backup files must be encrypted, checksummed, independently stored outside the source database/project, access-controlled and retention-managed. Never treat a backup stored only in the same database/project as sufficient disaster recovery. Keep credentials out of backup archives or encrypt them separately with explicit key handling.

Create full project exports as downloadable archives. Include project metadata, conversations, documents and versions, Project Bible/entities/relationships, scenes/shots/segments, reference cards/prompts, production materials and the metadata required to reconstruct relationships. Include actual file objects only when they exist and the user is authorised to export them. Use portable documented formats and a manifest; do not make the project export dependent on undocumented database internals.

Test restoration periodically into an isolated compatible destination. Verify database functions, triggers, RLS, permissions, relationships, key queries, Edge Function redeployment, storage object references and critical application workflows. A successful backup job is not proof of recoverability. Record restore-test results and report anything not restored.

Supabase Free backup/PITR guarantees must not be assumed. Verify the current official plan. If native automated backups are unavailable on the free plan, implement an independently stored export strategy within the strict free recurring-cost requirement. If a free backup destination cannot be secured without a payment method or paid tier, disclose that limitation and pause for an approved solution rather than silently incur charges.

### Document and project recovery

- Debounced autosave; do not create a permanent version for every keystroke.
- Meaningful versions at milestones and before substantial AI revisions.
- Preserve approved versions.
- Restore by creating a new version.
- Recover unsaved local edits where technically feasible and clearly show their status.
- Detect concurrent edits and avoid silent overwrites.
- Project deletion uses a documented recovery window before permanent removal.
- Reconcile interrupted tasks and storage objects after restore.

## 32.10 Release sequencing and implementation gates

Implementation proceeds in bounded, reviewable phases. Do not attempt to implement every Release 1 feature in one change.

**Foundation phase**
- Repository and project setup.
- React + Vite + TypeScript foundation, Tailwind and shadcn/ui.
- Responsive application shell and routing.
- Supabase project integration, Auth, initial schema/migrations and RLS.
- Environment/secret handling.
- CI, type checking, linting, tests and deployment preview.
- Architecture decision records and operational baseline.

**Core platform phase**
- Projects, conversations and message persistence.
- Dramora model/provider adapter and approved model groups.
- Guided/Balanced/Autonomous controls.
- Durable task records, checkpoints, stop/retry/continue and recovery.
- Documents, editor, autosave, versions and import/export.
- Project Bible, structured memory and RAG foundations.
- Security and privacy controls.

**Studio capabilities phase**
- AI Video Studio workflows.
- Film Studio story/screenplay workflows.
- Scene/shot/segment system.
- Visual reference cards, prompts and Production Reference Packs.
- Continuity and screenplay change-impact review.
- Project Relationship Map and production documents.

**Reliability and release hardening**
- Storage lifecycle dashboard and cleanup.
- Portable database backup/export/restore.
- Full project export.
- Restore drills and recovery verification.
- Security tests, RLS isolation tests, prompt-injection tests, monitoring, legal pages and launch checks.

The exact task breakdown, dependency order and acceptance criteria must be maintained in the repository and updated as implementation evidence is gathered. Each phase must be tested before moving to dependent work. Do not mark a feature complete based solely on compilation or a successful deployment.

## 32.11 Final reconciliation of superseded proposals

This consolidated section takes precedence over earlier conflicting proposals:
- Supabase PostgreSQL is the only planned primary database. D1 and Neon are not part of the current architecture.
- Cloudflare Workflows and Hyperdrive are not required components.
- Cloudflare Workers must remain lightweight; Supabase is authoritative for durable task/project state.
- Do not add a separate vector database. RAG uses Supabase PostgreSQL/pgvector and full-text search.
- Dramora does not natively generate images or videos in Release 1; the Image Generation model group is reserved for future approved capability.
- GroqCloud is approved; OpenRouter is excluded.
- Only sustainable recurring free tiers are permitted; no paid fallback.
- Private creative project content is not used to train/improve Dramora's own AI systems.
- Supabase-specific services are separate from portable PostgreSQL database logic and must be backed up/configured separately.
- Storage lifecycle management must protect user-created creative work.
- Legal pages and contextual notices are Release 1 requirements.
- This section supersedes any earlier statements that the blueprint is awaiting approval. The user authorised consolidation and implementation on November 21, 2026.

## 32.12 Implementation authorisation and remaining verification

The user has authorised the consolidated architecture and commencement of implementation. This authorisation does not remove the requirement to verify current package compatibility, provider free-tier eligibility, provider privacy terms, Supabase/Cloudflare plan limits, extension support, backup feasibility and deployment behaviour before relying on them.

The first implementation work must establish the foundation and verify integrations. No paid service may be enabled. No external service may be provisioned or incur cost without the user's explicit approval. Any requirement that cannot be met within the approved free-only constraints must be reported with alternatives before proceeding.


## 32.13 Context compaction and long-conversation management

Context compaction is an explicit core requirement for Dramora. It controls what is sent to a model when a conversation or project becomes too large for the selected model's context window. **It must never delete, overwrite or silently truncate the user's persisted conversation history.**

### Source-of-truth hierarchy

1. Canonical structured project records (accepted canon, entities, relationships, approved scenes/shots, task state and document versions) are authoritative.
2. Persisted original conversation messages remain immutable history, subject to explicit user deletion and the retention policy.
3. Versioned conversation summaries and project-context summaries are derived navigation aids, not replacements for the original history or canonical records.
4. The current prompt is assembled from relevant canonical records, relevant source messages, approved summaries and the recent verbatim conversation window.

A summary must never silently promote an AI suggestion into approved canon. Preserve provenance and acceptance status.

### Compaction triggers and token budgeting

- Estimate tokens for the assembled request using the selected model's tokenizer when available; use a conservative provider-aware estimate otherwise.
- Reserve context capacity for system/developer instructions, retrieved project context, tool schemas/results, the new user input and a safe output allowance.
- Trigger compaction before the request approaches the model's usable context limit. Use configurable thresholds per model/context window rather than a single hard-coded global number.
- Re-evaluate the budget after retrieval and tool results; tool output must not bypass the budget.
- If safe compaction cannot produce a valid request, reduce optional retrieval, ask for clarification or report that the request needs to be split. Never silently clip the user's latest message or essential instructions.

### Compaction process

1. Identify the conversation range and relevant project context that exceed the working budget.
2. Build or incrementally update a structured, versioned summary.
3. Preserve exact decisions, user constraints, accepted/rejected proposals, open questions, unresolved conflicts, named entities/IDs, important dates, task state, outputs, and source-message references.
4. Keep a recent verbatim message window for precise conversational continuity.
5. Store summary metadata: covered message IDs/range, source conversation/project, version, created/updated time, model/provider where appropriate, token estimate, and summary status.
6. Validate the summary against source messages and canonical records; preserve uncertainty rather than invent missing facts.
7. Assemble the next prompt from the summary, relevant source excerpts, canonical state and recent verbatim messages.
8. Allow a user to inspect/correct a summary where the UI exposes conversation memory controls; corrections must be persisted as explicit user input and must not alter the original transcript.

### Layered context

Use separate, scoped context layers rather than one ever-growing summary:
- **Recent conversation window:** newest messages, kept verbatim.
- **Conversation summary:** decisions, current objective, local context and unresolved questions for that conversation.
- **Project context summary:** cross-conversation project state, major decisions and active work.
- **Structured project memory / Project Bible:** canonical entities, accepted facts, relationships and provenance.
- **User preferences:** only relevant preferences, kept separate from project-specific facts.

Retrieve only the layers and source excerpts relevant to the current request. Never inject every conversation or the full project history by default.

### Safety and correctness rules

- Compaction is context preparation, not data deletion or archival.
- Original messages and canonical project records remain recoverable according to the product's retention/deletion policy.
- Never compact away the current user message, active safety instructions, explicit constraints, approval/rejection decisions, unresolved conflicts, or critical task checkpoints.
- Do not merge different projects or conversations into one summary without clear scope and source references.
- Do not treat a generated summary as more authoritative than its source messages or approved structured records.
- If summary generation fails, preserve source history and fall back to bounded retrieval/recent messages; report when the context could not be fully reconstructed.
- Rebuild or refresh summaries when source messages are edited/deleted under permitted controls, when project canon changes materially, or when validation detects stale/inconsistent summaries.
- Compaction operations must be idempotent, versioned and observable. Record the source range and summary version so repeated jobs do not lose content.
- Respect RLS and project access boundaries throughout summary creation, storage and retrieval. Never place private project content in an unrelated user's context.

### Acceptance criteria

- A long conversation can continue beyond one model context window without losing its original persisted history.
- A new request can recover relevant earlier decisions and constraints without loading the entire transcript.
- A user decision, correction, approval, rejection or unresolved question remains traceable to source messages.
- The latest user message and required instructions are never silently truncated.
- Compaction failure does not delete or corrupt the source conversation.
- Tests cover token-budget boundaries, multiple conversations per project, project isolation, summary refresh, stale summaries, retries and restore from persisted source history.

## 32.14 Repository documentation policy

Dramora maintains exactly two primary living project documents:
1. `DRAMORA_TECHNICAL_BLUEPRINT.md` — the authoritative product, architecture, security, data, reliability and implementation specification.
2. `IMPLEMENTATION_UPDATES.md` — chronological implementation record containing completed work, changed files/PRs, validation evidence, known limitations, decisions requiring follow-up and the next implementation step.

Do not create additional planning, architecture, phase-status, changelog or progress documents. Put new durable architectural decisions in the blueprint and implementation evidence/progress in the updates document. Code-level comments and required machine configuration files are not project-document substitutes. Keep the two documents synchronised in the same implementation batch or closely linked PRs.
