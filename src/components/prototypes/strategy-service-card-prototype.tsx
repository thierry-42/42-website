import type { Service } from "@/content/site-content";
import { StrategyArchitectureAnimation } from "@/components/prototypes/strategy-architecture-animation";
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
      className="group flex h-full flex-col overflow-hidden sm:min-h-[30rem]"
      data-testid="strategy-service-card-prototype"
      interactive
    >
      <StrategyArchitectureAnimation />
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
            <span className="hidden items-center gap-2 font-mono text-[0.625rem] tracking-[0.1em] text-[var(--text-muted)] uppercase sm:inline-flex">
              <span className="size-1.5 rounded-full bg-signal-400" />
              Motion prototype
            </span>
            <ArrowRightIcon className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
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
