# Dramora — Setup Checklist

This checklist separates accounts and local preparation from infrastructure that should only be created when needed. Do not create paid resources or add payment details without an explicit cost decision.

## Already available

- [x] GitHub repository: `blinkzdlfx-cell/Dramora`
- [x] Public repository, `main` branch, and AGPL-3.0 license
- [x] Existing architecture documentation branch and pull request
- [x] Recorded development environment: Node.js 24.21.0 and npm 12.2.1 (verify versions at setup time)

## Required accounts

### GitHub
- [x] Repository exists.
- [ ] Confirm GitHub Actions permissions for CI.
- [ ] Protect `main` after the initial workflow is established.

### Cloudflare
- [ ] Use the existing Cloudflare account.
- [ ] Confirm the account can create Workers and deploy Static Assets.
- [ ] Select the Dramora Worker name and domain only when deployment is ready.
- [ ] Enable Workers Logs/Observability.
- [ ] Do not select Vercel or create a Vercel project.
- [ ] Start within the Free plan limits; do not assume paid limits.

### Supabase
- [ ] Use or create a dedicated Supabase project for Dramora.
- [ ] Choose a region based on expected user location, latency, data residency, and plan availability.
- [ ] Enable email/password authentication initially; additional OAuth providers are optional and require explicit setup.
- [ ] Configure PostgreSQL migrations, RLS, and private Storage buckets.
- [ ] Keep the database password and service-role key private.
- [ ] Never paste secrets into source files or commit them.

### AI providers
- [ ] No provider account or API key is assumed yet.
- [ ] Evaluate text and image APIs separately.
- [ ] Confirm streaming, structured output, image generation/editing, reference-image support, rate limits, pricing, and regional availability.
- [ ] Store selected provider credentials as Cloudflare Worker secrets.
- [ ] Do not expose provider keys to the browser.

## Local development setup

1. Install Git and a code editor if needed.
2. Verify `node -v` and `npm -v`.
3. Clone `blinkzdlfx-cell/Dramora`.
4. Install dependencies using the lockfile once the workspace is created.
5. Use Cloudflare's React + Vite/Workers guide for the initial scaffold.
6. Run local development and a Workers-runtime preview before any production deployment.
7. Add an environment template containing names only, never real values.
8. Configure local secrets outside version control.

## Environment configuration policy

Expected public browser configuration:
- Supabase project URL.
- Supabase anon/publishable key.

Server-only Cloudflare Worker secrets:
- AI provider API keys.
- Any privileged Supabase key, only if a narrowly justified server-only operation requires it.
- Webhook signing secrets, if a selected provider uses signed callbacks.

Never place server-only values in `VITE_*` variables. The exact variable names and validation schema must be documented when implementation begins.

## Infrastructure decisions deferred until justified

- Cloudflare Workflows/Queues/Durable Objects: choose only if the selected image provider's asynchronous behavior and recovery needs justify them.
- Paid Cloudflare Workers plan: only if measurements or required limits make Free insufficient.
- Paid Supabase plan: only if storage, database, auth, backup, or traffic requirements demand it.
- Email delivery provider: only if transactional email beyond Supabase's available auth email is required.
- Error monitoring/analytics: choose a minimal privacy-conscious option when needed.

## First coding milestone exit criteria

- [ ] Product owner approves this documentation baseline.
- [ ] Cloudflare React/Vite Worker + Static Assets preview succeeds.
- [ ] Supabase project and region are selected.
- [ ] Auth works locally.
- [ ] Initial schema and RLS are reviewed.
- [ ] Private Storage access is tested.
- [ ] Environment validation is implemented.
- [ ] CI runs lint, typecheck, tests, and production build.
- [ ] No secrets are committed.
