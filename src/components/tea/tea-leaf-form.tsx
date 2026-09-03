"use client";

import { useActionState } from "react";

import { createTeaLeaf } from "@/lib/actions/tea-leaves";
import { TEA_TYPE_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TeaLeafForm() {
  const [state, formAction, pending] = useActionState(createTeaLeaf, {});

  return (
    <form action={formAction} className="flex flex-col gap-5 px-5 py-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">茶葉名</Label>
        <Input id="name" name="name" placeholder="例）TOKINE ほうじ茶" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tea_type">茶種</Label>
        <Select name="tea_type" required>
          <SelectTrigger id="tea_type">
            <SelectValue placeholder="選択してください" />
          </SelectTrigger>
          <SelectContent>
            {TEA_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="producer">生産者 / ブランド</Label>
        <Input id="producer" name="producer" placeholder="例）TOKINE" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="origin">産地</Label>
        <Input id="origin" name="origin" placeholder="例）静岡県 掛川" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="memo">メモ</Label>
        <Textarea id="memo" name="memo" rows={3} placeholder="気になる特徴など" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending} className="mt-2">
        {pending ? "登録中..." : "登録する"}
      </Button>
    </form>
  );
}
