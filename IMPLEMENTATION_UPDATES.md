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
- The assistant-ui bridge is a compile-time integration scaffold; it is not yet connected to Supabase, a real API, streaming, task cancellation or persisted conversations.

### Current implementation state
- Phase 0 foundation and the UI/runtime integration scaffold are present in PR #2.
- Context compaction is specified in the blueprint but has not yet been implemented in application code.
- Authentication, database schema, RLS, conversation persistence, backend streaming, durable task orchestration and provider adapters have not yet been implemented.

### Next implementation steps
1. Get PR #2's CI workflow to run and pass; resolve any dependency/type/build failures.
2. Generate and commit `package-lock.json` from a successful install.
3. Review the assistant-ui runtime adapter against the installed package's actual TypeScript declarations; add a small render/interaction proof.
4. Once the foundation is verified and merged, begin the Supabase foundation: client/server boundaries, Auth integration, first migrations, RLS and automated isolation tests.
5. Do not start production chat/provider orchestration until the persistence and security boundary is in place.
