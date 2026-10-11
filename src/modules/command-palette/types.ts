import type { TranslationKey } from "@/lib/i18n";
import type { ShortcutId } from "@/modules/shortcuts";
import type { TerminalIcon } from "@hugeicons/core-free-icons";

export type PaletteIcon = typeof TerminalIcon;

export type PaletteItem = {
  id: string;
  /** Canonical English title; used for fuzzy matching and as a fallback. */
  title: string;
  /** i18n key for the displayed title. */
  titleKey?: TranslationKey;
  /** Interpolation params for `titleKey`. */
  titleParams?: Record<string, string>;
  group: string;
  keywords?: string[];
  icon?: PaletteIcon;
  iconUrl?: string;
  shortcutId?: ShortcutId;
  trailing?: string;
  disabledReason?: string;
  disabledReasonKey?: TranslationKey;
  run: () => void;
};

export type PaletteMode = "commands" | "history" | "content" | "help";
