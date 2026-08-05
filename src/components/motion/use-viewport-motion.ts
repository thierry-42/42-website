"use client";

import { useEffect, useState, type RefObject } from "react";

type ViewportMotionOptions = {
  rootMargin?: string;
  threshold?: number;
};

export function useViewportMotion(
  targetRef: RefObject<Element | null>,
  { rootMargin = "120px 0px", threshold = 0.08 }: ViewportMotionOptions = {},
) {
  const [canAnimate, setCanAnimate] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    );

    const updateMotionPreference = () => {
      setCanAnimate(motionPreference.matches);
    };

    updateMotionPreference();
    motionPreference.addEventListener("change", updateMotionPreference);

    return () => {
      motionPreference.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || !canAnimate) {
      setIsInViewport(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(
          entry.isIntersecting && entry.intersectionRatio >= threshold,
        );
      },
      { rootMargin, threshold: [0, threshold, 0.5] },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [canAnimate, rootMargin, targetRef, threshold]);

  return { canAnimate, isInViewport };
}
