import { usePreferencesStore } from "@/modules/settings/preferences";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { resolveSurfaceMode } from "./surfaceMode";
import {
  applyVibrancy,
  getBackdropKind,
  paintHtmlBase,
  type Backdrop,
} from "./vibrancy";

/**
 * The surface mode is owned in one place: CSS alpha, a native backdrop, or a
 * user image. The flag is set on `<html>` so the stylesheet can swap `--frame`
 * and drop the pane fill in one place instead of threading a prop through every
 * surface. Present only while the preference store has hydrated, so the first
 * paint never flashes the wrong translucent fill.
 */
export function AppAlphaBridge() {
  const backgroundKind = usePreferencesStore((s) => s.backgroundKind);
  const backgroundImageId = usePreferencesStore((s) => s.backgroundImageId);
  const frameOpacity = usePreferencesStore((s) => s.frameOpacity);
  const windowVibrancy = usePreferencesStore((s) => s.windowVibrancy);
  const hydrated = usePreferencesStore((s) => s.hydrated);
  const { resolvedMode } = useTheme();
  const [backdropKind, setBackdropKind] = useState<Backdrop>("none");

  useEffect(() => {
    let alive = true;
    void getBackdropKind().then((kind) => {
      if (alive) setBackdropKind(kind);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.style.setProperty("--frame-alpha", String(frameOpacity));
    const mode = resolveSurfaceMode({
      backgroundKind,
      backgroundImageId,
      windowVibrancy,
      nativeBackdropAvailable: backdropKind === "vibrancy",
    });
    if (mode === "app-alpha") root.dataset.appAlpha = "on";
    else delete root.dataset.appAlpha;
    if (mode === "image") root.dataset.bgImage = "on";
    else delete root.dataset.bgImage;
    paintHtmlBase(resolvedMode === "dark");
    void applyVibrancy(mode === "native-backdrop", resolvedMode === "dark");
  }, [
    backgroundKind,
    backgroundImageId,
    frameOpacity,
    hydrated,
    backdropKind,
    resolvedMode,
    windowVibrancy,
  ]);

  return null;
}
