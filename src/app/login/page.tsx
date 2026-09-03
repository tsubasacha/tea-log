import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-sm tracking-[0.2em] text-muted-foreground">
            TEA LOG
          </p>
          <h1 className="mt-2 text-2xl font-medium">お茶の記録帳</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            茶葉と抽出条件を記録し、味の変化を育てていく。
          </p>
        </div>
        <Suspense>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
