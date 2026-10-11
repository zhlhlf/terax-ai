import { detectMonoFontFamily } from "@/lib/fonts";
import { t, type TranslationKey } from "@/lib/i18n";
import { indentUnit } from "@codemirror/language";
import { lintGutter } from "@codemirror/lint";
import { search } from "@codemirror/search";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { chromeTheme } from "./chromeTheme";

// Compartments allow runtime reconfiguration without rebuilding state.
export const languageCompartment = new Compartment();
export const readOnlyCompartment = new Compartment();
export const wrapCompartment = new Compartment();
export const vimCompartment = new Compartment();
export const lspCompartment = new Compartment();
export const indentCompartment = new Compartment();

// CodeMirror resolves panel, announce and merge phrases through this facet.
// A Proxy keeps every lookup live against the active language, so an open
// panel or a fresh announcement never sticks to the language at mount.
const PHRASE_KEYS: Record<string, TranslationKey> = {
  Find: "editor.search.find",
  Replace: "editor.search.replace",
  next: "editor.search.next",
  previous: "editor.search.previous",
  all: "editor.search.selectAll",
  "match case": "editor.search.matchCase",
  regexp: "editor.search.regexp",
  "by word": "editor.search.byWord",
  replace: "editor.search.replaceButton",
  "replace all": "editor.search.replaceAll",
  close: "editor.search.close",
  "Go to line": "editor.gotoLine.label",
  go: "editor.gotoLine.go",
  "current match": "editor.search.currentMatch",
  "on line": "editor.search.onLine",
  "replaced $ matches": "editor.search.replacedMatches",
  "replaced match on line $": "editor.search.replacedMatchOnLine",
  Completions: "editor.cm.completions",
  "Control character": "editor.cm.controlCharacter",
  Diagnostics: "editor.cm.diagnostics",
  "No diagnostics": "editor.cm.noDiagnostics",
  "folded code": "editor.cm.foldedCode",
  unfold: "editor.cm.unfold",
  "Folded lines": "editor.cm.foldedLines",
  "Unfolded lines": "editor.cm.unfoldedLines",
  to: "editor.cm.to",
  "Selection deleted": "editor.cm.selectionDeleted",
  "Accept": "editor.merge.accept",
  "Reject": "editor.merge.reject",
  "Revert this chunk": "editor.merge.revertChunk",
  "$ unchanged lines": "editor.merge.unchangedLines",
};

const LIVE_PHRASES = new Proxy(Object.create(null) as Record<string, string>, {
  get: (_target, prop) =>
    typeof prop === "string" && prop in PHRASE_KEYS
      ? t(PHRASE_KEYS[prop])
      : undefined,
  getOwnPropertyDescriptor: (_target, prop) =>
    typeof prop === "string" && prop in PHRASE_KEYS
      ? { enumerable: true, configurable: true, value: t(PHRASE_KEYS[prop]) }
      : undefined,
  ownKeys: () => Object.keys(PHRASE_KEYS),
});

const PHRASES_EXT: readonly Extension[] = Object.freeze([
  EditorState.phrases.of(LIVE_PHRASES),
]);

export function indentExtension(unit: string): Extension {
  return [
    indentUnit.of(unit),
    EditorState.tabSize.of(unit === "\t" ? 4 : unit.length),
  ];
}

export const DEFAULT_INDENT: Extension = indentExtension("  ");

const WORD_WRAP_COLUMN_VAR = "--terax-editor-wrap-column";
const WORD_WRAP_COLUMN_THEME = EditorView.theme({
  ".cm-content.cm-lineWrapping": {
    maxWidth: `var(${WORD_WRAP_COLUMN_VAR})`,
    marginLeft: "6px",
    marginRight: "2px",
  },
  ".cm-content.cm-lineWrapping .cm-line": {
    paddingLeft: "0",
    paddingRight: "0",
  },
});

export function wordWrapExtension(column: number | null): Extension {
  if (column === null) return [];
  return [
    EditorView.lineWrapping,
    WORD_WRAP_COLUMN_THEME,
    EditorView.contentAttributes.of({
      style: `${WORD_WRAP_COLUMN_VAR}: ${column}ch`,
    }),
  ];
}

// Only what basicSetup doesn't already cover, to avoid duplicate extensions.
// basicSetup gives us line numbers, fold gutter, history, indentOnInput,
// bracketMatching, closeBrackets, autocompletion, highlightActiveLine,
// highlightSelectionMatches and the search keymap.
// Singleton: per-pane instances would inject duplicate style modules.
const SHARED_EXTENSIONS: readonly Extension[] = Object.freeze([
  search({ top: true }),
  lintGutter(),
  chromeTheme(),
  ...PHRASES_EXT,
  EditorView.theme({
    "&, &.cm-editor, &.cm-editor.cm-focused": {
      backgroundColor: "transparent !important",
      color: "var(--foreground)",
      outline: "none",
      padding: "8px",
    },
    ".cm-scroller": {
      fontFamily: detectMonoFontFamily(),
      fontSize: "calc(var(--editor-font-size, 13px) * var(--app-zoom, 1))",
      lineHeight: "1.55",
      backgroundColor: "transparent !important",
    },
    ".cm-content": {
      caretColor: "var(--foreground)",
      backgroundColor: "transparent !important",
    },
    ".cm-gutters": {
      backgroundColor: "transparent !important",
      color: "var(--muted-foreground)",
    },
    ".cm-gutter-lint": {
      width: "0px",
    },
    ".cm-gutter": { backgroundColor: "transparent !important" },
    ".cm-lineNumbers .cm-gutterElement": {
      opacity: "0.55",
    },
    ".cm-foldGutter": { width: "10px" },
    ".cm-foldGutter .cm-gutterElement": {
      color: "var(--muted-foreground)",
      opacity: "0.5",
    },
    ".cm-activeLine": {
      borderTopRightRadius: "5px",
      borderBottomRightRadius: "5px",
      backgroundColor: "color-mix(in srgb, var(--foreground) 4%, transparent)",
    },
    ".cm-lineNumbers .cm-activeLineGutter": {
      borderTopLeftRadius: "5px",
      borderBottomLeftRadius: "5px",
      userSelect: "none",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "var(--foreground)",
    },
    // Vim normal-mode block cursor — translucent foreground, no rose hue.
    ".cm-fat-cursor": {
      background:
        "color-mix(in srgb, var(--foreground) 35%, transparent) !important",
      outline:
        "1px solid color-mix(in srgb, var(--foreground) 55%, transparent) !important",
      color: "var(--foreground) !important",
      borderRadius: "2px",
    },
    "&:not(.cm-focused) .cm-fat-cursor": {
      background: "transparent !important",
      outline:
        "1px solid color-mix(in srgb, var(--foreground) 35%, transparent) !important",
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection":
      {
        backgroundColor:
          "color-mix(in srgb, var(--foreground) 18%, transparent) !important",
      },
    ".cm-panels": {
      backgroundColor: "var(--popover)",
      color: "var(--popover-foreground)",
      borderColor: "var(--border)",
    },
  }),
]);

export function buildSharedExtensions(): readonly Extension[] {
  return SHARED_EXTENSIONS;
}
