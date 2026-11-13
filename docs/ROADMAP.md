# Dramora — Development Roadmap

This roadmap follows the approved initial scope. Each phase must be completed and validated before dependent work is expanded.

## Phase 0 — Product and architecture baseline

- [x] Establish repository and AGPL-3.0 license.
- [x] Define product identity and multi-format creative scope.
- [x] Approve Cloudflare-first hosting; exclude Vercel.
- [x] Approve React/Vite, Supabase, and chat-first Standard/Director experience.
- [x] Define text/image-only initial media scope.
- [x] Document Google Flow research, UX behavior, streaming, local processing, data model, and provider contracts.
- [ ] Product owner reviews and accepts the documentation baseline.

## Phase 1 — Application foundation

- [x] Create React + TypeScript + Vite application using Cloudflare's supported Workers integration.
- [x] Configure Static Assets and API routing so static navigation does not invoke the Worker.
- [x] Add npm workspace structure, strict TypeScript, linting, and tests. Formatting automation remains to be added.
- [x] Add public environment validation and server-secret handling conventions.
- [ ] Add GitHub Actions CI and verify a Workers-runtime preview (workflow committed; execution pending).
- [ ] Configure Supabase Auth, apply migrations, and verify RLS baseline (client and migration committed; project setup pending).

## Phase 2 — Workspace and project foundation

- [ ] Build responsive app shell and account navigation.
- [ ] Implement project creation, switching, rename, archive, and deletion confirmation.
- [ ] Implement conversation sessions and history.
- [ ] Build persistent workspace canvas and composer.
- [ ] Implement Standard/Director mode state and side-panel expand/close behavior.
- [ ] Add IndexedDB cache and draft persistence.

## Phase 3 — Streaming Showrunner

- [ ] Implement protected chat endpoint and text provider adapter interface.
- [ ] Implement provider stream passthrough and client stream parser.
- [ ] Add message idempotency, sequence handling, and bounded checkpoints.
- [ ] Add local partial-response persistence and interruption/recovery UX.
- [ ] Implement project context retrieval and typed Showrunner tools.
- [ ] Add confirmation policy and activity records.

## Phase 4 — Production knowledge and references

- [ ] Implement Production Bible.
- [ ] Implement characters with visual reference images and optional voice metadata.
- [ ] Implement locations, wardrobe, props, and reusable references.
- [ ] Implement mention/reference resolution (for example `@Character`).
- [ ] Add continuity and approved-fact workflows.

## Phase 5 — Image generation and asset library

- [ ] Evaluate text and image providers against documented capability criteria.
- [ ] Implement provider adapter registry.
- [ ] Implement image generation/edit requests and generation-job lifecycle.
- [ ] Upload outputs to private Supabase Storage.
- [ ] Implement asset versions, image history, collections, and asset search.
- [ ] Add safe retry, deletion, and recovery paths.

## Phase 6 — Hardening and release readiness

- [ ] Test RLS and storage authorization across users/projects.
- [ ] Test Worker CPU/memory/subrequest usage and stream completion.
- [ ] Add rate limiting and provider cost safeguards.
- [ ] Add Cloudflare observability and structured redacted logs.
- [ ] Complete responsive, keyboard, accessibility, and performance testing.
- [ ] Document backups, retention, account deletion, and deployment rollback.
- [ ] Deploy to the approved Cloudflare environment after owner approval.

## Explicitly not scheduled in the initial roadmap

- Video generation, rendering, editing, or clip assembly.
- Voice cloning, text-to-speech, or audio generation.
- Mandatory local AI models or GPU workloads.
- Billing/subscriptions and complex collaboration.
