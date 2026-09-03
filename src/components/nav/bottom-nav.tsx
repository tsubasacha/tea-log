"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Leaf, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tea", label: "Tea", icon: Leaf },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="主要なナビゲーション"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <NavLink
          href={NAV_ITEMS[0].href}
          label={NAV_ITEMS[0].label}
          icon={NAV_ITEMS[0].icon}
          active={pathname === "/"}
        />

        <Link
          href="/brew/new"
          aria-label="お茶を記録する"
          className="-mt-6 flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform active:scale-95"
        >
          <Plus className="size-6" />
        </Link>

        <NavLink
          href={NAV_ITEMS[1].href}
          label={NAV_ITEMS[1].label}
          icon={NAV_ITEMS[1].icon}
          active={pathname.startsWith("/tea")}
        />
      </div>
    </nav>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center gap-1 rounded-md px-4 py-1.5 text-xs transition-colors",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-5" />
      <span>{label}</span>
    </Link>
  );
}
