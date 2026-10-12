import type { ReactNode } from "react";

export function MarkdownCode({
  className,
  children,
  ...rest
}: {
  className?: string;
  children?: ReactNode;
}) {
  const isBlock = className?.includes("language-");
  if (!isBlock) {
    return (
      <code
        className="rounded bg-muted/70 px-1.5 py-0.5 font-mono text-[0.875em] text-foreground"
        {...rest}
      >
        {children}
      </code>
    );
  }
  return (
    <code
      className="block overflow-x-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-[0.85em] text-foreground"
      {...rest}
    >
      {children}
    </code>
  );
}
