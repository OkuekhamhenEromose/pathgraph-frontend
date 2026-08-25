import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../lib/api-client";

export type QueryStatus = "loading" | "success" | "empty" | "error";

export interface UseApiQueryResult<T> {
  data: T | null;
  status: QueryStatus;
  error: ApiError | null;
  refetch: () => void;
}

/**
 * Minimal data-fetching hook for read-only GET requests against the
 * PathGraph API.
 *
 * Deliberately not TanStack Query: every screen in this app issues at
 * most one or two GETs, nothing is shared or cached across routes, and
 * there are no mutations to invalidate anything against. Pulling in a
 * caching library for that would be the dependency the master prompt's
 * own architecture step warns against — "do not install libraries
 * simply because they are popular." This hook covers what the app
 * actually needs: loading/success/empty/error status, stale-response
 * guarding, and a manual refetch for retry buttons.
 */
export function useApiQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  isEmpty: (data: T) => boolean = (data) => Array.isArray(data) && data.length === 0,
): UseApiQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<QueryStatus>("loading");
  const [error, setError] = useState<ApiError | null>(null);

  // Guards against a stale response landing after a newer request has
  // already started (e.g. the user changes a param mid-flight).
  const requestId = useRef(0);

  const run = useCallback(() => {
    const id = ++requestId.current;
    setStatus("loading");
    setError(null);

    fetcher()
      .then((result) => {
        if (id !== requestId.current) return;
        setData(result);
        setStatus(isEmpty(result) ? "empty" : "success");
      })
      .catch((err: unknown) => {
        if (id !== requestId.current) return;
        setData(null);
        setError(err instanceof ApiError ? err : new ApiError("Something went wrong.", "UNKNOWN_ERROR", null));
        setStatus("error");
      });
    // `fetcher` and `isEmpty` are intentionally excluded — callers pass
    // their own explicit `deps` array (mirroring useEffect) rather than
    // relying on function identity, which would refetch on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, status, error, refetch: run };
}
