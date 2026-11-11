# Dramora

**Where Stories Become Productions.**

Dramora is an AI-assisted video production workspace by **Brilina Dev**. It is being designed to support multiple forms of video production, from short-form storytelling and micro-dramas to films, series, documentaries, advertisements, and other creative video projects.

The goal is to bring planning, creative development, production continuity, AI-assisted asset creation, and production tracking into one organized workspace.

> **Project status:** Product foundation and initial technical blueprint. Application implementation has not started.

## Product direction

- One central AI Showrunner to help users plan and manage production work.
- Flexible production structures that support different formats without forcing every project into seasons or episodes.
- Persistent production context, including bibles, characters, locations, props, visual references, and approved assets.
- AI provider integrations behind capability-based adapters.
- External video-generation workflows, with generated clips tracked and organized in Dramora.
- Asset versioning, approvals, exports, and production history.
- Responsive experience designed for desktop, tablet, and mobile devices.

## Repository layout

```text
apps/
  web/                 # Dramora web application
  api/                 # Backend API and application services
packages/
  shared/              # Shared types, schemas, and utilities
supabase/
  migrations/          # Database migrations and schema changes
docs/                  # Product, architecture, and engineering documentation
scripts/               # Development and maintenance scripts
.github/
  workflows/           # CI and repository automation
```

The structure is intentionally technology-light until the detailed architecture and implementation stack are approved. Add modules when there is a real product or engineering need; avoid speculative folders and premature abstractions.

## Documentation

- [Product overview](docs/PRODUCT_OVERVIEW.md)
- [Architecture direction](docs/ARCHITECTURE.md)
- [Initial technical blueprint](docs/TECHNICAL_BLUEPRINT.md)
- [Architecture decision log](docs/DECISIONS.md)
- [Development roadmap](docs/ROADMAP.md)
- [Setup checklist](docs/SETUP_CHECKLIST.md)
- [Repository conventions](AGENTS.md)

## Development

Follow the setup checklist and technical blueprint. Application setup instructions will be finalized after the proposed stack is approved.

## License

Dramora is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**. See [LICENSE](LICENSE).

Copyright © 2026 Brilina Dev.
