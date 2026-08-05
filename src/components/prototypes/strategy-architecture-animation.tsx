"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

import type { DotLottie } from "@lottiefiles/dotlottie-react";

const wasmSource = "/animations/runtime/dotlottie-player.wasm";

const DotLottiePlayer = dynamic(
  async () => {
    const { DotLottieReact, setWasmUrl } =
      await import("@lottiefiles/dotlottie-react");
    setWasmUrl(wasmSource);
    return DotLottieReact;
  },
  { ssr: false },
);

const animationSource =
  "/animations/strategy-architecture/strategy-architecture.lottie";

export function StrategyArchitectureAnimation({ active }: { active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef<DotLottie | null>(null);
  const pixelRatio =
    typeof window === "undefined"
      ? 1
      : Math.min(window.devicePixelRatio || 1, 1.5);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
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
    const container = containerRef.current;
    if (!container || !canAnimate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [canAnimate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !canAnimate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting && entry.intersectionRatio > 0.1);
      },
      { threshold: [0, 0.1, 0.5] },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [canAnimate]);

  const shouldRenderPlayer = canAnimate && isNearViewport;
  const handlePlayerLoad = useCallback(() => setIsPlayerReady(true), []);
  const handlePlayerRef = useCallback(
    (player: DotLottie | null) => {
      playerRef.current?.removeEventListener("load", handlePlayerLoad);
      playerRef.current = player;
      setIsPlayerReady(Boolean(player?.isLoaded));
      player?.setSpeed(1.8);
      player?.addEventListener("load", handlePlayerLoad);
    },
    [handlePlayerLoad],
  );

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isPlayerReady) return;

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    if (active && canAnimate && isInViewport) {
      player.stop();
      player.setSpeed(1.8);
      player.play();
      return;
    }

    resetTimerRef.current = setTimeout(() => {
      player.stop();
      resetTimerRef.current = null;
    }, 320);

    return () => {
      if (!resetTimerRef.current) return;
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    };
  }, [active, canAnimate, isInViewport, isPlayerReady]);

  const animationState = isPlayerReady
    ? "loaded"
    : shouldRenderPlayer
      ? "loading"
      : "static";
  const playbackState = !shouldRenderPlayer
    ? "static"
    : !isPlayerReady
      ? "loading"
      : active && isInViewport
        ? "playing"
        : "idle";
  const isVisualVisible = active && canAnimate && isInViewport && isPlayerReady;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 isolate overflow-hidden"
      data-animation-state={animationState}
      data-playback-state={playbackState}
      data-testid="strategy-architecture-animation"
      ref={containerRef}
    >
      {shouldRenderPlayer ? (
        <DotLottiePlayer
          aria-hidden="true"
          autoplay={false}
          className={`pointer-events-none absolute inset-0 size-full transition-opacity duration-300 ease-out ${
            isVisualVisible ? "opacity-100" : "opacity-0"
          }`}
          data-testid="strategy-architecture-player"
          dotLottieRefCallback={handlePlayerRef}
          layout={{ align: [0.5, 0.5], fit: "cover" }}
          loop={false}
          renderConfig={{ autoResize: true, devicePixelRatio: pixelRatio }}
          role="presentation"
          src={animationSource}
          tabIndex={-1}
          useFrameInterpolation={false}
        />
      ) : null}
    </div>
  );
}
