import { describe, expect, it } from "vitest";
import { resolveSurfaceMode } from "./surfaceMode";

describe("surface mode resolution", () => {
  it("uses the translucent CSS surface for image-less profiles", () => {
    expect(
      resolveSurfaceMode({
        backgroundKind: "none",
        backgroundImageId: null,
        windowVibrancy: false,
        nativeBackdropAvailable: false,
      }),
    ).toBe("app-alpha");
  });

  it("does not stack a native backdrop behind CSS alpha", () => {
    expect(
      resolveSurfaceMode({
        backgroundKind: "none",
        backgroundImageId: null,
        windowVibrancy: true,
        nativeBackdropAvailable: true,
      }),
    ).toBe("native-backdrop");
  });

  it("keeps the image surface without forcing a native backdrop", () => {
    expect(
      resolveSurfaceMode({
        backgroundKind: "image",
        backgroundImageId: "test-image",
        windowVibrancy: false,
        nativeBackdropAvailable: false,
      }),
    ).toBe("image");
  });

  it("falls back to CSS alpha when the platform lacks a native backdrop", () => {
    expect(
      resolveSurfaceMode({
        backgroundKind: "none",
        backgroundImageId: null,
        windowVibrancy: true,
        nativeBackdropAvailable: false,
      }),
    ).toBe("app-alpha");
  });
});
