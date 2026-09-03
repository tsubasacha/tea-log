import { LogOut } from "lucide-react";

import { signOut } from "@/lib/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        aria-label="ログアウト"
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors active:bg-muted"
      >
        <LogOut className="size-4" />
      </button>
    </form>
  );
}
