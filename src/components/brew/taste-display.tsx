import { cn } from "@/lib/utils";

export function TasteDisplay({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <span
            key={level}
            className={cn(
              "size-2.5 rounded-full",
              level <= value ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
}
