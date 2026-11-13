# Dramora — AI Provider Integration Contract

## 1. Provider strategy

Dramora uses external providers for text and image inference. Business logic must depend on capability interfaces, not a provider's product name or model identifier.

No specific AI vendor is locked by this document. Select providers after evaluating API access, output quality, streaming, image editing/reference support, reliability, price, rate limits, regional availability, data handling, and terms.

## 2. Initial capabilities

Required for first release:
- `text.generate`: conversational text generation with streaming.
- `text.generate_structured`: validated structured output for story/character/production records.
- `image.generate`: text-to-image generation.
- `image.edit`: image editing where the provider supports it.
- `image.reference_conditioning`: optional reference-image input, capability-gated.

Not required in v1:
- Video generation.
- Text-to-speech or voice cloning.
- Audio generation/editing.
- Local LLM inference.

## 3. Adapter contract

Each provider adapter should declare:
- Stable internal provider key and display name.
- Supported capabilities.
- Supported input formats and limits.
- Supported output formats, dimensions, and aspect ratios.
- Streaming support and event format for text.
- Image edit/reference support.
- Async job behavior: synchronous response, provider job ID, polling, webhook, cancellation, and expiry where documented.
- Rate limits, timeout guidance, and known restrictions.
- Safe error mapping and retry classification.

Do not advertise a capability that has not been tested against the provider's actual API.

## 4. Text adapter

The text adapter must:
- Accept normalized messages and bounded context.
- Support streaming where offered.
- Normalize provider chunks into Dramora stream events.
- Preserve provider finish reason and safe usage metadata.
- Detect provider errors and incomplete streams.
- Never buffer unbounded output.
- Keep API keys server-side.
- Respect configured output token limits without silently truncating responses.
- Return a clear limit/error state if the provider itself ends output due to its context/output limit.

The UI must distinguish provider completion from network interruption and application failure.

## 5. Image adapter

The image adapter must:
- Validate prompt and reference inputs.
- Confirm the provider supports the requested dimensions/aspect ratio/editing mode.
- Normalize synchronous and asynchronous results.
- Return binary/image URL/job metadata in a consistent internal shape.
- Validate downloaded output type and size before storage.
- Store generated output in Dramora's private Storage, not depend permanently on an expiring provider URL.
- Preserve prompt, settings, provider/model identifier, and source asset references as version metadata.
- Retry only errors classified as safe to retry; use idempotency where the provider supports it.

## 6. Generation job service

The job service owns:
- Generation record creation.
- Idempotency and duplicate prevention.
- Provider submission and status normalization.
- Retry/backoff policy.
- Output validation and asset creation.
- Terminal status and safe error codes.
- Cancellation only where provider capability supports it.

Do not use a browser tab as the only owner of an asynchronous image job. Do not assume a provider job continues if the user's browser disconnects unless the provider's contract guarantees it and the job state is durably tracked.

## 7. Provider selection scorecard

Evaluate each candidate against:
1. Text response quality and instruction following.
2. Structured output reliability.
3. Text streaming and finish-reason behavior.
4. Image generation quality.
5. Image editing and reference-image conditioning.
6. Output format/dimensions.
7. Rate limits and reliability.
8. Cost per realistic usage pattern.
9. Regional latency and availability.
10. Data retention, privacy, safety, and commercial terms.
11. API stability and documentation quality.
12. Ability to use the same provider for multiple capabilities without coupling the application.

Record the selected provider and tested model capabilities in a separate implementation note. Do not hard-code model names in UI components.
