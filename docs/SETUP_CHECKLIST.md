# Dramora — Setup Checklist

This is the setup list for the first development milestone. Do not create paid resources or add payment details until a decision actually requires them.

## Already available

- [x] GitHub account and public repository: `blinkzdlfx-cell/Dramora`
- [x] `main` branch and AGPL-3.0 license
- [x] Node.js and npm on the development machine (recorded environment: Node 24.21.0, npm 12.2.1)

## Set up now

1. **Local development**
   - Install Git if it is not already installed.
   - Install a code editor (VS Code is sufficient).
   - Confirm Node.js 24 LTS/current and npm work: `node -v`, `npm -v`.
   - Clone the repository and check out the architecture branch for review.

2. **Supabase account**
   - Create or use a Supabase account.
   - Create a dedicated Dramora project only after the schema and region are agreed.
   - Keep the database password and service-role key private.
   - We will configure Auth, private Storage buckets, RLS and migrations in the application setup phase.

3. **Vercel account**
   - Create or use a Vercel account and connect the GitHub account.
   - Do not deploy until the application framework and environment variables are ready.
   - Check current Hobby plan limits before treating it as the production hosting choice.

4. **AI provider accounts**
   - No provider account or API key is required yet.
   - We will first define which capabilities are needed, then select providers based on quality, pricing, API access and whether they support asynchronous jobs.
   - Never paste API keys into source files or commit them to Git.

## Set up later, only when selected

- Background processing provider and its credentials.
- First text/image/video provider accounts and API keys.
- Production domain and DNS.
- Error monitoring and analytics.
- Email provider, only if account verification or notifications require it.

## Environment variable policy

The exact variable names will be defined with the implementation. Expect separate public configuration (such as the Supabase project URL and anon/publishable key) and server-only secrets (database/service credentials, AI provider keys, signing secrets). Use a local `.env.local` file, keep it ignored by Git, and configure deployment secrets in the hosting dashboard.

Never share secret values in chat. If configuration help is needed, share variable names and redacted screenshots only.

## First milestone exit criteria

- [ ] Architecture and stack approved.
- [ ] Supabase project created in the agreed region.
- [ ] Hosting choice confirmed.
- [ ] Local repository installs cleanly.
- [ ] Environment template and validation added.
- [ ] CI runs lint, typecheck, tests and production build.
