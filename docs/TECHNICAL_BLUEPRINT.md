# Dramora — Initial Technical Blueprint

**Status:** Proposed for review. This document does not silently approve paid services or irreversible infrastructure choices.

## 1. Product architecture

Dramora is a production workspace, not a chat wrapper and not a single video generator. The application is organized around durable production records and a central AI Showrunner that can read context and perform explicitly authorized actions.

Logical layers:

1. **Experience layer** — project dashboard, production workspace, Showrunner, planning views, asset library, settings.
2. **Application layer** — project and production rules, access control, Showrunner orchestration, asset lifecycle, job state and exports.
3. **Domain layer** — projects, productions, production bible, creative references, scenes, shots, clips, assets, provider jobs and activity history.
4. **Integration layer** — text, image and video-provider adapters; storage; background job orchestration.
5. **Infrastructure layer** — database, authentication, object storage, deployment, monitoring and CI.

The database is the source of truth. Chat transcripts are not a substitute for structured project state.

## 2. Initial stack recommendation

| Area | Proposed choice | Reason |
|---|---|---|
| Web application | Next.js, React, TypeScript | Mature full-stack React ecosystem; supports a rich responsive workspace |
| UI | Tailwind CSS and shadcn/ui | Consistent accessible components and maintainable styling |
| Workspace | npm workspaces initially | Keeps setup simple and works with the existing Node/npm environment |
| Database | Supabase PostgreSQL | Relational production data, migrations and row-level security |
| Authentication | Supabase Auth | Integrated account and session foundation |
| File storage | Supabase Storage, private buckets | Uploads and generated assets with controlled access |
| API | Next.js server routes/actions behind server-side service modules | Avoids a separately deployed API until scale or workload justifies it |
| Hosting | Vercel for the web application | Straightforward Next.js deployment; verify current plan limits before relying on it |
| AI integration | Provider adapter interfaces; choose vendors after capability/cost evaluation | Avoids provider lock-in and hard-coded model assumptions |
| Background work | Separate asynchronous job design; evaluate Supabase Queues/Edge Functions and Cloudflare Queues/Workflows before selection | Video and media tasks must not depend on a single request staying open |
| CI | GitHub Actions | Repeatable lint, typecheck, tests and build checks |

This is a recommendation, not a final infrastructure lock. In particular, background orchestration and AI vendors need a short proof-of-concept before selection.

## 3. Domain model — first-pass entities

- **User / membership** — account identity and project access.
- **Project** — top-level workspace and collaboration boundary.
- **Production** — a film, series, advertisement, documentary, social video or other production.
- **Production structure** — configurable containers such as acts, sequences, scenes, episodes, shots and clips. A production only uses the levels it needs.
- **Production Bible** — persistent creative rules, tone, visual language and continuity notes.
- **Reference entities** — characters, locations, wardrobe, props and other reusable subjects.
- **Asset** — uploaded or generated image, audio, video, document or reference file, with metadata and storage path.
- **Asset version** — immutable version history, approval state and provenance.
- **Provider job** — external generation request, provider, status, parameters, result references and error details.
- **Showrunner action** — structured tool/action execution, authorization, confirmation and outcome.
- **Activity event** — auditable history of meaningful production changes.

The first schema must support single-user ownership cleanly while leaving room for project collaborators. Avoid building complex organization billing before the product needs it.

## 4. AI Showrunner contract

The Showrunner should operate through typed, validated tools. It must:

- Load only the current user's authorized project and production context.
- Distinguish suggestions from actions that change saved records.
- Ask for confirmation before destructive, costly or externally visible actions.
- Save approved facts into structured records rather than relying on chat history.
- Return clear job status for long-running operations.
- Record action history and recover safely from retries.
- Never expose provider credentials or privileged database keys to the browser.

Provider adapters should advertise capabilities (for example text generation, structured output, image generation, image editing, reference conditioning, video generation and status polling). A provider is only selectable for capabilities it actually supports.

## 5. Media and long-running jobs

Video generation, rendering and large exports are asynchronous workflows:

1. Validate request and user/project permissions.
2. Create a durable job record.
3. Dispatch work to the selected provider or worker.
4. Persist provider job identifiers and progress.
5. Poll or receive callbacks where supported.
6. Store completed outputs in private object storage.
7. Attach asset records and notify the UI.
8. Support retry, cancellation where supported, and clear failure states.

Do not proxy large media files through ordinary application request handlers. Use signed upload/download URLs and store object paths plus metadata in PostgreSQL. Do not assume a provider supports webhooks, cancellation or resumable uploads until verified.

## 6. Security baseline

- Row-level security and server-side authorization are required.
- Never expose service-role keys, provider API keys or signing secrets to client code.
- Validate every external payload and uploaded file.
- Use private storage by default and short-lived signed URLs.
- Enforce file type, size and ownership rules.
- Log job/action identifiers and safe error metadata; do not log secrets or full sensitive prompts unnecessarily.
- Treat provider output and uploaded content as untrusted input.
- Add retention and deletion rules before accepting large-scale user media.

## 7. Build sequence

1. Approve product scope and technical decisions.
2. Establish app workspace, quality checks and environment validation.
3. Implement Supabase project, migrations, authentication and RLS.
4. Build project/production CRUD and flexible production structures.
5. Build the Showrunner's typed action contract and persistent context.
6. Add Production Bible and reference management.
7. Add private asset uploads, versioning and approvals.
8. Integrate the first text and image provider capabilities.
9. Add asynchronous external video job tracking.
10. Add exports, observability, security testing and deployment hardening.

## 8. Decisions requiring confirmation

- Approve Next.js + React + TypeScript + Tailwind/shadcn.
- Approve Supabase for database, authentication and private storage.
- Approve Vercel as the initial web host.
- Choose the background-job platform after a small technical test.
- Select initial AI providers based on required capabilities, quality, pricing and regional availability.
- Decide whether the first release is single-user or includes project collaboration from day one.
