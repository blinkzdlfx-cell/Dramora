# Dramora — Architecture Decision Log

This file records confirmed product-owner decisions. New proposals must remain labelled as proposals until accepted.

## ADR-0001: Product scope and repository identity

- **Status:** Accepted
- **Decision:** Dramora is an AI-assisted creative production workspace supporting multiple creative production forms.
- **Repository:** `blinkzdlfx-cell/Dramora`
- **Default branch:** `main`
- **License:** GNU Affero General Public License v3.0
- **Publisher:** Brilina Dev

## ADR-0002: Structured production data is canonical

- **Status:** Accepted
- **Decision:** Durable project and production state is stored in structured records. Conversation history is not the sole memory or source of truth.
- **Consequences:** Showrunner actions read and update authorized records through validated application services.

## ADR-0003: Provider integrations use capability adapters

- **Status:** Accepted
- **Decision:** AI providers are integrated behind capability-based interfaces.
- **Consequences:** Product logic does not depend directly on one provider's API or model naming.

## ADR-0004: Cloudflare is the application host; Vercel is excluded

- **Status:** Accepted
- **Decision:** Dramora is hosted on Cloudflare Workers with Static Assets. Vercel is not used for this project.
- **Implementation direction:** React + Vite SPA; Cloudflare Worker API; static assets should be served without invoking application logic.
- **Consequences:** Avoid SSR and CPU-heavy request handlers in the initial release. Validate the app in the Workers runtime and respect current plan limits.

## ADR-0005: Initial frontend and UI stack

- **Status:** Accepted
- **Decision:** React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.
- **Consequences:** Use a responsive SPA with accessible components. Do not add a full-stack framework unless a future requirement justifies it.

## ADR-0006: Supabase is the persistence and identity platform

- **Status:** Accepted
- **Decision:** Supabase Auth, PostgreSQL, and private Storage are the initial data services.
- **Consequences:** PostgreSQL is canonical; RLS is mandatory; private Storage and signed URLs are the default. Never expose service-role credentials.

## ADR-0007: Chat-first workspace with Standard and Director modes

- **Status:** Accepted
- **Decision:** The central workspace remains visible and the composer remains integrated into it. Standard Mode is conversational; Director Mode is structured. Both use the same project, Showrunner, conversation and assets.
- **Consequences:** Mode switching must not discard state. The Showrunner conversation can expand into a dismissible side panel and return to its compact placement. Do not create separate applications for the modes.

## ADR-0008: Initial media scope is text and images only

- **Status:** Accepted
- **Decision:** Dramora supports AI text generation and image generation/editing in the initial release. It does not generate video, render video, stitch clips, or provide a nonlinear video editor.
- **Consequences:** Video-generation provider adapters and video job pipelines are not part of the initial build. Production planning may still describe scenes, shots, and external creative workflows, but no in-app video-generation feature is implied.

## ADR-0009: IndexedDB is local persistence, not compute

- **Status:** Accepted
- **Decision:** Use IndexedDB for local drafts, cache, optimistic state, and recoverable response checkpoints.
- **Consequences:** IndexedDB does not provide GPU access or execute AI inference. It is not the canonical database and must be reconcilable with Supabase.

## ADR-0010: Device processing is optional and capability-gated

- **Status:** Accepted
- **Decision:** Use Web Workers and browser APIs for suitable local tasks. WebAssembly, WebCodecs, and WebGPU may be used only when a concrete feature benefits and the browser/device supports it.
- **Consequences:** Never require a local GPU, local model, or high-end device. Do not move external AI inference to the browser by assumption.

## ADR-0011: Stream AI text through the Worker

- **Status:** Accepted
- **Decision:** Stream provider output to the browser using a streaming HTTP response/ReadableStream or SSE where event framing is useful.
- **Consequences:** Do not buffer full model responses in Worker memory. Persist final messages and bounded checkpoints; keep client-side partial output in IndexedDB. Document that same-generation continuation depends on provider support.

## ADR-0012: Voice and audio are deferred

- **Status:** Accepted
- **Decision:** Character profiles may store descriptive voice metadata and references, but the initial release does not generate speech, clone voices, generate audio, or edit audio.
- **Consequences:** No voice-generation provider or audio pipeline is required for the first release.

## ADR-0013: Background orchestration is selected by provider requirements

- **Status:** Accepted
- **Decision:** Implement a provider-neutral generation-job contract. Use a direct request/status path for synchronous or short image tasks. Adopt Cloudflare Workflows or another durable mechanism only when the selected provider and recovery requirements justify it.
- **Consequences:** No speculative paid service or unnecessary queue infrastructure.

## ADR-0014: No mandatory local AI inference

- **Status:** Accepted
- **Decision:** External providers perform text and image model inference. Local compute is for optional client-side processing, not a requirement for core product functionality.
- **Consequences:** The product remains usable on modest devices and does not assume WebGPU availability.
