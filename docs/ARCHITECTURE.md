# Dramora — Approved Architecture

**Status:** Approved product-owner direction for the initial implementation. See `docs/DECISIONS.md` for the decision log.

## 1. Architectural goals

- Deploy the application on Cloudflare; Vercel is explicitly excluded.
- Keep the web interface static-first so ordinary page and asset delivery does not execute application logic in a Worker.
- Use Cloudflare Workers for lightweight authenticated APIs, AI provider routing, streaming, and job coordination.
- Use Supabase for identity, relational persistence, row-level security, and private media storage.
- Keep AI providers replaceable through capability-based adapters.
- Use the user's browser for suitable caching and optional local processing, not as a substitute for AI provider inference or the canonical database.
- Make provider jobs observable, idempotent, retryable where supported, and safe against duplicate asset creation.

## 2. Runtime and deployment topology

### Web client
- React + TypeScript + Vite single-page application.
- Tailwind CSS and shadcn/ui.
- Cloudflare Vite plugin and Workers Static Assets deployment.
- Client-side routing with SPA fallback.
- No server-side rendering requirement in the initial release.

Cloudflare serves built static files through its asset layer. The Worker is invoked for API routes rather than every frontend navigation. The exact Wrangler/Vite configuration must follow the current Cloudflare React + Vite guide and be validated in a Worker preview before production deployment.

### API Worker
- TypeScript Cloudflare Worker.
- API namespace under `/api/*`.
- Handles session validation, authorization, application services, provider calls, streaming responses, and job coordination.
- Does not perform CPU-heavy image/video processing or buffer large media.
- Worker code should be small, modular, and measured against the selected Cloudflare plan's CPU, memory, and subrequest limits.

### Data services
- Supabase Auth for account identity and sessions.
- Supabase PostgreSQL for projects, conversations, production records, generations, assets, and audit/activity records.
- Supabase Storage private buckets for uploaded references and generated images.
- Row-level security (RLS) on every user-owned table and private storage policies.
- Browser SDK may use the public anon/publishable key. Never expose service-role credentials.

### Local browser services
- IndexedDB: cached project data, drafts, optimistic message state, response checkpoints, and temporary metadata.
- Web Workers: CPU work that should not block the UI.
- WebAssembly/WebCodecs/WebGPU: optional capability-gated media/image processing only when a concrete feature needs them.
- The local cache is disposable and must be reconstructable from Supabase. It is not the canonical database.

## 3. Request paths

### Ordinary chat/text request
1. Client writes the user's message locally and submits it with a client-generated idempotency key.
2. Worker validates the Supabase session and project membership.
3. Worker persists/validates the user message and creates an assistant-generation record.
4. Worker retrieves the minimum authorized project context required for the request.
5. Worker calls the selected text provider using server-only credentials.
6. Worker forwards the provider stream as it arrives; it must not collect the entire response before returning it.
7. Client renders chunks progressively and checkpoints partial output locally.
8. On successful completion, the final assistant message and generation status are persisted to Supabase.
9. UI marks the response complete and reconciles local cache with the canonical record.

### Image generation/edit request
1. User submits a prompt and optional project asset/character references.
2. Worker validates access, input, capability, and generation settings.
3. Create a generation record with an idempotency key and queued/running status.
4. Provider adapter submits the image request using server-side credentials.
5. Provider-specific polling/webhook behavior is hidden behind the adapter/job service.
6. Completed output is validated and uploaded to private Supabase Storage.
7. Create an asset and immutable asset-version record; link it to the project, conversation, and generation.
8. UI updates the workspace and image history.
9. Failures retain safe diagnostic metadata and expose retry where safe.

Do not assume all image providers are synchronous, support webhooks, allow cancellation, or return the same output formats. Verify each selected provider.

## 4. Cloudflare CPU and Error 1102 strategy

Cloudflare Error 1102 indicates that a Worker exceeded a resource limit, commonly CPU time or memory. Network wait time for `fetch()` is not CPU time. A connected HTTP Worker can stream a response without a general wall-clock duration cap, but a client disconnect or runtime shutdown can interrupt work.

Initial release rules:
- Prefer Workers Static Assets for frontend delivery.
- Keep API request handlers lightweight.
- Stream provider responses using `ReadableStream`/stream passthrough; never buffer the full model output in Worker memory.
- Avoid large JSON payloads, synchronous loops over media, image decoding, video processing, and expensive compression in the Worker.
- Use streaming request/response bodies and bounded payload sizes.
- Measure CPU time, memory, subrequests, and wall time in preview and production logs.
- Treat the Workers Free 10 ms CPU limit and 128 MB memory limit as constraints, not targets to exceed.
- Do not promise zero 1102 errors. Build to avoid known causes and add observability and graceful failure.
- Re-evaluate plan limits before choosing Workers Paid or enabling features that exceed Free limits. No paid plan is assumed by this document.

## 5. Background work

The initial release does not include video-generation or video-rendering jobs. Image providers may still expose asynchronous jobs.

Implement a provider-neutral `GenerationJobService` and durable database job records. The orchestration adapter is selected after the first image provider's API and the required reliability/cost profile are verified. Cloudflare Workflows is the preferred candidate for multi-step durable orchestration; a simple provider request/status-polling path is acceptable for synchronous or short-lived image operations. Do not introduce Queues, Workflows, Durable Objects, or another paid service speculatively.

Every job must have:
- Unique ID and idempotency key.
- User/project ownership.
- Provider and capability.
- Safe request metadata (no secrets).
- Status, timestamps, attempt count, and safe error code.
- Provider job ID when available.
- Output asset IDs on success.
- Retry policy and terminal failure state.

## 6. Security and authorization

- Verify the user's Supabase access token on every protected API request.
- Enforce project ownership/membership in application services and PostgreSQL RLS.
- Use the user's JWT when accessing Supabase data where possible so RLS remains effective.
- Keep AI provider keys and any privileged Supabase key in Worker secrets only.
- Do not trust user-supplied user IDs, project IDs, asset paths, provider job IDs, or role claims without authorization checks.
- Validate prompt size, settings, uploaded MIME type, file size, and ownership.
- Use private Storage buckets and short-lived signed URLs.
- Rate-limit and quota-check generation endpoints to prevent abuse and unexpected provider costs.
- Redact secrets and avoid logging complete sensitive prompts by default.
- Provide account deletion and project/asset deletion semantics before production launch.

## 7. Observability

- Enable Cloudflare Workers Logs/Observability.
- Use structured logs with request ID, generation ID, provider, capability, duration, status, and safe error code.
- Track CPU time separately from wall time.
- Track stream completion, disconnects, time-to-first-token, total generation duration, and provider errors.
- Track image job queue/running/completed/failed counts.
- Never log access tokens, provider secrets, signed URLs, or raw private media.

## 8. Repository boundaries

- `apps/web`: React/Vite application, UI, client data/cache, browser capability detection.
- `apps/api`: Worker API entry and server-side application services/provider adapters.
- `packages/shared`: framework-independent domain types, schemas, event contracts, and validation.
- `supabase/migrations`: SQL schema, indexes, RLS policies, and storage policies.
- `docs`: approved product, UX, architecture, and operating specifications.

Avoid separate deployables unless a measured need justifies them. The frontend static assets and API Worker should be deployed as one Cloudflare application where practical.

## 9. Technology choices

See `docs/DECISIONS.md`. Do not reintroduce Vercel, Next.js SSR, a local model requirement, or in-app video generation without a new recorded decision.
