import type { SVGProps } from "react";

export function RetroAnswerTerminal({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 760 720"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M116 625C164 594 250 578 380 578C510 578 596 594 644 625" />
        <path d="M86 651C168 620 266 607 380 607C494 607 592 620 674 651" />
        <path d="M136 651H624L598 681H162L136 651Z" />
        <path d="M193 634L223 610M567 634L537 610" />

        <path d="M299 546L331 359H456L491 546" />
        <path d="M329 547L352 390H435L461 547" />
        <path d="M259 576L298 523H491L532 576" />
        <path d="M279 577L314 544H476L510 577" />
        <path d="M339 409L291 480L281 554" />
        <path d="M446 409L501 475L515 554" />

        <path d="M184 96C182 73 198 55 221 52L554 23C580 21 601 39 604 65L637 306C640 331 623 354 598 357L231 397C205 400 182 381 180 355L160 125C158 110 168 98 184 96Z" />
        <path d="M207 119L548 82C562 80 574 91 576 105L597 287C599 302 588 315 573 316L237 351C221 353 208 342 207 326L190 146C189 132 198 121 207 119Z" />
        <path d="M229 139L548 105L567 285L246 318L229 139Z" />
        <path d="M210 368L603 326" />
        <path d="M235 377L254 354M570 343L594 359" />

        <path d="M278 169L507 145" strokeDasharray="7 15" />
        <path d="M264 272L476 250" />
        <path d="M265 291L399 277" />
        <circle cx="530" cy="267" r="12" />
        <circle cx="530" cy="267" r="3" />

        <path d="M369 360V386M421 355V385" />
        <path d="M347 394H449" />
        <path d="M352 414H443" strokeDasharray="5 10" />

        <path d="M98 625H65M695 625H662" />
        <path d="M380 578V561" />
        <circle cx="380" cy="550" r="4" />
      </g>
    </svg>
  );
}
