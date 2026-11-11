# Dramora — Agent and Contributor Instructions

## Source of truth

1. Read this file and the relevant documents in `docs/` before making changes.
2. Treat approved product requirements and architecture decisions as authoritative.
3. If implementation details conflict with the documentation, stop and report the conflict instead of silently changing product behavior.
4. Do not invent requirements or assume an unapproved technology choice.

## Product principles

- Dramora supports multiple forms of AI-assisted video production, not only micro-dramas.
- The AI Showrunner is the central user-facing assistant.
- Structured project and production records are the canonical source of truth; conversation history alone is not persistent memory.
- Production structures must remain flexible. Films, advertisements, documentaries, and other formats must not be forced into a season/episode hierarchy.
- External video-generation providers are integrated through adapters. Do not assume Dramora has its own video-generation engine.
- Keep user-approved assets and production references safe. Preserve versions and require confirmation for destructive or high-impact actions.
- Design for responsive use and modest client devices. AI workloads should use suitable cloud services rather than requiring local GPU hardware.

## Engineering rules

- Inspect the existing code and repository state before editing.
- Prefer clear, maintainable modules over giant files or unnecessary abstraction layers.
- Keep provider-specific code behind explicit interfaces; do not spread provider assumptions through business logic.
- Validate all external input and enforce authorization on the server.
- Never expose secrets, service-role credentials, or privileged tokens to browser code.
- Add tests for meaningful behavior and update documentation when architecture or behavior changes.
- Do not add dependencies, infrastructure, or paid services without explaining why they are needed.
- Do not claim a test passed unless it was actually run and its result inspected.
- Avoid unrelated refactors and preserve existing user work.

## Change workflow

1. Inspect relevant files and current branch state.
2. Explain the intended change and any assumptions.
3. Implement the smallest coherent change.
4. Run applicable checks and tests.
5. Report changed files, test results, known limitations, and any follow-up work.

## Licensing

The repository is licensed under AGPL-3.0. Preserve applicable copyright and license notices. Check third-party dependency and asset licenses before incorporating them.
