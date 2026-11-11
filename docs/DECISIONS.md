# Dramora — Architecture Decision Log

Record confirmed decisions here. Proposed choices must remain labelled as proposals until approved.

## ADR-0001: Product scope and repository identity

- **Status:** Accepted
- **Decision:** Dramora is an AI-assisted video production workspace supporting multiple production forms, not only micro-dramas.
- **Repository:** `blinkzdlfx-cell/Dramora`
- **Default branch:** `main`
- **License:** GNU Affero General Public License v3.0
- **Publisher:** Brilina Dev

## ADR-0002: Structured production data is canonical

- **Status:** Accepted
- **Decision:** Durable project and production state is stored in structured records. Conversation history is not the sole memory or source of truth.
- **Consequences:** Showrunner actions must read and update authorized records through validated application services.

## ADR-0003: Provider integrations use capability adapters

- **Status:** Accepted
- **Decision:** AI providers are integrated behind capability-based interfaces. Product logic must not depend directly on a single provider's API.
- **Consequences:** Provider selection can change without rewriting production-domain logic.

## ADR-0004: Initial application and infrastructure stack

- **Status:** Proposed
- **Proposal:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, npm workspaces, Supabase PostgreSQL/Auth/Storage, and Vercel for the web application.
- **Open items:** Background processing platform, initial AI providers, deployment limits and collaboration scope.
- **Approval:** Pending product owner confirmation.
