# Dramora — Initial Data Model

**Purpose:** Define the minimum durable domain model before database migrations are written. This is a logical model; exact SQL types, indexes, constraints, and RLS expressions are implementation tasks.

## 1. Core ownership model

- A user owns projects.
- A project contains conversations, production records, references, assets, collections, and activity.
- A conversation contains ordered messages and generation records.
- Generated assets belong to a project independently of the conversation that caused them.
- A user can have multiple projects and multiple conversations per project.
- Project membership is represented in the schema from the beginning, even if collaboration UI is deferred.

Every user-owned row must have an unambiguous project/user ownership path enforced by foreign keys and RLS.

## 2. Entities

### profiles
- `id` — matches Supabase Auth user ID.
- `display_name`, `avatar_asset_id` (optional).
- `created_at`, `updated_at`.

### projects
- `id`, `owner_id`, `name`, `description`.
- `status` (active/archived/deleted where soft deletion is used).
- `settings_json` for validated non-sensitive project preferences.
- `created_at`, `updated_at`.

### project_members
- `project_id`, `user_id`, `role` (owner/editor/viewer).
- Unique constraint on project/user.
- Collaboration UI and invitations are deferred; do not build billing/organization complexity.

### conversations
- `id`, `project_id`, `created_by`, `title`.
- `mode` (standard/director).
- `status` (active/archived).
- `created_at`, `updated_at`, `last_message_at`.

### messages
- `id`, `conversation_id`, `project_id`, `sequence`.
- `role` (system/developer/user/assistant/tool; restrict which roles are client-creatable).
- `content` or structured content parts.
- `status` (pending/streaming/completed/interrupted/failed).
- `generation_id` nullable.
- `client_message_id`/idempotency key for deduplication.
- `created_at`, `updated_at`.
- Avoid storing provider secrets or unnecessary hidden reasoning.

### generations
- `id`, `project_id`, `conversation_id`, `requested_by`.
- `capability` (text.generate/image.generate/image.edit).
- `provider_key`, `model_key` (internal identifiers).
- `status` (queued/running/completed/failed/cancelled/interrupted).
- `idempotency_key`, `provider_job_id` nullable.
- `request_metadata` (validated, redacted, and bounded).
- `last_checkpoint_sequence`, `safe_error_code`.
- `started_at`, `completed_at`, `created_at`, `updated_at`.

### generation_checkpoints
- `id`, `generation_id`, `sequence`, `content_delta` or checkpoint snapshot.
- `created_at`.
- Store bounded checkpoint data only; use a unique generation/sequence constraint and retention policy.

### production_bibles
- `id`, `project_id`, `title`, `premise`, `logline`, `synopsis`.
- `genre`, `tone`, `themes`, `visual_style`, `continuity_rules`.
- `approved_at`, `created_at`, `updated_at`.

### characters
- `id`, `project_id`, `name`, `aliases`.
- `summary`, `description`, `appearance_traits`, `wardrobe_notes`.
- `voice_description` and optional `voice_reference_asset_id` (metadata only in v1).
- `continuity_rules`, `status`, `created_at`, `updated_at`.

### creative_references
- `id`, `project_id`, `type` (location/prop/wardrobe/style/custom).
- `name`, `description`, `attributes_json`, `status`.
- `created_at`, `updated_at`.

### assets
- `id`, `project_id`, `created_by`, `conversation_id` nullable, `generation_id` nullable.
- `type` (image/upload/document; no generated video/audio in v1).
- `name`, `mime_type`, `byte_size`, `storage_bucket`, `storage_path`.
- `metadata_json`, `status`, `created_at`, `updated_at`.
- Asset ownership is independent of conversation lifecycle.

### asset_versions
- `id`, `asset_id`, `version_number`, `parent_version_id` nullable.
- `storage_path`, `prompt`, `provider_key`, `model_key`, `metadata_json`.
- `created_at`, `created_by`.
- Versions are immutable; editing creates a new version.

### collections
- `id`, `project_id`, `parent_collection_id` nullable, `name`, `created_at`, `updated_at`.

### collection_assets
- `collection_id`, `asset_id`, `created_at`.
- Unique collection/asset pair.

### activity_events
- `id`, `project_id`, `actor_id`, `event_type`, `entity_type`, `entity_id`.
- `safe_metadata_json`, `created_at`.
- Do not store secrets or raw sensitive payloads.

## 3. Important relationships

- User 1—many Projects.
- Project 1—many Conversations, Production Bibles, Characters, References, Assets, Collections, Generations, and Activity Events.
- Conversation 1—many Messages and Generations.
- Generation 1—many Checkpoints and may create one or more Assets.
- Asset 1—many immutable Asset Versions.
- Collections and Assets are many-to-many.
- Characters may reference one or more assets through a join table or typed reference relationship; avoid hard-coding one reference image only.

## 4. RLS and storage rules

- Enable RLS on every user-owned table.
- A user can read/write a project only if they are its owner or an authorized member with a sufficient role.
- Child records inherit authorization through their project relationship.
- Restrict role changes and project ownership changes to trusted server-side operations.
- Storage object paths must include an unguessable project/user-scoped prefix and be checked against project membership.
- Private bucket by default; signed download URLs are short-lived.
- Never rely on UI hiding as authorization.
- Test cross-user and cross-project access explicitly.

## 5. Indexes and constraints

At minimum:
- Foreign-key indexes for project/conversation/generation/asset relations.
- Unique project membership.
- Unique conversation sequence.
- Unique client idempotency key within the appropriate user/project scope.
- Unique generation idempotency key.
- Unique generation checkpoint sequence.
- Unique asset version number per asset.
- Index project updated/last activity timestamps.
- Index generation status and creation time for job reconciliation.
- Validate collection nesting to prevent cycles and excessive depth.

## 6. Deletion and retention

- Deleting a conversation must not delete its assets.
- Deleting an asset should require confirmation and handle its versions and collection links explicitly.
- Project deletion must explain whether assets are permanently deleted and must not leave orphaned storage objects.
- Account deletion must cover database rows, storage objects, and provider-side retention where controllable.
- Define retention for interrupted generation checkpoints and failed job metadata before production launch.
