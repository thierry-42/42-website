"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";

const interactiveSelector =
  "a, button, summary, [role='button'], [data-cursor-interactive]";
const nativeCursorSelector =
  "input, textarea, select, [contenteditable='true']";

export function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const ringX = useSpring(pointerX, { damping: 26, stiffness: 260 });
  const ringY = useSpring(pointerY, { damping: 26, stiffness: 260 });
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");

    const updateEnabled = () => {
      const next = finePointer.matches && !reduceMotion;
      setEnabled(next);
      document.documentElement.classList.toggle("cursor-enhanced", next);
    };

    const handleMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      setHidden(false);
      const target = event.target as Element | null;
      setActive(Boolean(target?.closest(interactiveSelector)));
      if (target?.closest(nativeCursorSelector)) setHidden(true);
    };

    const handleLeave = () => setHidden(true);

    updateEnabled();
    finePointer.addEventListener("change", updateEnabled);
    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      document.documentElement.classList.remove("cursor-enhanced");
      finePointer.removeEventListener("change", updateEnabled);
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, [pointerX, pointerY, reduceMotion]);

  if (!enabled) return null;

  return (
    <>
      <motion.span
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[120] size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white mix-blend-difference"
        style={{
          opacity: hidden ? 0 : 1,
          scale: active ? 1.55 : 1,
          x: ringX,
          y: ringY,
        }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[121] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
        style={{
          opacity: hidden ? 0 : 1,
          scale: active ? 0.65 : 1,
          x: pointerX,
          y: pointerY,
        }}
      />
    </>
  );
}
