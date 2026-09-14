import { cn } from "@/lib/utils";

export function EventSparkLogo({
  className,
  size = "md",
  wordmark = true,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  wordmark?: boolean;
}) {
  const glyphSize =
    size === "sm" ? "w-7 h-7" : size === "lg" ? "w-12 h-12" : "w-9 h-9";
  const textSize =
    size === "sm" ? "text-[17px]" : size === "lg" ? "text-[30px]" : "text-[22px]";

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      <img
        src="/images/logo-glyph-3YxcYhaR.png"
        alt=""
        className={cn(glyphSize, "object-contain")}
        aria-hidden="true"
      />
      {wordmark && (
        <span
          className={cn(
            "font-display font-bold text-primary tracking-tight",
            textSize
          )}
          style={{ fontWeight: 700 }}
        >
          eventspark
        </span>
      )}
    </span>
  );
}
