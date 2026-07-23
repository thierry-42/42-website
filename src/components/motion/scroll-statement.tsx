"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/cn";

function ScrollWord({
  index,
  progress,
  total,
  word,
}: {
  index: number;
  progress: MotionValue<number>;
  total: number;
  word: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const opacity = useTransform(
    progress,
    [0.08 + (index / total) * 0.48, 0.42 + ((index + 1) / total) * 0.48],
    [0.55, 1],
  );

  return (
    <motion.span
      className={cn(
        "scroll-statement-word inline-block",
        (word.startsWith("answer") || word.startsWith("together")) &&
          "text-signal-400",
      )}
      style={shouldReduceMotion ? { opacity: 1 } : { opacity }}
    >
      {word}
      {"\u00a0"}
    </motion.span>
  );
}

export function ScrollStatement({
  className,
  statement,
}: {
  className?: string;
  statement: string;
}) {
  const statementRef = useRef<HTMLParagraphElement>(null);
  const words = statement.split(" ");
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: statementRef,
  });

  return (
    <p
      className={cn(
        "scroll-statement max-w-[18ch] font-serif text-[clamp(3.25rem,7.4vw,7.5rem)] leading-[0.92] tracking-[-0.05em]",
        className,
      )}
      ref={statementRef}
    >
      {words.map((word, index) => (
        <ScrollWord
          index={index}
          key={`${word}-${index}`}
          progress={scrollYProgress}
          total={words.length}
          word={word}
        />
      ))}
    </p>
  );
}
