import { API_BASE_URL, ApiError } from "../lib/api-client";

/**
 * Mirrors app/routers/health.py. This endpoint is intentionally NOT
 * wired through apiFetch(): a 503 here still returns a meaningful,
 * well-formed body ({ status: "degraded", database: "disconnected", ... })
 * rather than the {"error": {...}} envelope every other endpoint uses on
 * failure. Treating that 503 as a thrown ApiError would discard the
 * status the caller actually wants to render — so both 200 and 503 are
 * read as success here, and only a genuine network failure throws.
 */
export interface HealthResponse {
  status: "healthy" | "degraded";
  database: "connected" | "disconnected" | "uninitialized";
  service: string;
}

export async function fetchHealth(): Promise<HealthResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/health`, { headers: { Accept: "application/json" } });
  } catch {
    throw new ApiError(
      "Could not reach the PathGraph API. Check your connection and try again.",
      "NETWORK_ERROR",
      null,
    );
  }

  try {
    return (await response.json()) as HealthResponse;
  } catch {
    throw new ApiError("The health check returned an unexpected response.", "UNKNOWN_ERROR", response.status);
  }
}
