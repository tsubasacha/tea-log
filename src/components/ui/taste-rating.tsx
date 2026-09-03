"use client";

import { cn } from "@/lib/utils";

interface TasteRatingProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  id?: string;
}

const LEVELS = [1, 2, 3, 4, 5];

export function TasteRating({ label, value, onChange, id }: TasteRatingProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span id={id} className="text-sm text-foreground">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={id}
        className="flex items-center gap-2"
      >
        {LEVELS.map((level) => {
          const active = level <= value;
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={value === level}
              aria-label={`${label} ${level}`}
              onClick={() => onChange(level)}
              className={cn(
                "flex size-8 items-center justify-center rounded-full border transition-colors",
                active
                  ? "border-primary bg-primary"
                  : "border-border bg-transparent",
              )}
            >
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  active ? "bg-primary-foreground" : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
