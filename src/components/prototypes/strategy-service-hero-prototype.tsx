"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const StrategyServiceHeroScene = dynamic(
  () =>
    import("@/components/prototypes/strategy-service-hero-scene").then(
      (module) => module.StrategyServiceHeroScene,
    ),
  { ssr: false },
);

export function StrategyServiceHeroPrototype({
  posterSrc,
}: {
  posterSrc: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    );
    const updateMotionPreference = () =>
      setCanAnimate(motionPreference.matches);

    updateMotionPreference();
    motionPreference.addEventListener("change", updateMotionPreference);

    return () =>
      motionPreference.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !canAnimate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [canAnimate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !canAnimate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting && entry.intersectionRatio > 0.08);
      },
      { threshold: [0, 0.08, 0.5] },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [canAnimate]);

  const animationState = !canAnimate
    ? "poster"
    : isNearViewport
      ? isInViewport
        ? "playing"
        : "paused"
      : "loading";

  return (
    <div
      aria-hidden="true"
      className="relative isolate aspect-square overflow-hidden border border-white/15 bg-ink-900"
      data-animation-state={animationState}
      data-renderer="code-based-2.5d"
      data-testid="strategy-service-hero-prototype"
      ref={containerRef}
    >
      <Image
        alt=""
        className="object-cover object-center opacity-72 saturate-[0.72]"
        data-testid="strategy-service-hero-poster"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 38vw"
        src={posterSrc}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(145deg,rgba(9,11,16,0.08),rgba(9,11,16,0.74))]" />
      {canAnimate && isNearViewport ? (
        <StrategyServiceHeroScene active={isInViewport} />
      ) : null}
      <div className="pointer-events-none absolute inset-4 border border-white/14" />
      <span className="pointer-events-none absolute top-4 left-4 size-2 border-t border-l border-signal-400" />
      <span className="pointer-events-none absolute right-4 bottom-4 size-2 border-r border-b border-signal-400" />
    </div>
  );
}
