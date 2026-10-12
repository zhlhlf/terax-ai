import { invoke } from "@tauri-apps/api/core";

/** Mirrors `Backdrop` in `src-tauri/src/modules/vibrancy.rs`. */
export type Backdrop = "vibrancy" | "none";

/** Must stay in sync with the pre-paint script in index.html. */
export const PREPAINT_BG = { dark: "#141414", light: "#ffffff" } as const;

let kindPromise: Promise<Backdrop> | null = null;

export function getBackdropKind(): Promise<Backdrop> {
  kindPromise ??= invoke<Backdrop>("window_backdrop_kind").catch(
    () => "none" as const,
  );
  return kindPromise;
}

/** Last state handed to the native side. Repeating it would rebuild the
 * effect view for nothing. */
let applied: string | null = null;
let queue: Promise<void> = Promise.resolve();

/** Serialized: two in-flight toggles could otherwise land out of order. */
export function applyVibrancy(enabled: boolean, dark: boolean): Promise<void> {
  queue = queue.then(() => run(enabled, dark));
  return queue;
}

/**
 * The `<html>` fill is the last opaque paint behind the app. It has to stand
 * down whenever either the OS backdrop or the translucent app surface is the
 * base, or that fill sits behind the alpha layer and hides the desktop.
 */
export function paintHtmlBase(dark: boolean): void {
  const root = document.documentElement;
  const backdropPaints =
    root.dataset.appAlpha === "on" ||
    root.dataset.bgImage === "on" ||
    root.dataset.vibrancy === "on";
  root.style.backgroundColor = backdropPaints
    ? ""
    : dark
      ? PREPAINT_BG.dark
      : PREPAINT_BG.light;
}

async function run(enabled: boolean, dark: boolean): Promise<void> {
  const kind = await getBackdropKind();
  const supported = kind === "vibrancy";
  const on = enabled && supported;
  const root = document.documentElement;

  const paintOpaque = () => {
    root.removeAttribute("data-vibrancy");
    paintHtmlBase(dark);
  };

  if (on) {
    root.setAttribute("data-vibrancy", "on");
    paintHtmlBase(dark);
  } else {
    paintOpaque();
  }

  const key = supported ? (on ? "on" : "off") : "none";
  if (key === applied) return;

  if (!supported) {
    applied = key;
    return;
  }

  try {
    await invoke("window_set_backdrop", { enabled: on });
    applied = key;
  } catch {
    // Never leave the webview transparent over nothing.
    paintOpaque();
    applied = null;
  }
}
