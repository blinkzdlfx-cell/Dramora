# Dramora

**Where Stories Become Productions.**

Dramora is an AI-assisted creative production workspace by **Brilina Dev**. It gives creators a simple conversational way to develop stories, manage production context, create and refine images, and organize the materials needed for films, series, micro-dramas, advertisements, documentaries, and other creative projects.

> **Current status:** Product and architecture specification is being finalized. Application coding has not started.

## Product experience

- A clean, chat-first creative workspace rather than a collection of technical dashboards.
- **Standard Mode** for natural conversation, writing, brainstorming, and image requests.
- **Director Mode** for structured story and production development.
- One central AI Showrunner that coordinates authorized creative actions.
- An expandable conversation side panel that keeps the main workspace visible.
- Persistent projects, conversations, characters, creative references, generated images, and image version history.
- Image generation and editing through replaceable external provider integrations.
- No in-app AI video generation, video rendering, or nonlinear video editor in the initial release.

## Approved initial technology direction

- React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.
- Cloudflare Workers with Static Assets for the web application and API runtime.
- Supabase PostgreSQL, Auth, and private Storage.
- Browser IndexedDB for local cache, drafts, and recoverable response checkpoints.
- Web Workers and browser media APIs for suitable optional local processing.
- External AI providers behind capability-based adapters.

**Vercel is not part of the approved hosting architecture.** See the architecture decision log for the complete decisions and constraints.

## Repository layout

```text
apps/
  web/                  # React + Vite SPA and Cloudflare Vite integration
  api/                  # Worker-facing application services and API modules
packages/
  shared/               # Shared domain types, schemas, and contracts
supabase/
  migrations/           # Version-controlled PostgreSQL migrations and RLS
docs/                   # Product, UX, architecture, research, and engineering specs
scripts/                # Repeatable development and maintenance scripts
.github/
  workflows/            # CI and repository automation
```

## Documentation — read before coding

1. [Product overview](docs/PRODUCT_OVERVIEW.md)
2. [UX specification](docs/UX_SPECIFICATION.md)
3. [Google Flow product research](docs/GOOGLE_FLOW_RESEARCH.md)
4. [Technical blueprint](docs/TECHNICAL_BLUEPRINT.md)
5. [Architecture](docs/ARCHITECTURE.md)
6. [Streaming and local processing](docs/STREAMING_AND_LOCAL_PROCESSING.md)
7. [Data model](docs/DATA_MODEL.md)
8. [AI provider integration](docs/PROVIDER_INTEGRATION.md)
9. [Architecture decision log](docs/DECISIONS.md)
10. [Build-readiness checklist](docs/BUILD_READINESS.md)
11. [Setup checklist](docs/SETUP_CHECKLIST.md)
12. [Development roadmap](docs/ROADMAP.md)
13. [Contributor instructions](AGENTS.md)

## Development

Follow the setup checklist and technical blueprint. Do not begin implementation until the product owner confirms the documentation review is complete. Never commit API keys, service-role credentials, or other secrets.

## License

Dramora is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See [LICENSE](LICENSE).

Copyright © 2026 Brilina Dev.
