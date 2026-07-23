import type { CSSProperties } from "react";

import { cn } from "@/lib/cn";

export function ScrollStatement({
  className,
  statement,
}: {
  className?: string;
  statement: string;
}) {
  const words = statement.split(" ");

  return (
    <p
      className={cn(
        "max-w-[18ch] font-serif text-[clamp(3.25rem,7.4vw,7.5rem)] leading-[0.92] tracking-[-0.05em]",
        className,
      )}
    >
      {words.map((word, index) => (
        <span
          className={cn(
            "scroll-statement-word inline-block",
            (word.startsWith("answer") || word.startsWith("together")) &&
              "text-signal-400",
          )}
          key={`${word}-${index}`}
          style={
            {
              "--word-end": `${42 + ((index + 1) / words.length) * 48}%`,
              "--word-start": `${8 + (index / words.length) * 48}%`,
            } as CSSProperties
          }
        >
          {word}
          {"\u00a0"}
        </span>
      ))}
    </p>
  );
}
