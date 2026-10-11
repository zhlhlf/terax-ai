import { t as translate } from "@/lib/i18n";
import type { Tab } from "./useTabs";

/**
 * The label shown on a tab. Non-terminal tabs use their stored title; terminal
 * tabs prefer a user-set custom name, then fall back to the last segment of the
 * cwd. Keeping this pure makes the "custom name survives a cd" invariant
 * testable without rendering the bar.
 */
export function labelFor(t: Tab): string {
  if (t.kind === "editor") return t.title;
  if (t.kind === "preview") return t.title;
  if (t.kind === "markdown") return t.title;
  if (t.kind === "ai-diff") return aiDiffLabel(t.title);
  if (t.kind === "git-diff") return gitDiffLabel(t.title);
  if (t.kind === "git-history") return historyLabel(t.title);
  if (t.kind === "git-commit-file") return commitFileLabel(t.title);
  if (t.customTitle) return t.customTitle;
  if (!t.cwd) return t.title;
  const parts = t.cwd.split(/[\\/]/).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "/";
}

/** The stored history title is canonical English (`Git History`, or
 *  `History · <branch>`); map it to the active language for display. */
function historyLabel(title: string): string {
  if (title === "Git History") return translate("tab.title.gitHistory");
  if (title.startsWith("History · ")) {
    return translate("tab.title.history", { branch: title.slice(10) });
  }
  return title;
}

/** Git-diff titles are stored as `<name> (<mode>)`; localize the wrapper. */
function gitDiffLabel(title: string): string {
  const m = /^(.*) \(([+-])\)$/.exec(title);
  if (!m) return title;
  return translate("tab.title.gitDiff", { name: m[1], mode: m[2] });
}

/** Wrap the AI-diff `<name> (AI diff)` title in the active language. */
function aiDiffLabel(title: string): string {
  const suffix = " (AI diff)";
  if (!title.endsWith(suffix)) return title;
  return translate("tab.title.aiDiff", { name: title.slice(0, -suffix.length) });
}

/** Commit-file titles are stored as `<name> @ <sha>`; localize the wrapper. */
function commitFileLabel(title: string): string {
  const m = /^(.*) @ (.*)$/.exec(title);
  if (!m) return title;
  return translate("tab.title.commitFile", { name: m[1], sha: m[2] });
}
