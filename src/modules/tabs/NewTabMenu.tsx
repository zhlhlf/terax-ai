import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useT } from "@/lib/i18n";
import { fmtShortcut, MOD_KEY } from "@/lib/platform";
import {
  ComputerTerminal02Icon,
  Globe02Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type Props = {
  onNew: () => void;
  onNewPreview: () => void;
};

const MENU_HOST_SELECTOR =
  '[data-slot="dropdown-menu-content"], [data-slot="dropdown-menu-trigger"]';

export function NewTabMenu({
  onNew,
  onNewPreview,
}: Props) {
  const t = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const dismiss = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest(MENU_HOST_SELECTOR)) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("pointerdown", dismiss, {
      capture: true,
      passive: true,
    });
    return () => {
      document.removeEventListener("pointerdown", dismiss, { capture: true });
    };
  }, [open]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ml-1 size-6 shrink-0 rounded-full bg-foreground/[0.06] text-muted-foreground ring-1 ring-inset ring-foreground/[0.04] hover:bg-foreground/[0.12] hover:text-foreground"
          title={t("tab.new")}
        >
          <HugeiconsIcon icon={PlusSignIcon} size={14} strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        <DropdownMenuItem onSelect={onNew}>
          <HugeiconsIcon
            icon={ComputerTerminal02Icon}
            size={14}
            strokeWidth={1.75}
          />
          <span className="flex-1">{t("tab.newMenu.terminal")}</span>
          <span className="text-xs text-muted-foreground">
            {fmtShortcut(MOD_KEY, "T")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onNewPreview}>
          <HugeiconsIcon icon={Globe02Icon} size={14} strokeWidth={1.75} />
          <span className="flex-1">{t("tab.newMenu.preview")}</span>
          <span className="text-xs text-muted-foreground">
            {fmtShortcut(MOD_KEY, "P")}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
