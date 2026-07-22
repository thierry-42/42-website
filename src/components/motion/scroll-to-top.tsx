"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import { ArrowUpIcon } from "@/components/ui/icons";

export function ScrollToTop() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.75);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.button
          animate={{ opacity: 1, scale: 1, y: 0 }}
          aria-label="Scroll to top"
          className="group fixed right-5 bottom-5 z-[70] grid size-12 place-items-center rounded-full border border-white/16 bg-ink-950 text-paper-50 shadow-lift transition-colors hover:bg-signal-400 hover:text-ink-950 md:right-7 md:bottom-7"
          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.9, y: 8 }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 8 }}
          onClick={() =>
            window.scrollTo({
              behavior: reduceMotion ? "auto" : "smooth",
              top: 0,
            })
          }
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          type="button"
        >
          <ArrowUpIcon className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
