import { describe, expect, it, vi } from "vitest";

const pluginStore = vi.hoisted(() => {
  const data = new Map<string, unknown>();
  class LazyStore {
    entries = vi.fn(async () => [...data.entries()]);
    get = vi.fn(async (key: string) => data.get(key));
    set = vi.fn(async (key: string, value: unknown) => {
      data.set(key, value);
    });
    save = vi.fn(async () => undefined);
    onChange = vi.fn(async () => () => undefined);
  }
  return { data, LazyStore };
});

vi.mock("@tauri-apps/plugin-store", () => ({
  LazyStore: pluginStore.LazyStore,
}));

vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn(async () => () => undefined),
  emit: vi.fn(async () => undefined),
}));

async function loadWith(entries: Record<string, unknown>) {
  pluginStore.data.clear();
  for (const [key, value] of Object.entries(entries)) {
    pluginStore.data.set(key, value);
  }
  vi.resetModules();
  const { loadPreferences } = await import("./store");
  return await loadPreferences();
}

describe("loadPreferences window vibrancy migration", () => {
  it("keeps the CSS corners for a config written before the toggle existed", async () => {
    const prefs = await loadWith({ themeId: "claude", backgroundKind: "none" });

    expect(prefs.windowVibrancy).toBe(false);
  });

  it("honours an explicit opt-in", async () => {
    const prefs = await loadWith({ windowVibrancy: true });

    expect(prefs.windowVibrancy).toBe(true);
  });

  it("honours an explicit opt-out", async () => {
    const prefs = await loadWith({ windowVibrancy: false });

    expect(prefs.windowVibrancy).toBe(false);
  });
});
