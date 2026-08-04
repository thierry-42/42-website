"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
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
const posterSource =
  "/animations/strategy-architecture/strategy-architecture-poster.svg";

export function StrategyArchitectureAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
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
      "(prefers-reduced-motion: reduce)",
    );

    const updateMotionPreference = () => {
      setCanAnimate(!motionPreference.matches);
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
      player?.addEventListener("load", handlePlayerLoad);
    },
    [handlePlayerLoad],
  );

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !isPlayerReady) return;

    if (canAnimate && isInViewport) {
      player.play();
      return;
    }

    player.pause();
  }, [canAnimate, isInViewport, isPlayerReady]);

  const animationState = isPlayerReady
    ? "loaded"
    : shouldRenderPlayer
      ? "loading"
      : "poster";
  const playbackState = !shouldRenderPlayer
    ? "poster"
    : !isPlayerReady
      ? "loading"
      : isInViewport
        ? "playing"
        : "paused";

  return (
    <div
      aria-hidden="true"
      className="relative isolate aspect-[16/10] overflow-hidden border-b border-white/12 bg-[#090b10]"
      data-animation-state={animationState}
      data-playback-state={playbackState}
      data-testid="strategy-architecture-animation"
      ref={containerRef}
    >
      <Image
        alt=""
        className="object-cover"
        data-testid="strategy-architecture-poster"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        src={posterSource}
      />
      {shouldRenderPlayer ? (
        <DotLottiePlayer
          aria-hidden="true"
          autoplay={false}
          className="pointer-events-none absolute inset-0 size-full"
          data-testid="strategy-architecture-player"
          dotLottieRefCallback={handlePlayerRef}
          layout={{ align: [0.5, 0.5], fit: "cover" }}
          loop
          renderConfig={{ autoResize: true, devicePixelRatio: pixelRatio }}
          role="presentation"
          src={animationSource}
          tabIndex={-1}
          useFrameInterpolation={false}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-signal-400/70" />
    </div>
  );
}
