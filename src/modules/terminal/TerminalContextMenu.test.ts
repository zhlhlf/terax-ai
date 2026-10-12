import { describe, expect, it } from "vitest";
import { shouldOpenTerminalContextMenu } from "./TerminalContextMenu";

function contextClick(overrides: Partial<MouseEvent> = {}) {
  return { defaultPrevented: false, shiftKey: false, ...overrides };
}

describe("terminal context menu gating", () => {
  it("opens for a plain right click when the program does not track the mouse", () => {
    expect(shouldOpenTerminalContextMenu(contextClick(), false)).toBe(true);
  });

  it("leaves the click to a program that tracks the mouse", () => {
    expect(shouldOpenTerminalContextMenu(contextClick(), true)).toBe(false);
  });

  it("reopens on Shift for a program that tracks the mouse", () => {
    expect(
      shouldOpenTerminalContextMenu(contextClick({ shiftKey: true }), true),
    ).toBe(true);
  });

  it("stays closed when an earlier handler already consumed the event", () => {
    expect(
      shouldOpenTerminalContextMenu(
        contextClick({ defaultPrevented: true }),
        false,
      ),
    ).toBe(false);
  });
});
