# Dramora

Dramora is a creative-production workspace with two studios:

- **AI Video Studio** — creative development and production preparation for external image/video-generation platforms.
- **Film Studio** — story development, screenplay writing and production preparation.

Dramora does not natively generate images or videos in Release 1.

## Requirements

- Node.js 22.12 or newer (Node.js 24 LTS is suitable).
- npm.

## Local development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run typecheck
npm run build
```

## Environment

Copy `.env.example` to `.env.local` when the Supabase project is provisioned. Only the browser-safe Supabase URL and publishable key belong in Vite variables. Never expose a Supabase secret/service-role key or AI provider credentials in the browser.

## Architecture

The authoritative product and technical decisions are in `DRAMORA_TECHNICAL_BLUEPRINT.md`. Do not introduce paid services, paid credits, automatic paid fallbacks, D1, Neon, OpenRouter, Cloudflare Workflows or Hyperdrive without a new explicit approval.
