import type { SearchTarget } from "@/modules/header";
import { MAX_PANES_PER_TAB, type Tab } from "@/modules/tabs";
import { leafIds } from "@/modules/terminal";
import {
  Cancel01Icon,
  DashboardSquare01Icon,
  FileSearchIcon,
  Globe02Icon,
  KeyboardIcon,
  LayoutTwoColumnIcon,
  LayoutTwoRowIcon,
  PaintBoardIcon,
  Search01Icon,
  Settings01Icon,
  TerminalIcon,
} from "@hugeicons/core-free-icons";
import type { PaletteItem } from "./types";

export const COMMAND_GROUPS = [
  "General",
  "Spaces",
  "Tabs",
  "Panes",
  "Search",
] as const;

export type CommandPaletteActionContext = {
  tabs: Tab[];
  activeId: number;
  searchTarget: SearchTarget;
  home: string | null;
  openNewTab: () => void;
  openNewPreview: () => void;
  closeActiveTabOrPane: () => void;
  splitPaneRight: () => void;
  splitPaneDown: () => void;
  focusSearch: () => void;
  openSettings: () => void;
  openKeyboardShortcuts: () => void;
  spaces: { id: string; name: string }[];
  activeSpaceId: string | null;
  openSpacesOverview: () => void;
  newSpace: () => void;
  switchSpace: (id: string) => void;
};

const noop = () => {};

export function createCommandItems(
  ctx: CommandPaletteActionContext,
): PaletteItem[] {
  const activeTab = ctx.tabs.find((tab) => tab.id === ctx.activeId);
  const activeTerminalTab = activeTab?.kind === "terminal" ? activeTab : null;
  const activePaneCount = activeTerminalTab
    ? leafIds(activeTerminalTab.paneTree).length
    : 0;
  const onlyOneTab = ctx.tabs.length < 2;
  const splitDisabled =
    !activeTerminalTab
      ? "No terminal tab"
      : activePaneCount >= MAX_PANES_PER_TAB
        ? "Pane limit"
        : undefined;
  const splitDisabledKey =
    !activeTerminalTab
      ? "palette.cmd.reason.noTerminalTab"
      : activePaneCount >= MAX_PANES_PER_TAB
        ? "palette.cmd.reason.paneLimit"
        : undefined;
  const closeDisabled =
    onlyOneTab && activePaneCount < 2 ? "Last tab" : undefined;
  const closeDisabledKey =
    onlyOneTab && activePaneCount < 2
      ? "palette.cmd.reason.lastTab"
      : undefined;

  return [
    {
      id: "settings.open",
      title: "Open settings",
      titleKey: "palette.cmd.openSettings",
      group: "General",
      keywords: ["preferences", "config"],
      icon: Settings01Icon,
      shortcutId: "settings.open",
      run: ctx.openSettings,
    },
    {
      id: "theme.pick",
      title: "Change theme...",
      titleKey: "palette.cmd.changeTheme",
      group: "General",
      keywords: ["theme", "appearance", "color", "dark", "light"],
      icon: PaintBoardIcon,
      run: noop,
    },
    {
      id: "shortcuts.open",
      title: "Keyboard shortcuts",
      titleKey: "palette.cmd.keyboardShortcuts",
      group: "General",
      keywords: ["keys", "keybindings", "settings"],
      icon: KeyboardIcon,
      run: ctx.openKeyboardShortcuts,
    },
    {
      id: "spaces.overview",
      title: "Spaces: Overview",
      titleKey: "palette.cmd.spacesOverview",
      group: "Spaces",
      keywords: ["spaces", "sessions", "overview", "organize", "manage", "move"],
      icon: DashboardSquare01Icon,
      run: ctx.openSpacesOverview,
    },
    {
      id: "spaces.new",
      title: "New Space",
      titleKey: "palette.cmd.newSpace",
      group: "Spaces",
      keywords: ["space", "session", "workspace", "group", "create"],
      icon: DashboardSquare01Icon,
      run: ctx.newSpace,
    },
    ...ctx.spaces.map((sp) => ({
      id: `spaces.switch.${sp.id}`,
      title: `Switch to ${sp.name}`,
      titleKey: "palette.cmd.switchSpace" as const,
      titleParams: { name: sp.name },
      group: "Spaces" as const,
      keywords: ["space", "switch", "session", sp.name],
      icon: DashboardSquare01Icon,
      disabledReason:
        sp.id === ctx.activeSpaceId ? "Current space" : undefined,
      disabledReasonKey:
        sp.id === ctx.activeSpaceId
          ? ("palette.cmd.reason.currentSpace" as const)
          : undefined,
      run: () => ctx.switchSpace(sp.id),
    })),
    {
      id: "tab.new",
      title: "New terminal",
      titleKey: "palette.cmd.newTerminal",
      group: "Tabs",
      keywords: ["shell", "terminal", "new tab"],
      icon: TerminalIcon,
      shortcutId: "tab.new",
      run: ctx.openNewTab,
    },
    {
      id: "tab.newPreview",
      title: "New web preview",
      titleKey: "palette.cmd.newWebPreview",
      group: "Tabs",
      keywords: ["browser", "web", "localhost", "preview"],
      icon: Globe02Icon,
      shortcutId: "tab.newPreview",
      run: ctx.openNewPreview,
    },
    {
      id: "tab.close",
      title: "Close tab or pane",
      titleKey: "palette.cmd.closeTabOrPane",
      group: "Tabs",
      keywords: ["close", "remove", "pane"],
      icon: Cancel01Icon,
      shortcutId: "tab.close",
      disabledReason: closeDisabled,
      disabledReasonKey: closeDisabledKey,
      run: ctx.closeActiveTabOrPane,
    },
    {
      id: "pane.splitRight",
      title: "Split pane right",
      titleKey: "palette.cmd.splitPaneRight",
      group: "Panes",
      keywords: ["terminal", "pane", "split", "right", "column"],
      icon: LayoutTwoColumnIcon,
      shortcutId: "pane.splitRight",
      disabledReason: splitDisabled,
      disabledReasonKey: splitDisabledKey,
      run: ctx.splitPaneRight,
    },
    {
      id: "pane.splitDown",
      title: "Split pane down",
      titleKey: "palette.cmd.splitPaneDown",
      group: "Panes",
      keywords: ["terminal", "pane", "split", "down", "row"],
      icon: LayoutTwoRowIcon,
      shortcutId: "pane.splitDown",
      disabledReason: splitDisabled,
      disabledReasonKey: splitDisabledKey,
      run: ctx.splitPaneDown,
    },
    {
      id: "search.content",
      title: "Find content in files",
      titleKey: "palette.cmd.findContentInFiles",
      group: "Search",
      keywords: ["grep", "ripgrep", "text", "contents", "search in files"],
      icon: FileSearchIcon,
      trailing: "#",
      run: noop,
    },
    {
      id: "history.open",
      title: "Search command history",
      titleKey: "palette.cmd.searchCommandHistory",
      group: "Search",
      keywords: ["history", "shell", "rerun", "previous commands"],
      icon: TerminalIcon,
      trailing: ">",
      run: noop,
    },
    {
      id: "search.focus",
      title: "Find in current tab",
      titleKey: "palette.cmd.findInCurrentTab",
      group: "Search",
      keywords: ["find", "terminal", "editor", "current"],
      icon: Search01Icon,
      shortcutId: "search.focus",
      disabledReason: ctx.searchTarget ? undefined : "No searchable view",
      disabledReasonKey: ctx.searchTarget
        ? undefined
        : "palette.cmd.reason.noSearchableView",
      run: ctx.focusSearch,
    },
  ];
}
