import {
  AccentDisc,
  AcrylicPanel,
  ArchitecturalModule,
  SignalPath,
  SystemNode,
  TechnicalGrid,
} from "@/components/motion/system-motion-primitives";
import { ViewportMotion } from "@/components/motion/viewport-motion";

export function HomeHeroMotionPrototype() {
  return (
    <ViewportMotion
      className="home-hero-motion relative isolate min-h-[22rem] overflow-hidden rounded-xl border border-ink-950/18 bg-[var(--colour-surface)] shadow-[0_1.75rem_6rem_rgb(9_11_16/0.12)] sm:min-h-[36rem]"
      rootMargin="160px 0px"
      testId="home-hero-motion-prototype"
      threshold={0.08}
    >
      <svg
        className="absolute inset-0 size-full"
        focusable="false"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
        viewBox="0 0 720 620"
      >
        <defs>
          <linearGradient
            id="hero-drafting-surface"
            x1="0"
            x2="1"
            y1="0"
            y2="1"
          >
            <stop offset="0" stopColor="var(--colour-surface)" />
            <stop offset="0.58" stopColor="var(--colour-canvas)" />
            <stop offset="1" stopColor="var(--colour-surface-subtle)" />
          </linearGradient>
          <linearGradient id="hero-dark-plane" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="var(--colour-surface-inverse-raised)" />
            <stop offset="1" stopColor="var(--colour-surface-inverse)" />
          </linearGradient>
          <filter
            id="hero-soft-shadow"
            height="180%"
            width="180%"
            x="-40%"
            y="-40%"
          >
            <feDropShadow
              dx="0"
              dy="16"
              floodColor="#090b10"
              floodOpacity="0.18"
              stdDeviation="14"
            />
          </filter>
        </defs>

        <rect fill="url(#hero-drafting-surface)" height="620" width="720" />
        <TechnicalGrid patternId="home-hero-grid" />

        <g className="home-hero-motion__construction">
          <path d="M42 82h80M82 42v80M598 532h80M638 492v80" />
          <circle cx="82" cy="82" r="24" />
          <circle cx="638" cy="532" r="24" />
        </g>

        <g className="home-hero-motion__acrylic home-hero-motion__acrylic--rear">
          <AcrylicPanel points="420,82 650,128 598,296 374,246" />
        </g>
        <g className="home-hero-motion__acrylic home-hero-motion__acrylic--front motion-mobile-hidden">
          <AcrylicPanel points="68,350 286,300 342,492 126,546" />
        </g>

        <path
          className="home-hero-motion__dark-plane"
          d="m168 130 284 52 116 248-290 72-158-208Z"
        />

        <g className="home-hero-motion__paths">
          <SignalPath d="M154 226C248 208 284 280 354 305S494 302 594 216" />
          <SignalPath
            d="M126 438C236 456 262 382 354 344S494 392 610 420"
            delay={120}
          />
          <SignalPath
            className="motion-mobile-hidden"
            d="M352 92V524"
            delay={240}
          />
        </g>

        <g
          className="home-hero-motion__modules"
          filter="url(#hero-soft-shadow)"
        >
          <ArchitecturalModule
            className="home-hero-module home-hero-module--one"
            transform="translate(118 182)"
          />
          <ArchitecturalModule
            className="home-hero-module home-hero-module--two"
            delay={110}
            transform="translate(522 140) scale(.82)"
          />
          <ArchitecturalModule
            className="home-hero-module home-hero-module--three motion-mobile-hidden"
            delay={220}
            transform="translate(558 412) scale(.92)"
          />
        </g>

        <g className="home-hero-motion__nodes">
          <SystemNode
            className="home-hero-node home-hero-node--one"
            delay={80}
            transform="translate(90 382)"
          />
          <SystemNode
            className="home-hero-node home-hero-node--two"
            delay={160}
            transform="translate(494 250)"
          />
          <SystemNode
            className="home-hero-node home-hero-node--three motion-mobile-hidden"
            delay={240}
            transform="translate(408 474)"
          />
        </g>

        <g className="home-hero-motion__focus" transform="translate(354 326)">
          <AccentDisc />
        </g>
      </svg>

      <span className="home-hero-motion__edge home-hero-motion__edge--top" />
      <span className="home-hero-motion__edge home-hero-motion__edge--bottom" />
    </ViewportMotion>
  );
}
