"use client";

import { useEffect, useState } from "react";

import { ArrowUpIcon } from "@/components/ui/icons";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.75);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      aria-hidden={!visible}
      aria-label="Scroll to top"
      className={`group fixed right-[max(0.75rem,calc(env(safe-area-inset-right)+0.5rem))] bottom-[max(0.75rem,calc(env(safe-area-inset-bottom)+0.5rem))] z-[70] grid size-11 place-items-center rounded-full border border-[var(--colour-border-inverse)] bg-[var(--colour-surface-inverse)] text-[var(--colour-text-inverse)] shadow-lift transition-[opacity,transform,background-color,color] duration-200 hover:bg-[var(--colour-action)] hover:text-[var(--colour-action-text)] md:right-7 md:bottom-7 md:size-12 ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-2 scale-90 opacity-0"
      }`}
      onClick={() =>
        window.scrollTo({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          top: 0,
        })
      }
      tabIndex={visible ? 0 : -1}
      type="button"
    >
      <ArrowUpIcon className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
    </button>
  );
}
