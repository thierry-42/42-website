import Image from "next/image";

import { cn } from "@/lib/cn";

type ImagePlaceholderProps = {
  alt?: string;
  aspect?: "portrait" | "landscape" | "square";
  className?: string;
  priority?: boolean;
  sizes?: string;
  src: string;
};

const aspectClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
};

export function ImagePlaceholder({
  alt = "",
  aspect = "landscape",
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  src,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-muted)]",
        aspectClasses[aspect],
        className,
      )}
      data-scroll-image
    >
      <Image
        alt={alt}
        className="object-cover"
        fill
        priority={priority}
        sizes={sizes}
        src={src}
      />
    </div>
  );
}
