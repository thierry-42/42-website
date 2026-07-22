import type { ComponentProps } from "react";

type IconProps = ComponentProps<"svg">;

const shared = {
  fill: "none",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
} as const;

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...shared} {...props}>
      <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...shared} {...props}>
      <path
        d="M5 12h14M14 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...shared} {...props}>
      <path
        d="M12 19V5M7 10l5-5 5 5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...shared} {...props}>
      <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...shared} {...props}>
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" {...shared} {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}
