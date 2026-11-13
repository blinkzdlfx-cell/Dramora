# Dramora — UX and Interaction Specification

## 1. Experience goal

Dramora should feel simple on the surface and capable underneath. The user should not need to understand model routing, provider APIs, job queues, database records, or internal agents to create useful work.

The creative workspace is the main destination. Chat is integrated into that workspace; it is not a separate product page.

## 2. Primary application shell

### Desktop layout
- Left navigation: projects, new project, recent projects, and asset/library access.
- Main workspace: current project canvas, welcome/empty state, generated image cards, selected asset detail, or Director workspace.
- Composer: persistent prompt/input area anchored to the bottom of the main workspace.
- Showrunner panel: opens on the right when expanded; overlays or takes a responsive portion of the workspace without replacing it.
- Top-level controls: project name, mode selector, and contextual project actions.

### Mobile layout
- Main workspace occupies the viewport.
- Project navigation is available through a compact drawer.
- Composer remains easy to reach and respects the on-screen keyboard/safe areas.
- Showrunner panel becomes a full-height drawer or sheet with a clear close control.
- Asset history and advanced settings use mobile-friendly sheets rather than tiny sidebars.
- Avoid requiring hover; all actions must work by touch.

## 3. Standard Mode

Purpose: quick, natural creative collaboration.

- Default mode for a new user/project.
- One text composer with attachment/reference support.
- Natural language requests for writing, brainstorming, rewriting, explanations, and image creation.
- Minimal controls by default.
- Model/provider selection is not required for normal use.
- When the user asks for an image, show generation progress and then display the resulting image in the workspace.
- Responses stream progressively.
- The user can refer to prior messages and project assets.

## 4. Director Mode

Purpose: structured creative development and production continuity.

Director Mode uses the same AI Showrunner and data, but adds structured workspace views for:
- Project premise, logline, synopsis, genre, tone, themes, and target format.
- Production Bible and style rules.
- Characters and relationships.
- Locations, props, wardrobe, and visual references.
- Scene/sequence/episode structures where applicable.
- Continuity notes and approved creative facts.
- Image references and generated image assets.

Do not force a production into seasons or episodes. Let users add only the structural levels relevant to their project.

Director Mode must remain approachable. It should not expose every internal field at once; use progressive disclosure and AI-assisted drafting with user approval before durable changes.

## 5. Showrunner / Agent panel

- The composer area contains a clear Showrunner/Agent control.
- Activating it enables the assistant workflow without navigating away from the workspace.
- Expanding it opens a right-side conversation panel.
- The main canvas remains visible behind or beside the panel.
- The expanded panel has a close (X) button at the top right.
- Closing returns the conversation to its compact/previous placement.
- Do not show a second redundant expand control inside the expanded panel when X is the return action.
- Preserve the active session, composer draft, selected asset, scroll positions, and mode across expand/close.
- A hamburger/menu control at the top of the panel opens project-specific conversation sessions.
- Session menu supports new session, open session, rename, and delete with confirmation.
- Session history is project-scoped.
- Deleting a session deletes its chat messages only; it does not delete generated project assets.

The exact panel width, animation, and breakpoints are design implementation details, but the interaction rules above are requirements.

## 6. Image creation and history

- Standard Mode supports a direct image request from the composer.
- Director Mode can generate an image from a selected character, location, scene, or visual reference.
- Show only relevant controls initially: aspect ratio and number of outputs; provider/model controls remain advanced.
- Allow the user to attach or select project references.
- Display a non-blocking generation state in the workspace.
- On completion, show image previews and actions: open, use as reference, edit, download, add to collection, and view history.
- Editing never overwrites the original. It creates a new version linked to the original asset.
- Image history includes prior versions, prompts, timestamps, and provider/model metadata where safe.
- Generated assets remain in the project library even if their originating conversation is deleted.

## 7. Characters and references

Character detail view should support:
- Name and aliases.
- Identity summary and detailed description.
- Stable appearance traits (face, hair, age range as fictional description, build, distinctive features, etc.).
- Wardrobe/appearance notes.
- Reference images.
- Optional voice description/reference metadata (no audio generation in v1).
- Continuity rules and approved facts.
- Linked assets and version history.

Support `@CharacterName`-style selection in the composer. Autocomplete must resolve to an existing character in the current project and send stable asset/reference IDs to the backend.

Other reference types include locations, props, wardrobe, style guides, and custom user-defined reference categories where practical.

## 8. Loading, progress, and error states

- Streaming text: show the response as it arrives, with a subtle active-generation indicator.
- Image generation: show a compact pending/running state with cancel only if the provider supports cancellation.
- Failed generation: show a clear reason category and safe retry action.
- Interrupted stream: preserve received text and show an interrupted/retry/continue state.
- Empty project: explain the next useful action without showing a technical setup checklist.
- Offline state: make clear which cached content is available and prevent false claims that unsaved content is synced.

Do not expose stack traces, raw provider payloads, internal tool names, or secrets in the normal UI.

## 9. Accessibility and responsive behavior

- Keyboard-accessible navigation, composer, panel, menus, dialogs, and image history.
- Correct focus trap and focus return for modal/drawer behavior.
- Screen-reader labels for icon-only controls.
- Visible focus indicators.
- Sufficient contrast and reduced-motion support.
- Responsive desktop, tablet, and mobile layouts.
- No hover-only actions.
- Do not assume GPU or high memory on mobile devices.

## 10. UX acceptance criteria

- A user can create a project and start chatting without first configuring an AI model.
- Standard/Director switching preserves project, session, and draft state.
- Expanding the Showrunner does not navigate away from the workspace.
- Closing the panel returns to the previous workspace state.
- Sessions are independently manageable from project assets.
- A generated image remains findable after deleting its originating conversation.
- Editing an image preserves its original version.
- Streaming text appears progressively and partial text survives a page refresh where local storage is available.
- The interface remains usable on a low-end mobile device without WebGPU.
