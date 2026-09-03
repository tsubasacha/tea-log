"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  decimals?: number;
  className?: string;
  inputId?: string;
}

export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 999,
  unit,
  decimals = 0,
  className,
  inputId,
}: StepperProps) {
  const clamp = React.useCallback(
    (v: number) => Math.min(max, Math.max(min, v)),
    [min, max],
  );

  const round = React.useCallback(
    (v: number) => Number(v.toFixed(decimals)),
    [decimals],
  );

  const handleStep = (direction: 1 | -1) => {
    const next = round(clamp(value + direction * step));
    onChange(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange(0);
      return;
    }
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    onChange(round(clamp(value)));
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-card p-1.5",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => handleStep(-1)}
        aria-label="値を減らす"
        className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-foreground transition-colors active:bg-accent active:text-accent-foreground disabled:opacity-40"
        disabled={value <= min}
      >
        <Minus className="size-4" />
      </button>

      <div className="flex flex-1 items-baseline justify-center gap-1">
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="w-full min-w-0 bg-transparent text-center text-2xl font-medium tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {unit && (
          <span className="shrink-0 text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => handleStep(1)}
        aria-label="値を増やす"
        className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted text-foreground transition-colors active:bg-accent active:text-accent-foreground disabled:opacity-40"
        disabled={value >= max}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
