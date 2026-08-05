import type { Service } from "@/content/site-content";
import { MotionCardOverlay } from "@/components/motion/system-motion-primitives";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Surface } from "@/components/ui/surface";
import { SystemIcon } from "@/components/ui/system-icons";
import { TextLink } from "@/components/ui/text-link";

export function StrategyServiceCardPrototype({
  index,
  service,
}: {
  index: number;
  service: Service;
}) {
  return (
    <Surface
      className="strategy-service-card group flex h-full flex-col overflow-hidden sm:min-h-[30rem]"
      data-testid="strategy-service-card-prototype"
      interactive
    >
      <div
        className="relative isolate overflow-hidden border-b border-[var(--border)]"
        data-testid="strategy-card-visual"
      >
        <ImagePlaceholder
          alt=""
          aspect="landscape"
          className="rounded-none border-0 bg-paper-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          src={service.image}
        />
        <MotionCardOverlay />
        <div
          aria-hidden="true"
          className="strategy-service-card__edge pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-signal-400 transition-transform duration-300 ease-out"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
        <div className="mb-7 flex items-start justify-between text-[var(--text-muted)] sm:mb-10">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] transition-colors duration-200 group-hover:border-signal-500 group-hover:bg-signal-400 group-hover:text-signal-900 group-hover:[&_circle.text-signal-400]:text-ink-950">
              <SystemIcon
                className="size-8"
                name="hubspot-strategy-consulting"
              />
            </span>
            <span className="font-mono text-xs">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ArrowRightIcon className="size-5 transition-transform duration-200 group-focus-within:translate-x-1 group-hover:translate-x-1" />
          </div>
        </div>
        <h3 className="max-w-[18ch] text-2xl leading-tight font-semibold tracking-[-0.04em]">
          {service.shortName}
        </h3>
        <p className="mt-4 max-w-[48ch] text-sm leading-6 text-[var(--text-muted)]">
          {service.summary}
        </p>
        <TextLink
          className="mt-7 self-start sm:mt-auto sm:pt-8"
          href={`/services/${service.slug}`}
        >
          Explore service
        </TextLink>
      </div>
    </Surface>
  );
}
