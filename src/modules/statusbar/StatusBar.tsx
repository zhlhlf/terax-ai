import { LspStatusPill } from "@/modules/lsp";
import { DiagnosticsBadge } from "./DiagnosticsBadge";

type Props = {
  filePath?: string | null;
};

export function StatusBar({ filePath }: Props) {
  return (
    // Shrinks to a sliver when both pills opt out (terminals, or an editor
    // with no language server and no diagnostics), handing the rest of the
    // space back to the pane above.
    <footer className="flex h-8 shrink-0 items-center justify-between gap-3 pl-3 pr-4 text-[11px] has-[>div:empty]:h-2">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <LspStatusPill filePath={filePath ?? null} />
        <DiagnosticsBadge filePath={filePath ?? null} />
      </div>
    </footer>
  );
}
