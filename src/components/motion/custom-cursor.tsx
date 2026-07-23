"use client";

import { useEffect, useRef } from "react";

const interactiveSelector =
  "a, button, summary, [role='button'], [data-cursor-interactive]";
const nativeCursorSelector =
  "iframe, [data-native-cursor], input, textarea, select, [contenteditable='true']";
const cursorColorSelector = "[data-cursor-color]";

export function CustomCursor() {
  const ringRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let animationFrame = 0;
    let enabled = false;
    let visible = false;
    let interactive = false;
    let pointerX = -100;
    let pointerY = -100;
    let ringX = -100;
    let ringY = -100;
    let cursorColor: "dark" | "light" = "dark";

    const setVisible = (next: boolean) => {
      if (visible === next) return;
      visible = next;
      const opacity = next ? "1" : "0";
      ring.style.opacity = opacity;
      dot.style.opacity = opacity;
    };

    const setInteractive = (next: boolean) => {
      if (interactive === next) return;
      interactive = next;
      ring.dataset.active = String(next);
      dot.dataset.active = String(next);
    };

    const setCursorColor = (next: "dark" | "light") => {
      if (cursorColor === next) return;
      cursorColor = next;
      document.documentElement.dataset.cursorColor = next;
    };

    const renderRing = () => {
      ringX += (pointerX - ringX) * 0.32;
      ringY += (pointerY - ringY) * 0.32;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      animationFrame = window.requestAnimationFrame(renderRing);
    };

    const enable = () => {
      if (enabled) return;
      enabled = true;
      document.documentElement.dataset.customCursor = "active";
      document.documentElement.dataset.cursorColor = cursorColor;
      animationFrame = window.requestAnimationFrame(renderRing);
    };

    const disable = () => {
      if (!enabled) return;
      enabled = false;
      window.cancelAnimationFrame(animationFrame);
      document.documentElement.removeAttribute("data-custom-cursor");
      document.documentElement.removeAttribute("data-cursor-color");
      setVisible(false);
      setInteractive(false);
      ring.style.transform =
        "translate3d(-100px, -100px, 0) translate(-50%, -50%)";
      dot.style.transform =
        "translate3d(-100px, -100px, 0) translate(-50%, -50%)";
    };

    const updateEnabled = () => {
      if (finePointer.matches && !reducedMotion.matches) enable();
      else disable();
    };

    const handleMove = (event: PointerEvent) => {
      if (!enabled) return;

      pointerX = event.clientX;
      pointerY = event.clientY;
      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`;

      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(nativeCursorSelector)) {
        setVisible(false);
        setInteractive(false);
        return;
      }

      const declaredColor = target
        ?.closest(cursorColorSelector)
        ?.getAttribute("data-cursor-color");
      setCursorColor(declaredColor === "light" ? "light" : "dark");
      setInteractive(Boolean(target?.closest(interactiveSelector)));
      setVisible(true);
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (!enabled) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(nativeCursorSelector)) setVisible(false);
    };

    const handleLeave = () => setVisible(false);

    updateEnabled();
    finePointer.addEventListener("change", updateEnabled);
    reducedMotion.addEventListener("change", updateEnabled);
    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      disable();
      finePointer.removeEventListener("change", updateEnabled);
      reducedMotion.removeEventListener("change", updateEnabled);
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <>
      <span
        aria-hidden="true"
        className="group pointer-events-none fixed top-0 left-0 z-[120] opacity-0 will-change-transform"
        data-active="false"
        data-testid="custom-cursor-ring"
        ref={ringRef}
      >
        <span className="custom-cursor-ring block size-9 rounded-full border transition-[border-color,transform] duration-[120ms] group-data-[active=true]:scale-150" />
      </span>
      <span
        aria-hidden="true"
        className="group pointer-events-none fixed top-0 left-0 z-[121] opacity-0 will-change-transform"
        data-active="false"
        data-testid="custom-cursor-dot"
        ref={dotRef}
      >
        <span className="custom-cursor-dot block size-1.5 rounded-full transition-[background-color,transform] duration-[120ms] group-data-[active=true]:scale-75" />
      </span>
    </>
  );
}
