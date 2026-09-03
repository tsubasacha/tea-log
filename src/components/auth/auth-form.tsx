"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";

import { signInWithPassword, signUpWithPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [tab, setTab] = useState<"login" | "signup">("login");

  const [loginState, loginAction, loginPending] = useActionState(
    signInWithPassword,
    {},
  );
  const [signupState, signupAction, signupPending] = useActionState(
    signUpWithPassword,
    {},
  );

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as "login" | "signup")}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">ログイン</TabsTrigger>
        <TabsTrigger value="signup">新規登録</TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="mt-6">
        <form action={loginAction} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <Field id="login-email" name="email" label="メールアドレス" type="email" />
          <Field
            id="login-password"
            name="password"
            label="パスワード"
            type="password"
          />
          {loginState.error && (
            <p className="text-sm text-destructive">{loginState.error}</p>
          )}
          <Button type="submit" size="lg" disabled={loginPending}>
            {loginPending ? "ログイン中..." : "ログイン"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="signup" className="mt-6">
        <form action={signupAction} className="flex flex-col gap-4">
          <Field
            id="signup-email"
            name="email"
            label="メールアドレス"
            type="email"
          />
          <Field
            id="signup-password"
            name="password"
            label="パスワード（6文字以上）"
            type="password"
          />
          {signupState.error && (
            <p className="text-sm text-destructive">{signupState.error}</p>
          )}
          {signupState.info && (
            <p className="text-sm text-primary">{signupState.info}</p>
          )}
          <Button type="submit" size="lg" disabled={signupPending}>
            {signupPending ? "登録中..." : "アカウントを作成"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}

function Field({
  id,
  name,
  label,
  type,
}: {
  id: string;
  name: string;
  label: string;
  type: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={name} type={type} required autoComplete={type} />
    </div>
  );
}
