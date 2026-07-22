"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/cn";

export function ScrollStatement({
  className,
  statement,
}: {
  className?: string;
  statement: string;
}) {
  const target = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 0.88", "end 0.42"],
  });
  const words = statement.split(" ");

  return (
    <p
      className={cn(
        "max-w-[18ch] font-serif text-[clamp(3.25rem,7.4vw,7.5rem)] leading-[0.92] tracking-[-0.05em]",
        className,
      )}
      ref={target}
    >
      {words.map((word, index) => (
        <ScrollWord
          end={(index + 1) / words.length}
          index={index}
          key={`${word}-${index}`}
          progress={scrollYProgress}
          start={index / words.length}
          word={word}
        />
      ))}
    </p>
  );
}

function ScrollWord({
  end,
  index,
  progress,
  start,
  word,
}: {
  end: number;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  word: string;
}) {
  const reduceMotion = useReducedMotion();
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <motion.span
      className={cn(
        "inline-block",
        (word.startsWith("answer") || word.startsWith("together")) &&
          "text-signal-400",
      )}
      style={reduceMotion ? { opacity: 1 } : { opacity }}
    >
      {word}
      {index >= 0 ? "\u00a0" : null}
    </motion.span>
  );
}
