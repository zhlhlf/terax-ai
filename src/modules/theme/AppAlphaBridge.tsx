import { usePreferencesStore } from "@/modules/settings/preferences";
import { useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import { applyVibrancy, paintHtmlBase } from "./vibrancy";

/**
 * No background image means the whole app falls back to one translucent
 * backdrop. The flag is set on `<html>` so the stylesheet can swap `--frame`
 * and drop the pane fill in one place instead of threading a prop through every
 * surface. The chosen alpha is published as `--frame-alpha`, which the stylesheet
 * reads for both the main and the settings window. Present only while the
 * preference store has hydrated, so an image-bearing profile never flashes the
 * translucent paint.
 */
export function AppAlphaBridge() {
  const backgroundKind = usePreferencesStore((s) => s.backgroundKind);
  const backgroundImageId = usePreferencesStore((s) => s.backgroundImageId);
  const frameOpacity = usePreferencesStore((s) => s.frameOpacity);
  const hydrated = usePreferencesStore((s) => s.hydrated);
  const { resolvedMode } = useTheme();

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.style.setProperty("--frame-alpha", String(frameOpacity));
    if (backgroundKind !== "image" || !backgroundImageId) {
      root.dataset.appAlpha = "on";
    } else {
      delete root.dataset.appAlpha;
    }
    // The `<html>` fill backs off while this attribute is on, and returns when
    // it is not; the vibrancy bridge re-applies its own fill on its own effect.
    paintHtmlBase(resolvedMode === "dark");
    // The settings window has no vibrancy bridge of its own, so without this its
    // `<html>` would keep the opaque pre-paint colour behind the translucent
    // surface, and the desktop would never show through.
    if (document.getElementById("settings-root")) {
      void applyVibrancy(
        usePreferencesStore.getState().windowVibrancy,
        resolvedMode === "dark",
      );
    }
  }, [backgroundKind, backgroundImageId, frameOpacity, hydrated, resolvedMode]);

  return null;
}
