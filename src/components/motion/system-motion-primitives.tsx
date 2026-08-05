import type { CSSProperties } from "react";

type MotionStyle = CSSProperties & Record<`--${string}`, string | number>;

export function TechnicalGrid({ patternId }: { patternId: string }) {
  return (
    <>
      <defs>
        <pattern
          height="32"
          id={patternId}
          patternUnits="userSpaceOnUse"
          width="32"
        >
          <path className="motion-grid-line" d="M32 0H0V32" fill="none" />
          <circle className="motion-grid-point" cx="1" cy="1" r="1" />
        </pattern>
      </defs>
      <rect
        className="motion-grid"
        fill={`url(#${patternId})`}
        height="100%"
        width="100%"
      />
    </>
  );
}

export function SignalPath({
  className = "",
  d,
  delay = 0,
  pathLength = 1,
}: {
  className?: string;
  d: string;
  delay?: number;
  pathLength?: number;
}) {
  const style = { "--motion-delay": `${delay}ms` } as MotionStyle;

  return (
    <g className={`motion-signal-path ${className}`} style={style}>
      <path
        className="motion-signal-path__base"
        d={d}
        pathLength={pathLength}
      />
      <path
        className="motion-signal-path__trace"
        d={d}
        pathLength={pathLength}
      />
      <path
        className="motion-signal-path__pulse"
        d={d}
        pathLength={pathLength}
      />
    </g>
  );
}

export function SystemNode({
  className = "",
  delay = 0,
  transform,
}: {
  className?: string;
  delay?: number;
  transform: string;
}) {
  const style = { "--motion-delay": `${delay}ms` } as MotionStyle;

  return (
    <g transform={transform}>
      <g className={`motion-system-node ${className}`} style={style}>
        <rect
          className="motion-system-node__body"
          height="56"
          rx="7"
          width="84"
        />
        <path
          className="motion-system-node__detail"
          d="M14 18h38M14 28h52M14 38h30"
        />
        <circle className="motion-system-node__point" cx="70" cy="16" r="4" />
      </g>
    </g>
  );
}

export function AcrylicPanel({
  className = "",
  points,
}: {
  className?: string;
  points: string;
}) {
  return (
    <g className={`motion-acrylic-panel ${className}`}>
      <polygon className="motion-acrylic-panel__shadow" points={points} />
      <polygon className="motion-acrylic-panel__surface" points={points} />
      <path className="motion-acrylic-panel__reflection" d="M0 0h180" />
    </g>
  );
}

export function ArchitecturalModule({
  className = "",
  delay = 0,
  transform,
}: {
  className?: string;
  delay?: number;
  transform: string;
}) {
  const style = { "--motion-delay": `${delay}ms` } as MotionStyle;

  return (
    <g transform={transform}>
      <g className={`motion-architectural-module ${className}`} style={style}>
        <path
          className="motion-architectural-module__top"
          d="m0 14 34-14 46 18-34 15Z"
        />
        <path
          className="motion-architectural-module__front"
          d="m0 14 46 19v42L0 56Z"
        />
        <path
          className="motion-architectural-module__side"
          d="m46 33 34-15v42L46 75Z"
        />
        <circle
          className="motion-architectural-module__point"
          cx="62"
          cy="38"
          r="4"
        />
      </g>
    </g>
  );
}

export function AccentDisc({ className = "" }: { className?: string }) {
  return (
    <g className={`motion-accent-disc ${className}`}>
      <ellipse
        className="motion-accent-disc__shadow"
        cx="0"
        cy="12"
        rx="64"
        ry="22"
      />
      <circle className="motion-accent-disc__rim" cx="0" cy="0" r="58" />
      <circle className="motion-accent-disc__face" cx="0" cy="0" r="49" />
      <g className="motion-accent-disc__forty-two">
        <path d="M-29 6h25M-8-28-29 6v19M-8-28v53" />
        <path d="M9-17c2-9 10-13 19-10 9 3 12 12 8 20L11 24h29" />
      </g>
      <HubSpotSprocketMark />
    </g>
  );
}

function HubSpotSprocketMark() {
  return (
    <g className="motion-accent-disc__hubspot-mark">
      <circle className="motion-hubspot-ring" cx="3" cy="4" r="19" />
      <path
        className="motion-hubspot-arm"
        d="M-12-8-29-22M3-15v-16M-10 18l-14 15"
      />
      <circle className="motion-hubspot-node" cx="-34" cy="-26" r="7" />
      <circle className="motion-hubspot-node" cx="3" cy="-37" r="7" />
      <circle className="motion-hubspot-node" cx="-29" cy="39" r="7" />
    </g>
  );
}

export function ConnectionPulse({ className = "" }: { className?: string }) {
  return <circle className={`motion-connection-pulse ${className}`} r="5" />;
}

export function MotionCardOverlay() {
  return (
    <div
      aria-hidden="true"
      className="motion-card-overlay pointer-events-none absolute inset-0"
      data-testid="strategy-motion-card-overlay"
    >
      <svg
        className="size-full"
        focusable="false"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 640 400"
      >
        <TechnicalGrid patternId="strategy-card-grid" />
        <SignalPath
          className="motion-card-path motion-card-path--one"
          d="M70 290C170 290 180 122 305 122S430 244 568 160"
        />
        <SignalPath
          className="motion-card-path motion-card-path--two"
          d="M100 92C205 92 210 244 350 244S472 306 570 306"
          delay={120}
        />
        <SystemNode
          className="motion-card-node motion-card-node--one"
          delay={80}
          transform="translate(72 64)"
        />
        <SystemNode
          className="motion-card-node motion-card-node--two"
          delay={160}
          transform="translate(280 200)"
        />
        <SystemNode
          className="motion-card-node motion-card-node--three"
          delay={240}
          transform="translate(480 112)"
        />
        <ConnectionPulse className="motion-card-connection-pulse" />
      </svg>
      <span className="motion-card-overlay__highlight" />
    </div>
  );
}
