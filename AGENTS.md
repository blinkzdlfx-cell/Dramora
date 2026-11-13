# Dramora — Agent and Contributor Instructions

## Mandatory reading order

Before changing code, read:
1. `docs/PRODUCT_OVERVIEW.md`
2. `docs/UX_SPECIFICATION.md`
3. `docs/ARCHITECTURE.md`
4. `docs/TECHNICAL_BLUEPRINT.md`
5. `docs/STREAMING_AND_LOCAL_PROCESSING.md`
6. `docs/DATA_MODEL.md`
7. `docs/PROVIDER_INTEGRATION.md`
8. `docs/DECISIONS.md`
9. `docs/BUILD_READINESS.md`

These documents are the current product and engineering source of truth. If code, a provider limitation, or a platform change conflicts with them, stop and report the conflict. Do not silently change product scope or architecture.

## Product principles

- Dramora is a creative production workspace with a chat-first interaction model.
- Standard Mode and Director Mode are two experiences over the same projects, context, and AI Showrunner.
- The main workspace and composer remain the primary interface; the conversation may expand into a dismissible side panel.
- The initial release generates and edits images, not videos. Do not implement in-app video generation, video rendering, clip stitching, or a nonlinear editor without a new explicit product decision.
- The AI Showrunner is the central user-facing assistant. Internal orchestration is not exposed as a multi-agent control panel.
- Structured project records are canonical; chat history is not the sole source of production memory.
- Characters and reusable references must preserve identity, visual references, voice metadata, and version history where applicable.
- Keep generated assets separate from conversations. Deleting a conversation must not silently delete generated assets.
- Cloudflare is the hosting and application runtime. Do not introduce Vercel.
- Use local browser processing only where it is supported and beneficial. Do not require a local GPU or local AI model.
- IndexedDB is local persistence/cache, not GPU compute and not the canonical database.

## Engineering rules

- Inspect repository state, current branch, and relevant code before editing.
- Keep the React/Vite frontend static-first and keep Worker API routes lightweight.
- Do not perform CPU-heavy media processing, large file buffering, or expensive synchronous work in a Cloudflare Worker.
- Stream AI provider responses through the Worker without buffering the full response.
- Distinguish CPU time from network wait time; do not claim that streaming or a long provider wait inherently causes Error 1102.
- Treat the Workers Free 10 ms CPU limit as a real constraint. Measure Worker CPU time and keep the API path within the configured plan limits.
- Keep provider-specific APIs behind typed capability adapters.
- Validate all external input and enforce user/project authorization on the server and with Supabase RLS.
- Never expose provider keys, Supabase service-role keys, or privileged tokens to browser code.
- Use private storage by default and short-lived signed URLs.
- Use idempotency keys and durable job records for provider operations that can be retried.
- Add tests for meaningful behavior and update documentation when architecture or behavior changes.
- Do not add dependencies, paid services, or infrastructure without explaining the need and verifying current limits/costs.
- Never claim a test, build, deployment, or provider integration passed unless it was actually run and inspected.

## Change workflow

1. Inspect the current state and relevant documentation.
2. State the intended bounded change and assumptions.
3. Implement the smallest coherent change.
4. Run applicable lint, typecheck, tests, and build.
5. Inspect the results and report changed files, actual checks, limitations, and follow-up work.

## Licensing

The repository is licensed under AGPL-3.0. Preserve license notices and check third-party dependency, model, font, and asset licenses before incorporating them.
