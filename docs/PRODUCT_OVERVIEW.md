# Dramora — Product Overview

## Product identity

- **Name:** Dramora
- **Tagline:** Where Stories Become Productions.
- **Publisher:** Brilina Dev
- **Category:** AI-assisted creative production workspace
- **Initial creative scope:** Story development, production planning, reusable creative references, text generation, image generation/editing, and asset organization.
- **Not an initial capability:** In-app video generation, video rendering, clip assembly, or a nonlinear video editor.

## Product vision

Dramora should feel as approachable as a modern AI chat product while behaving like a capable creative production workspace underneath. A user should be able to describe an idea naturally, develop it through conversation, create images, build reusable characters and references, and keep all project material organized without needing to understand the internal AI orchestration.

Dramora is not merely a generic chatbot, image generator, or technical production dashboard. It is a project-aware creative assistant with persistent structured context.

## Core user experience

### Standard Mode
The simple default mode for natural conversation, brainstorming, writing, rewriting, asking questions, and requesting image generation. Technical orchestration stays out of the way.

### Director Mode
A more structured mode for developing a production: premise, logline, synopsis, story bible, characters, relationships, locations, scene breakdowns, shot/scene notes, visual direction, image references, and continuity. It is a guided workspace, not a separate application.

Both modes use the same project, conversation, assets, structured records, and AI Showrunner. Switching modes must not discard the current conversation or unsaved work.

### Persistent creative workspace
- The main canvas/workspace remains visible as the primary surface.
- The composer remains available in the workspace.
- The Showrunner conversation can expand into a side panel and close back to its previous compact placement.
- Generated images appear in the workspace and are linked to the project and generation request.
- Image history/version stacks are independent of chat sessions.

## Core capabilities

1. **Authentication and accounts** — secure sign-up, sign-in, sign-out, session refresh, and account settings.
2. **Projects** — create, rename, archive, reopen, and delete with confirmation.
3. **Conversations and sessions** — project-scoped chat sessions with titles, messages, status, and history.
4. **AI Showrunner** — interprets user intent, retrieves authorized context, proposes plans, and executes permitted tools.
5. **Text generation** — streamed conversational output with partial-response recovery and clear failure states.
6. **Director workspace** — structured story and production development with explicit user control over saved facts.
7. **Production Bible** — premise, genre, tone, themes, style rules, continuity rules, and approved facts.
8. **Characters** — reusable character profiles with names, descriptions, visual references, appearance traits, optional voice metadata, aliases, and history.
9. **Creative references** — locations, wardrobe, props, visual styles, and other reusable reference entities.
10. **Image generation and editing** — provider-routed image creation, variations, reference conditioning, and version history.
11. **Asset library** — images and uploaded reference files, search/filter, collections, metadata, and safe deletion.
12. **Activity and generation status** — visible progress and useful failure/retry feedback without exposing internal implementation details.
13. **Export** — download individual images and structured project/production data in documented formats.

## Product rules

- Projects and structured records are the durable source of truth.
- Conversation history is useful context but does not replace structured project data.
- A production can use only the structures it needs; do not force every project into seasons and episodes.
- A generated image belongs to the project asset library even if the originating conversation is deleted.
- Editing an image creates a new version; the original remains available unless the user explicitly deletes it.
- A character can be referenced by name/mention (for example, `@Mara`) when the model/provider supports reference inputs. The UI must resolve mentions to a real project character, not pass arbitrary names as trusted IDs.
- Voice fields in the initial release are descriptive/reference metadata only. Text-to-speech, voice cloning, audio generation, and audio editing are deferred until a separate product decision and provider/safety review.
- The user should not need to select a model or understand providers for ordinary tasks. Advanced provider settings may be added later without cluttering the default UI.
- AI actions that consume paid provider credits, overwrite assets, delete data, or create external side effects require a clear confirmation policy. Ordinary text responses do not require confirmation.
- Do not claim an image was generated until the provider returns a successful result and the asset is stored.

## Explicitly out of scope for initial release

- In-app AI video generation.
- Video generation orchestration to Google Flow or other video models.
- Video rendering, transcoding, clip stitching, and nonlinear editing.
- Text-to-speech, voice cloning, audio generation, and audio editing.
- Local LLM inference as a requirement.
- Mandatory local GPU/WebGPU.
- Public asset sharing or collaboration unless separately scoped.
- Billing, subscriptions, credit wallets, and a user-facing multi-agent console.
- A complex administrative dashboard.

These boundaries can change only through a recorded product decision.
