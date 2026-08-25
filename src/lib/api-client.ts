/**
 * Centralized HTTP client for the PathGraph FastAPI backend.
 *
 * Every non-2xx response from the backend is normalized into an
 * `ApiError` with one of a small, known set of codes. The shapes this
 * has to handle (see pathgraph-backend/app/main.py and
 * app/dependencies/database.py):
 *
 *   404  { "error": { "code": "RESOURCE_NOT_FOUND", "message": string } }
 *   503  { "error": { "code": "DATABASE_ERROR",     "message": string } }
 *   500  { "error": { "code": "INTERNAL_ERROR",      "message": string } }
 *   422  { "detail": [{ "loc": [...], "msg": string, "type": string }] }
 *          — FastAPI's own request-validation envelope; the app's custom
 *          handlers never override this one, so it's a different shape
 *          from the other three and is normalized separately below.
 *
 * A request that never reaches the server (offline, DNS failure, CORS
 * rejection, connection refused) throws before there's any Response to
 * read — that's surfaced as NETWORK_ERROR so the UI can tell "the API
 * said no" apart from "the API was never reached."
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type ApiErrorCode =
  | "RESOURCE_NOT_FOUND"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR"
  | "VALIDATION_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

const KNOWN_BACKEND_CODES: readonly ApiErrorCode[] = [
  "RESOURCE_NOT_FOUND",
  "DATABASE_ERROR",
  "INTERNAL_ERROR",
];

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number | null;

  constructor(message: string, code: ApiErrorCode, status: number | null) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }

  /** True when CognoDB itself was unreachable — the case the WEXA brief calls out by name. */
  get isDatabaseUnavailable(): boolean {
    return this.code === "DATABASE_ERROR";
  }

  get isNotFound(): boolean {
    return this.code === "RESOURCE_NOT_FOUND";
  }
}

interface BackendErrorEnvelope {
  error: { code: string; message: string };
}

interface ValidationErrorEnvelope {
  detail: Array<{ loc: Array<string | number>; msg: string; type: string }>;
}

function isBackendErrorEnvelope(body: unknown): body is BackendErrorEnvelope {
  if (typeof body !== "object" || body === null || !("error" in body)) return false;
  const err = (body as { error?: unknown }).error;
  return (
    typeof err === "object" &&
    err !== null &&
    typeof (err as { code?: unknown }).code === "string" &&
    typeof (err as { message?: unknown }).message === "string"
  );
}

function isValidationErrorEnvelope(body: unknown): body is ValidationErrorEnvelope {
  if (typeof body !== "object" || body === null || !("detail" in body)) return false;
  const detail = (body as { detail?: unknown }).detail;
  return Array.isArray(detail) && detail.every((d) => typeof d === "object" && d !== null && "msg" in d);
}

async function toApiError(response: Response): Promise<ApiError> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // Response wasn't JSON (proxy error page, empty body, etc.) — fall through.
  }

  if (isBackendErrorEnvelope(body)) {
    const code = body.error.code as ApiErrorCode;
    const resolvedCode = KNOWN_BACKEND_CODES.includes(code) ? code : "UNKNOWN_ERROR";
    return new ApiError(body.error.message, resolvedCode, response.status);
  }

  if (isValidationErrorEnvelope(body)) {
    const first = body.detail[0];
    // loc[0] is usually "query" / "path"; drop it and keep the field name.
    const field = first?.loc?.slice(1).join(".") || "request";
    const message = first?.msg ? `Invalid ${field}: ${first.msg}` : "The request was invalid.";
    return new ApiError(message, "VALIDATION_ERROR", response.status);
  }

  return new ApiError(`Request failed with status ${response.status}.`, "UNKNOWN_ERROR", response.status);
}

/**
 * Fetch JSON from the PathGraph API and throw a typed `ApiError` on failure.
 * `path` is joined to the configured API base — pass e.g. "/api/v1/roles".
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { Accept: "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(
      "Could not reach the PathGraph API. Check your connection and try again.",
      "NETWORK_ERROR",
      null,
    );
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/** Builds a `?a=1&b=2` query string, skipping undefined values. Keeps callers out of manual string concatenation. */
export function buildQuery(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter((entry): entry is [string, string] => entry[1] !== undefined);
  if (entries.length === 0) return "";
  return `?${new URLSearchParams(entries).toString()}`;
}
