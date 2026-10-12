import { invoke } from "@tauri-apps/api/core";
import { useCallback } from "react";
import { type AsyncQueryState, useAsyncQuery } from "./useAsyncQuery";

const LIMIT = 60;
const DEBOUNCE_MS = 80;

export function useCommandHistory(
  term: string,
  enabled: boolean,
): AsyncQueryState<string> {
  const run = useCallback(
    async (q: string) =>
      Array.from(
        new Set(
          await invoke<string[]>("history_list", {
            query: q,
            limit: LIMIT,
          }).catch(() => []),
        ),
      ),
    [],
  );

  return useAsyncQuery({
    enabled,
    term,
    minLength: 0,
    debounceMs: DEBOUNCE_MS,
    run,
  });
}
