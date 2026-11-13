# Dramora — Build Readiness and Acceptance Checklist

**Purpose:** A coding agent must use this checklist before declaring the product specification implementation-ready or a release milestone complete.

## 1. Product scope is settled

- [x] Product is a chat-first creative production workspace.
- [x] Standard Mode and Director Mode share the same application and project state.
- [x] One central AI Showrunner coordinates creative tasks.
- [x] Workspace stays visible while the conversation expands into a dismissible side panel.
- [x] Text generation and image generation/editing are initial media capabilities.
- [x] Video generation, rendering, clip stitching, and nonlinear editing are excluded from v1.
- [x] Voice/audio generation is excluded; character voice fields are metadata only.
- [x] Project sessions and generated assets have independent lifecycles.

## 2. Architecture is settled

- [x] Cloudflare Workers + Static Assets; no Vercel.
- [x] React + TypeScript + Vite.
- [x] Tailwind CSS + shadcn/ui.
- [x] Supabase Auth, PostgreSQL, and private Storage.
- [x] IndexedDB for cache/drafts/checkpoints, not canonical data or GPU compute.
- [x] Optional browser processing is capability-gated.
- [x] External AI providers are behind capability adapters.
- [x] Worker streaming avoids response buffering.
- [x] CPU, memory, subrequest, and disconnect limits are documented.

## 3. Before the first application code

- [ ] Product owner confirms this documentation baseline.
- [ ] Verify Cloudflare React/Vite setup against current official docs.
- [ ] Select Supabase project/region and configure local environment.
- [ ] Select initial text and image provider candidates; record API constraints and pricing.
- [ ] Create schema migrations and test RLS/storage policies.
- [ ] Add lint, typecheck, unit tests, and Cloudflare preview to CI.
- [ ] Add environment validation without committing secrets.

## 4. Core functional acceptance

### Authentication and projects
- [ ] User can register, sign in, refresh session, and sign out.
- [ ] Protected routes and API endpoints reject unauthenticated requests.
- [ ] User cannot read or mutate another user's project.
- [ ] User can create, rename, archive, and delete a project with appropriate confirmation.

### Workspace and conversations
- [ ] Standard Mode is simple and usable without advanced configuration.
- [ ] Director Mode exposes structured creative development.
- [ ] Switching modes preserves session and draft.
- [ ] Side panel opens/closes without losing workspace state.
- [ ] Sessions are project-scoped and independently manageable.
- [ ] Deleting a session does not delete generated assets.

### Streaming
- [ ] Text appears progressively.
- [ ] Worker does not buffer full provider output.
- [ ] Stream parser handles chunk boundaries, UTF-8, duplicate events, and terminal events.
- [ ] Completion, interruption, provider failure, and user cancellation are distinct.
- [ ] Partial response survives refresh where IndexedDB is available.
- [ ] Idempotency prevents duplicate user messages.
- [ ] Cross-device checkpoint behavior is tested if enabled.
- [ ] No claim of resumable same-generation behavior unless provider supports it.

### Characters and production context
- [ ] Character records preserve visual traits and reference assets.
- [ ] Optional voice metadata does not imply audio generation.
- [ ] Director Mode can manage a Production Bible and flexible scene/sequence structures.
- [ ] Durable approved facts are stored in structured records.

### Images and assets
- [ ] Image generation works through a provider adapter.
- [ ] Generated images are stored in private Supabase Storage.
- [ ] Asset metadata and version history are durable.
- [ ] Editing creates a new version and preserves the original.
- [ ] Assets remain after conversation deletion.
- [ ] Signed URLs and cross-project access are tested.

## 5. Operational and security acceptance

- [ ] Worker CPU/memory/subrequest use is measured under realistic requests.
- [ ] No full image/media payload is buffered in Worker memory.
- [ ] Streaming is tested on mobile networks and with client disconnects.
- [ ] Cloudflare observability is enabled with redacted structured logs.
- [ ] Provider rate limits and cost safeguards are enforced.
- [ ] RLS and Storage policies are tested with multiple users.
- [ ] Account/project/asset deletion and retention are documented.
- [ ] Accessibility and responsive behavior are verified.
- [ ] Deployment and rollback steps are documented.

## 6. Definition of ready to begin coding

The product and architecture decisions are sufficiently specified for the first implementation milestone. Remaining items in section 3 are setup/verification tasks, not unresolved product direction. Do not treat this checklist as proof that code, infrastructure, providers, or tests already exist.
