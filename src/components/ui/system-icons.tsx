import type { ComponentProps, ReactNode } from "react";

type SvgProps = ComponentProps<"svg">;

export type SystemIconName =
  | "hubspot-strategy-consulting"
  | "implementation-onboarding"
  | "crm-revops"
  | "automation-operations"
  | "integrations-custom-development"
  | "websites-content-hub"
  | "service-hub-customer-experience"
  | "managed-hubspot-support"
  | "engagement-review"
  | "engagement-build"
  | "engagement-connect"
  | "engagement-improve"
  | "sector-manufacturing"
  | "sector-saas"
  | "sector-professional"
  | "sector-education"
  | "sector-energy"
  | "sector-commerce"
  | "problem-trust"
  | "problem-adoption"
  | "problem-routing"
  | "problem-data"
  | "problem-reporting"
  | "problem-automation"
  | "review-findings"
  | "review-risk"
  | "review-priorities"
  | "review-roadmap"
  | "contact-context"
  | "contact-question"
  | "contact-next";

const glyphs: Record<SystemIconName, ReactNode> = {
  "hubspot-strategy-consulting": (
    <>
      <path d="M9 36V12h30v24H9Z" />
      <path d="M15 30 23 22l5 4 7-9" />
      <circle className="text-signal-400" cx="35" cy="17" r="2.5" />
      <path d="M15 16h7M15 20h4" />
    </>
  ),
  "implementation-onboarding": (
    <>
      <path d="M8 31h10V21H8v10Zm11 7h10V28H19v10Zm11-14h10V14H30v10Z" />
      <path d="m13 17 6-6 7 7 8-8" />
      <circle className="text-signal-400" cx="34" cy="10" r="2.5" />
    </>
  ),
  "crm-revops": (
    <>
      <ellipse cx="16" cy="14" rx="7" ry="4" />
      <path d="M9 14v12c0 2.2 3.1 4 7 4s7-1.8 7-4V14M9 20c0 2.2 3.1 4 7 4s7-1.8 7-4" />
      <path d="M27 17h7v8h6M27 31h6v7" />
      <circle className="text-signal-400" cx="40" cy="25" r="2.5" />
      <circle cx="33" cy="38" r="2.5" />
    </>
  ),
  "automation-operations": (
    <>
      <path d="M9 15h10v8H9zM29 25h10v8H29z" />
      <path d="M19 19h7a7 7 0 0 1 7 6M29 29h-7a7 7 0 0 1-7-6" />
      <path d="m30 12 4 4-4 4M18 36l-4-4 4-4" />
      <circle className="text-signal-400" cx="34" cy="16" r="2" />
    </>
  ),
  "integrations-custom-development": (
    <>
      <path d="M7 14h12v20H7zM29 14h12v20H29z" />
      <path d="M19 20h10M19 28h10" />
      <circle cx="13" cy="20" r="2.5" />
      <circle cx="35" cy="28" r="2.5" />
      <circle className="text-signal-400" cx="24" cy="24" r="3" />
    </>
  ),
  "websites-content-hub": (
    <>
      <path d="M7 10h34v28H7zM7 17h34" />
      <circle cx="12" cy="13.5" r="1" />
      <path d="M12 23h12v10H12zM29 23h7M29 28h7M29 33h5" />
      <circle className="text-signal-400" cx="24" cy="33" r="2.5" />
    </>
  ),
  "service-hub-customer-experience": (
    <>
      <circle cx="24" cy="24" r="6" />
      <path d="M24 18V8M24 40V30M18 24H8M40 24H30M19.8 19.8l-7-7M35.2 35.2l-7-7M28.2 19.8l7-7M12.8 35.2l7-7" />
      <circle className="text-signal-400" cx="24" cy="8" r="2.5" />
      <circle cx="40" cy="24" r="2.5" />
    </>
  ),
  "managed-hubspot-support": (
    <>
      <path d="M10 13h28M10 24h28M10 35h28" />
      <circle cx="18" cy="13" r="4" />
      <circle className="text-signal-400" cx="31" cy="24" r="4" />
      <circle cx="22" cy="35" r="4" />
    </>
  ),
  "engagement-review": (
    <>
      <circle cx="21" cy="21" r="10" />
      <path d="m28.5 28.5 9 9M16 21h10M21 16v10" />
      <circle className="text-signal-400" cx="21" cy="21" r="2.5" />
    </>
  ),
  "engagement-build": (
    <>
      <path d="m8 30 16 8 16-8-16-8-16 8Zm0-9 16 8 16-8-16-8-16 8Z" />
      <path d="m13 14 11-5 11 5" />
      <circle className="text-signal-400" cx="24" cy="9" r="2.5" />
    </>
  ),
  "engagement-connect": (
    <>
      <path d="M17 15h-4a7 7 0 0 0 0 14h8a7 7 0 0 0 6-3.5M31 33h4a7 7 0 0 0 0-14h-8a7 7 0 0 0-6 3.5" />
      <path d="M18 24h12" />
      <circle className="text-signal-400" cx="24" cy="24" r="2.5" />
    </>
  ),
  "engagement-improve": (
    <>
      <path d="M9 37h30M11 33l8-8 6 4 12-14" />
      <path d="M30 15h7v7" />
      <circle cx="19" cy="25" r="2.5" />
      <circle className="text-signal-400" cx="37" cy="15" r="2.5" />
    </>
  ),
  "sector-manufacturing": (
    <>
      <path d="M8 38V22l10 5v-8l10 5v-9h12v23H8Z" />
      <path d="M14 33h4M24 33h4M34 21v17" />
      <circle className="text-signal-400" cx="34" cy="15" r="2.5" />
    </>
  ),
  "sector-saas": (
    <>
      <path d="M14 32h22a7 7 0 0 0 1-13.9A11 11 0 0 0 16 16a8 8 0 0 0-2 16Z" />
      <path d="M18 24h12M24 20v8" />
      <circle className="text-signal-400" cx="24" cy="24" r="2.5" />
    </>
  ),
  "sector-professional": (
    <>
      <path d="M8 17h32v21H8zM18 17v-5h12v5" />
      <path d="M8 25h32M20 25v4h8v-4" />
      <circle className="text-signal-400" cx="24" cy="29" r="2" />
    </>
  ),
  "sector-education": (
    <>
      <path d="M24 13c-4-3-9-3-14-2v25c5-1 10-1 14 2V13Zm0 0c4-3 9-3 14-2v25c-5-1-10-1-14 2" />
      <path d="M24 18v20" />
      <circle className="text-signal-400" cx="24" cy="13" r="2.5" />
    </>
  ),
  "sector-energy": (
    <>
      <path d="m27 7-13 20h9l-2 14 13-21h-9l2-13Z" />
      <path d="M8 38h8M32 10h8" />
      <circle className="text-signal-400" cx="34" cy="10" r="2.5" />
    </>
  ),
  "sector-commerce": (
    <>
      <path d="m12 17 12-7 12 7v15l-12 7-12-7V17Z" />
      <path d="m12 17 12 7 12-7M24 24v15" />
      <circle className="text-signal-400" cx="24" cy="10" r="2.5" />
    </>
  ),
  "problem-trust": (
    <>
      <path d="M9 12h30v24H9zM15 29l6-6 5 4 7-8" />
      <path d="M35 31h.01" />
      <circle className="text-signal-400" cx="35" cy="31" r="3" />
    </>
  ),
  "problem-adoption": (
    <>
      <circle cx="17" cy="17" r="5" />
      <path d="M8 37c1-7 4-11 9-11s8 4 9 11M30 15h10M30 22h7M30 29h5" />
      <circle className="text-signal-400" cx="37" cy="29" r="2.5" />
    </>
  ),
  "problem-routing": (
    <>
      <path d="M8 24h10M18 24c7 0 4-11 11-11h10M18 24c7 0 4 11 11 11h10" />
      <circle cx="8" cy="24" r="2.5" />
      <circle className="text-signal-400" cx="39" cy="13" r="2.5" />
      <path d="M34 31l5 4-5 4" />
    </>
  ),
  "problem-data": (
    <>
      <path d="M8 14h12v20H8zM28 14h12v20H28z" />
      <path d="M20 20h4M24 28h4" strokeDasharray="2 3" />
      <circle className="text-signal-400" cx="24" cy="24" r="2.5" />
    </>
  ),
  "problem-reporting": (
    <>
      <path d="M9 38V10M9 38h30M15 32V24M23 32V17M31 32v-5" />
      <path d="M35 13a4 4 0 1 0-6 3.5c1 .7 2 1.2 2 2.5" />
      <circle className="text-signal-400" cx="31" cy="23" r="2" />
    </>
  ),
  "problem-automation": (
    <>
      <path d="M10 16h9v7h-9zM29 25h9v7h-9z" />
      <path d="M19 19.5c9 0 2 9 10 9M29 28.5c-9 0-2-9-10-9" />
      <path d="m24 12 4 4-4 4M24 28l-4 4 4 4" />
      <circle className="text-signal-400" cx="28" cy="16" r="2" />
    </>
  ),
  "review-findings": (
    <>
      <path d="M11 8h22l6 6v26H11V8Z" />
      <path d="M33 8v7h6M17 22h16M17 28h12M17 34h8" />
      <circle className="text-signal-400" cx="33" cy="28" r="2.5" />
    </>
  ),
  "review-risk": (
    <>
      <path d="m24 8 17 30H7L24 8Z" />
      <path d="M24 18v10" />
      <circle className="text-signal-400" cx="24" cy="33" r="2.5" />
    </>
  ),
  "review-priorities": (
    <>
      <path d="M10 14h28M10 24h28M10 34h28" />
      <circle className="text-signal-400" cx="18" cy="14" r="4" />
      <circle cx="29" cy="24" r="4" />
      <circle cx="23" cy="34" r="4" />
    </>
  ),
  "review-roadmap": (
    <>
      <path d="M9 36h30M11 31h8v5h8V23h10V12" />
      <circle cx="19" cy="31" r="2.5" />
      <circle cx="27" cy="23" r="2.5" />
      <circle className="text-signal-400" cx="37" cy="12" r="2.5" />
    </>
  ),
  "contact-context": (
    <>
      <path d="M9 12h30v24H9zM15 19h18M15 25h12M15 31h8" />
      <circle className="text-signal-400" cx="34" cy="31" r="3" />
    </>
  ),
  "contact-question": (
    <>
      <path d="M9 11h30v23H24l-8 6v-6H9V11Z" />
      <path d="M20 20a4 4 0 1 1 6 3.5c-1 .7-2 1.2-2 3" />
      <circle className="text-signal-400" cx="24" cy="30" r="2" />
    </>
  ),
  "contact-next": (
    <>
      <path d="M9 24h28M28 15l9 9-9 9" />
      <path d="M11 13v22" />
      <circle className="text-signal-400" cx="37" cy="24" r="2.5" />
    </>
  ),
};

export function SystemIcon({
  className,
  name,
  ...props
}: SvgProps & { name: SystemIconName }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      >
        {glyphs[name]}
      </g>
    </svg>
  );
}
