import { invoke } from "@tauri-apps/api/core";

/** Mirrors `Backdrop` in `src-tauri/src/modules/vibrancy.rs`. */
export type Backdrop = "vibrancy" | "mica" | "windows-force" | "none";

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
 * base, or that fill sits behind the 66% layer and hides the desktop. Reading
 * the attributes at call time lets the two bridges each repaint without
 * tracking each other's state.
 */
export function paintHtmlBase(dark: boolean): void {
  const root = document.documentElement;
  const backdropPaints =
    root.dataset.appAlpha === "on" || root.dataset.vibrancy === "on";
  root.style.backgroundColor = backdropPaints
    ? ""
    : dark
      ? PREPAINT_BG.dark
      : PREPAINT_BG.light;
}

async function run(enabled: boolean, dark: boolean): Promise<void> {
  const kind = await getBackdropKind();
  // The switch is the user's intent, not a platform capability: a kind of
  // `none` or `windows-force` means the platform has no backdrop to offer, not
  // that one is forbidden. On Windows 11 21H2 Mica needs the undocumented
  // attribute and costs the CSS-painted rounded corners, so the user opts into
  // it rather than the platform deciding for them.
  const on = enabled;
  const root = document.documentElement;

  const paintOpaque = () => {
    root.removeAttribute("data-vibrancy");
    paintHtmlBase(dark);
  };

  if (on) {
    root.setAttribute("data-vibrancy", "on");
    // The pre-paint colour parked on <html> sits in front of the backdrop.
    paintHtmlBase(dark);
  } else {
    paintOpaque();
  }

  // Only NSVisualEffectView adapts to the theme on its own; Mica (documented or
  // undocumented) tints its own backdrop and has to be rebuilt on a mode flip.
  const key = on ? (kind === "vibrancy" ? "on" : `on:${dark}`) : "off";
  if (key === applied) return;

  try {
    await invoke("window_set_backdrop", { enabled: on, dark });
    applied = key;
  } catch {
    // Never leave the webview transparent over nothing.
    paintOpaque();
    applied = null;
  }
}
