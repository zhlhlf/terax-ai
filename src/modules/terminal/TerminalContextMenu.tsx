import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useT } from "@/lib/i18n";
import {
  COMPACT_CONTENT,
  COMPACT_ITEM,
} from "@/modules/explorer/lib/menuItemClass";
import {
  ClipboardPasteIcon,
  Copy01Icon,
  EraserIcon,
  TextSelectIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  readTerminalClipboard,
  writeTerminalClipboard,
} from "./lib/terminalClipboard";
import {
  clearLeafTerminal,
  focusSession,
  leafGridSelection,
  pasteIntoSession,
  selectLeafViewport,
} from "./lib/terminalSessionApi";

export type TerminalContextMenuProps = {
  leafId: number;
  /**
   * Whether this leaf had a grid selection when the menu last opened. Passed in
   * rather than read here because opening the menu does not re-render the pane,
   * so a read at render time would report a stale selection.
   */
  canCopy: boolean;
};

/**
 * Whether a context click should open our menu. A program that owns the mouse
 * expects the click itself, so it is suppressed unless Shift overrides, matching
 * the terminal convention for reaching the host menu.
 */
export function shouldOpenTerminalContextMenu(
  event: Pick<MouseEvent, "defaultPrevented" | "shiftKey">,
  mouseTracking: boolean,
): boolean {
  if (event.defaultPrevented) return false;
  return !mouseTracking || event.shiftKey;
}

/**
 * Contents of the terminal's context menu. Rendered by TerminalPane inside the
 * ContextMenu that triggers on the terminal surface; every action resolves the
 * current session state when it runs.
 */
export function TerminalContextMenu({
  leafId,
  canCopy,
}: TerminalContextMenuProps) {
  const t = useT();

  return (
    <ContextMenuContent
      className={COMPACT_CONTENT}
      onCloseAutoFocus={(event) => {
        // Radix would focus the trigger, which is the terminal surface rather
        // than the textarea that receives keystrokes, so typing would stop
        // working after the menu is used. Hand focus back to the terminal input.
        event.preventDefault();
        focusSession(leafId);
      }}
    >
      <ContextMenuItem
        className={COMPACT_ITEM}
        disabled={!canCopy}
        onSelect={() => {
          const selection = leafGridSelection(leafId);
          if (selection) void writeTerminalClipboard(selection);
        }}
      >
        <HugeiconsIcon icon={Copy01Icon} size={13} strokeWidth={1.75} />
        {t("terminal.menu.copy")}
      </ContextMenuItem>
      <ContextMenuItem
        className={COMPACT_ITEM}
        onSelect={() => {
          void readTerminalClipboard().then((text) => {
            if (text) pasteIntoSession(leafId, text);
          });
        }}
      >
        <HugeiconsIcon icon={ClipboardPasteIcon} size={13} strokeWidth={1.75} />
        {t("terminal.menu.paste")}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        className={COMPACT_ITEM}
        onSelect={() => selectLeafViewport(leafId)}
      >
        <HugeiconsIcon icon={TextSelectIcon} size={13} strokeWidth={1.75} />
        {t("terminal.menu.selectAll")}
      </ContextMenuItem>
      <ContextMenuItem
        className={COMPACT_ITEM}
        onSelect={() => clearLeafTerminal(leafId)}
      >
        <HugeiconsIcon icon={EraserIcon} size={13} strokeWidth={1.75} />
        {t("terminal.menu.clear")}
      </ContextMenuItem>
    </ContextMenuContent>
  );
}
