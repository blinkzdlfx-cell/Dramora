# Dramora — AI Streaming and Local Processing Specification

## 1. Separate the responsibilities

These concepts must not be conflated:

- **Model inference:** The external AI provider executes the text/image model.
- **Network streaming:** The Worker forwards generated chunks to the browser.
- **UI rendering:** The browser progressively displays received chunks.
- **Local persistence:** IndexedDB stores drafts and partial state.
- **Local compute:** Web Workers and optional browser APIs execute suitable processing tasks.
- **Canonical persistence:** Supabase stores durable messages, projects, jobs, and assets.

IndexedDB does not use the GPU. WebGPU does not make an external AI provider generate a longer response. Moving response display to the browser does not move model inference to the user's device.

## 2. Text streaming request lifecycle

1. Client creates a message ID and idempotency key.
2. Client stores the outgoing message in IndexedDB as pending.
3. Client submits the message and current session/project identifiers to the Worker.
4. Worker validates the Supabase session and authorization.
5. Worker persists or reconciles the user message and creates an assistant generation record.
6. Worker builds authorized context and calls the selected text provider.
7. Worker returns a streaming response immediately.
8. Worker forwards provider chunks without collecting the complete answer in memory.
9. Client parses chunks and appends them to the visible assistant message.
10. Client periodically checkpoints received text to IndexedDB.
11. A bounded checkpoint may also be sent to the API at intervals (not per token) to support cross-device recovery.
12. On provider completion, the final assistant message and generation status are saved to Supabase.
13. Client reconciles local state with the canonical message.

Use SSE framing when named events, heartbeats, or explicit status events improve the client contract. A plain streaming response is also valid if the provider format is safely normalized. Do not force SSE if it adds no value.

## 3. Stream event contract

Normalize provider-specific events into a small application contract, for example:
- `generation.started`
- `text.delta` with sequence number and text fragment
- `generation.usage` with safe usage metadata when available
- `generation.completed`
- `generation.interrupted`
- `generation.failed` with a safe public error code

The UI must handle:
- Partial chunks arriving quickly or slowly.
- Split UTF-8 characters and arbitrary network chunk boundaries.
- Duplicate events and reconnect attempts.
- Provider usage/metadata events that contain no visible text.
- Empty or blocked output.
- Explicit completion versus stream closure without completion.

Never assume one network chunk equals one token or one complete JSON object. Use a robust streaming parser and sequence handling.

## 4. Cloudflare Worker constraints and Error 1102

As documented by Cloudflare on 13 November 2026:
- Workers Free CPU time is 10 ms per HTTP request.
- Workers Paid CPU time is 5 minutes maximum, with a 30-second default unless configured otherwise.
- Worker memory is 128 MB.
- Network waiting, including external `fetch()` calls, does not count as CPU time.
- HTTP request wall time has no general hard limit while the client remains connected.
- A disconnected client or runtime interruption can cancel in-flight request work.
- Error 1102 indicates resource exhaustion, commonly CPU or memory.

Implications:
- Streaming while waiting on an AI provider is compatible with Workers; it does not inherently consume the CPU budget for the duration of the provider's network wait.
- Parsing huge payloads, buffering entire responses, expensive loops, media decoding, and large in-memory objects can exceed CPU or memory limits.
- Keep static asset delivery out of the API Worker using Static Assets routing.
- Measure actual CPU and memory; never assume an operation is safe solely because it is asynchronous.
- No architecture can promise that 1102 or network interruptions are impossible.

Official reference: [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits/) and [Error 1102](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1102/).

## 5. Interruption and recovery

A streaming HTTP connection is not a durable background job. If the browser disconnects, the stream may be canceled.

Required behavior:
- Preserve the received partial answer in IndexedDB.
- Mark the generation as interrupted unless completion was explicitly received.
- If bounded server checkpoints exist, reconcile the latest sequence on reconnect.
- If the provider supports a documented continuation/resume API, use it.
- If it does not, offer a restart or a new continuation prompt based on the saved partial text. Do not falsely label it as resuming the same provider generation.
- Use idempotency keys to prevent duplicate user messages and duplicate final assistant records.
- A generation must never be marked complete solely because the HTTP connection closed.

Do not write every token to PostgreSQL. Checkpoint at a bounded interval/size, such as every 1–2 seconds or after a configured character threshold, then persist the final message once. Tune after load testing.

## 6. IndexedDB responsibilities

Use IndexedDB for:
- Recent project/conversation cache.
- Draft messages and composer state.
- Optimistic pending message records.
- Partial streamed assistant text.
- Bounded stream checkpoints and sequence numbers.
- Temporary local metadata and lightweight work queues.
- Cache version and schema migration metadata.

Do not use IndexedDB for:
- Authentication secrets outside the Supabase SDK's supported session handling.
- Provider API keys.
- Canonical project records.
- Permanent generated assets that have not been uploaded.
- Large files without explicit quota/eviction handling.
- GPU execution or model inference.

The app must tolerate cache eviction, quota errors, private browsing restrictions, and devices that disable persistent storage. Supabase remains canonical.

## 7. Local processing capabilities

- **Web Workers:** Offload CPU work from the UI thread.
- **WebAssembly:** Run portable compute code when justified.
- **WebCodecs:** Use supported browser codecs for specific media tasks.
- **WebGPU:** Optional GPU compute where browser/device support and a concrete feature justify it.
- **Canvas/ImageBitmap:** Suitable browser image operations where quality and memory are controlled.

Initial scope does not require local image enhancement, video rendering, or local AI. Add a local processing module only when a real image feature needs it. Use feature detection and fallback paths; never make WebGPU a prerequisite.

## 8. Client capability and resource policy

- Detect support, not personal identity.
- Use conservative memory/work-size thresholds.
- Respect device memory and browser support hints where available, but treat them as estimates.
- Avoid parallel high-memory tasks on mobile.
- Allow cancellation for local tasks.
- Yield to the UI and report progress.
- Release object URLs, ImageBitmaps, workers, and temporary buffers.
- Provide cloud/provider fallback where appropriate.
- Do not silently run intensive work in the background.

## 9. Streaming observability

Record safe metrics:
- Time to first byte/token.
- Total generation duration.
- Number of chunks and bytes.
- Provider completion/failure.
- Client disconnect/interruption.
- Worker CPU time and memory-related failures.
- Checkpoint success and recovery result.
- Provider rate limit and timeout category.

Do not log raw access tokens, provider secrets, signed URLs, or full private prompts by default.
