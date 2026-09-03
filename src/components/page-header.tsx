import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  backHref,
  action,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      {backHref ? (
        <Link
          href={backHref}
          aria-label="戻る"
          className="-ml-2 flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
        >
          <ChevronLeft className="size-5" />
        </Link>
      ) : null}
      <h1 className="flex-1 truncate text-lg font-medium tracking-tight">
        {title}
      </h1>
      {action}
    </header>
  );
}
