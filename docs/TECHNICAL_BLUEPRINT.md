# Dramora — Technical Blueprint

**Status:** Approved initial build specification. Detailed implementation may refine internal module boundaries but must preserve the accepted product and architecture decisions.

## 1. Product shape

Dramora is a chat-first creative production workspace. The user sees one coherent workspace, not a set of disconnected technical tools.

- Standard Mode: conversational writing, brainstorming, and image requests.
- Director Mode: structured development of stories, production bibles, characters, locations, scenes, and visual references.
- AI Showrunner: the single user-facing assistant and coordinator.
- Workspace: persistent canvas with assets and project context.
- Conversation panel: expandable and dismissible; it does not navigate the user away from the workspace.
- Asset history: independent of conversation history.

The initial release supports text and image generation/editing. Video generation, video rendering, clip stitching, and audio generation are out of scope.

## 2. Approved stack

| Layer | Technology | Implementation rule |
|---|---|---|
| Frontend | React + TypeScript + Vite | Static-first SPA |
| Styling/components | Tailwind CSS + shadcn/ui | Use accessible primitives; avoid a bespoke CSS framework |
| Hosting/runtime | Cloudflare Workers + Static Assets | No Vercel |
| Worker development | Cloudflare Vite plugin + Wrangler | Preview in Workers runtime before deployment |
| API | TypeScript Worker routes and application services | Keep request CPU and memory bounded |
| Identity | Supabase Auth | Browser SDK with secure session handling |
| Database | Supabase PostgreSQL | Migrations and RLS required |
| Object storage | Supabase Storage | Private buckets and signed URLs |
| Local cache | IndexedDB | Drafts, cache, and recoverable local checkpoints |
| Local background work | Web Workers | Keep expensive UI-thread work off the main thread |
| Optional media acceleration | WebAssembly/WebCodecs/WebGPU | Capability-gated; only for concrete local features |
| AI text/image | External providers behind adapters | Vendor selection follows provider evaluation |
| CI | GitHub Actions | Typecheck, lint, tests, build, and migration checks |

Use npm workspaces unless a concrete compatibility issue is discovered. Keep the current Node 24 development baseline and pin supported versions in the repository when the foundation is implemented.

## 3. Application modules

### Frontend modules
- Authentication and account.
- Project dashboard and project switcher.
- Creative workspace shell.
- Standard/Director mode state.
- Conversation composer, message list, streaming renderer, and session history.
- Expandable Showrunner side panel.
- Production Bible and structured editor.
- Character/reference manager.
- Image generation composer and generation progress.
- Asset library, collections, image detail, and version history.
- Settings, accessibility, and responsive navigation.

### Backend modules
- Authentication/session guard.
- Project authorization and domain services.
- Conversation/session/message service.
- Showrunner orchestration and context assembly.
- Typed tool registry and confirmation policy.
- Text provider adapter and stream normalizer.
- Image provider adapter registry.
- Generation job service and idempotency.
- Asset upload, metadata, version, and signed URL service.
- Activity/audit service.
- Rate limiting and usage safeguards.

### Shared contracts
- Domain types and enums.
- Zod schemas or equivalent runtime validation.
- API request/response contracts.
- Stream event contracts.
- Provider capability contracts.
- Job status contracts.

Keep server-only code and secrets out of shared/browser packages.

## 4. AI Showrunner behavior

The Showrunner:
1. Identifies the user's intent and current mode.
2. Loads authorized project context only.
3. Answers directly when no tool/action is needed.
4. Proposes a plan when a multi-step creative action is needed.
5. Executes only tools allowed for the current user and project.
6. Requests confirmation before costly, destructive, or externally visible actions according to policy.
7. Saves approved durable facts into structured records.
8. Returns progress and clear errors for asynchronous image jobs.

The Showrunner is one user-facing assistant. Internal model calls and tool orchestration remain invisible unless the user opens an optional activity detail.

Tool calls must be typed, validated, authorized, idempotent where possible, and auditable.

## 5. Conversation and streaming contract

- User message is persisted before generation begins.
- Each generation has a stable ID and idempotency key.
- The API streams provider output immediately; it does not buffer the full answer.
- The UI displays partial text progressively and supports Markdown safely.
- The client stores received chunks in IndexedDB while streaming.
- The final assistant message and terminal generation status are persisted to PostgreSQL.
- Periodic bounded checkpoints may be sent to the API for cross-device recovery; do not write every token to the database.
- A disconnected stream must be marked interrupted or recoverable, not silently marked complete.
- If a provider supports continuation/resumption, use its documented contract. Otherwise offer a safe retry/continue action based on the last saved checkpoint; do not claim the same provider generation can always resume.
- Prevent duplicate user/assistant messages with idempotency keys and sequence numbers.

Detailed events and failure behavior are specified in `STREAMING_AND_LOCAL_PROCESSING.md`.

## 6. Image generation contract

- The client sends prompt, output settings, and references by asset ID.
- The server validates ownership and capability support.
- Provider adapter submits the request and normalizes status/output.
- Generation record is created before external work.
- Completed image bytes are validated and uploaded to private Storage.
- Asset and asset-version records are created atomically where practical.
- Original and edited versions are preserved.
- The UI receives progress/status and displays the completed image in the workspace.
- Provider credentials never reach the browser.

Provider selection must compare image quality, editing/reference support, output formats, API access, regional availability, pricing, rate limits, and terms.

## 7. Data and persistence

Supabase PostgreSQL is the canonical source of truth. IndexedDB is a recoverable local cache. The first schema is described in `DATA_MODEL.md`.

Required records include users/profiles, projects, project memberships (even if collaboration UI is deferred), conversations, messages, generations, production bibles, characters, references, assets, asset versions, collections, and activity events.

RLS must cover all user-owned records and Storage objects. Schema and policy changes must be version-controlled in `supabase/migrations`.

## 8. Security baseline

- Supabase Auth session validation on protected API routes.
- RLS on all user-owned tables.
- Server-side project and asset authorization.
- Provider secrets stored as Cloudflare Worker secrets.
- No service-role or provider keys in Vite environment variables.
- Private Storage buckets and short-lived signed URLs.
- Input size/rate limits and provider cost controls.
- Safe Markdown rendering and sanitization.
- File MIME/size validation and upload ownership checks.
- Confirmation for destructive and paid operations.
- Structured, redacted logs.

## 9. Quality requirements

- TypeScript strict mode.
- Runtime validation at API and provider boundaries.
- Unit tests for domain rules, schemas, and stream parsing.
- Integration tests for auth/RLS, generation jobs, and asset versioning.
- End-to-end tests for sign-in, project creation, chat streaming, side-panel behavior, image generation flow (mock provider), and recovery.
- Responsive checks at mobile, tablet, and desktop widths.
- Keyboard navigation, focus management, screen-reader labels, and reduced-motion support.
- Cloudflare Worker preview and production-build verification.

## 10. Initial implementation order

1. Repository/tooling foundation and Cloudflare React/Vite deployment shell.
2. Supabase Auth, database migrations, RLS, and private Storage.
3. Project dashboard and workspace shell.
4. Conversations, Standard/Director mode state, and streaming text.
5. Showrunner context and typed tool/action system.
6. Production Bible, characters, and reusable references.
7. Asset library, image history, and collections.
8. First image provider adapter and image generation job lifecycle.
9. Recovery, rate limiting, observability, accessibility, and hardening.

Do not start a video-generation or video-rendering phase.
