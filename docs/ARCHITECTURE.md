# Dramora — Architecture Direction

**Status:** Proposed direction; not an approved implementation blueprint.

## Architectural goals

- Keep the user experience, application services, data access, and AI-provider integrations clearly separated.
- Make provider integrations replaceable through capability-based interfaces.
- Keep authorization and privileged operations on the server.
- Use structured database records for durable production state.
- Move long-running generation and export work into background processing.
- Keep storage private by default and store file metadata and object paths in the database.

## Proposed logical boundaries

### Web application

Owns the responsive user interface, navigation, project workspace, Showrunner interaction, production views, asset browser, settings, and status feedback.

### Backend API and application services

Owns authentication checks, authorization, business rules, Showrunner orchestration, context retrieval, provider routing, generation-job management, asset operations, and export coordination.

### Shared package

Holds reusable domain types, validation schemas, and framework-independent utilities. It must not contain secrets or server-only implementation details.

### Data and storage

The current proposal is Supabase PostgreSQL, Supabase Auth, and private Supabase Storage. Database policies, ownership checks, and storage access rules must be designed and tested before production use.

### Background processing

Cloudflare Queues and Workflows are candidates for dispatching and coordinating long-running jobs. Their suitability, limits, reliability behavior, and cost must be verified before implementation.

### AI provider adapters

Provider adapters expose supported capabilities such as text generation, structured output, image generation, image editing, and reference-image conditioning. Business logic should depend on capabilities, not provider-specific APIs.

## Proposed repository boundaries

- `apps/web` — web client.
- `apps/api` — backend endpoints and server-side application services.
- `packages/shared` — shared domain contracts and validation.
- `supabase/migrations` — version-controlled database migrations.
- `docs` — product and engineering documentation.
- `scripts` — repeatable development and maintenance scripts.

## Decisions still requiring approval

- Frontend framework and build tooling.
- Backend runtime and API framework.
- Monorepo package manager and workspace tooling.
- Exact deployment topology.
- Database schema and row-level security policies.
- Queue/workflow implementation and retry strategy.
- AI provider selection, capability matrix, and cost controls.
- File retention, export format, and storage lifecycle.
- Authentication providers and account lifecycle.

Do not treat this document as permission to implement unapproved infrastructure. Record confirmed decisions here as they are made.
