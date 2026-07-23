import Image from "next/image";
import Link from "next/link";

import type {
  CaseStudy,
  Insight,
  Service,
  TeamMember,
} from "@/content/site-content";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Surface } from "@/components/ui/surface";
import { SystemIcon, type SystemIconName } from "@/components/ui/system-icons";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/config";
import { isPublicRecord } from "@/lib/proof";

type ServiceCardProps = {
  index?: number;
  service: Service;
};

export function ServiceCard({ index = 0, service }: ServiceCardProps) {
  if (!isPublicRecord(service)) return null;

  return (
    <Surface
      className="group flex h-full min-h-[30rem] flex-col overflow-hidden"
      interactive
    >
      <ImagePlaceholder
        alt=""
        aspect="landscape"
        className="rounded-none border-0 border-b border-[var(--border)] bg-paper-100"
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        src={service.image}
      />
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="mb-10 flex items-start justify-between text-[var(--text-muted)]">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--foreground)] transition-colors duration-300 group-hover:border-signal-500 group-hover:bg-signal-400 group-hover:text-signal-900 group-hover:[&_circle.text-signal-400]:text-ink-950">
              <SystemIcon
                className="size-8"
                name={service.slug as SystemIconName}
              />
            </span>
            <span className="font-mono text-xs">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <ArrowRightIcon className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
        <h3 className="max-w-[18ch] text-2xl leading-tight font-semibold tracking-[-0.04em]">
          {service.shortName}
        </h3>
        <p className="mt-4 max-w-[48ch] text-sm leading-6 text-[var(--text-muted)]">
          {service.summary}
        </p>
        <TextLink
          className="mt-auto self-start pt-8"
          href={`/services/${service.slug}`}
        >
          Explore service
        </TextLink>
      </div>
    </Surface>
  );
}

type ProblemCardProps = {
  index?: number;
  title: string;
};

export function ProblemCard({ index = 0, title }: ProblemCardProps) {
  const icons: SystemIconName[] = [
    "problem-trust",
    "problem-adoption",
    "problem-routing",
    "problem-data",
    "problem-reporting",
    "problem-automation",
  ];

  return (
    <Surface
      className="group flex min-h-44 flex-col justify-between p-5 md:p-6"
      interactive
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs text-[var(--text-muted)]">
          Q/{String(index + 1).padStart(2, "0")}
        </span>
        <SystemIcon
          className="group-hover:text-orbit-700 size-10 text-[var(--text-muted)] transition-colors duration-300"
          name={icons[index % icons.length]}
        />
      </div>
      <h3 className="mt-10 max-w-[24ch] text-xl leading-snug font-semibold tracking-[-0.035em]">
        {title}
      </h3>
    </Surface>
  );
}

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  if (!isPublicRecord(caseStudy)) return null;

  return (
    <article>
      <Surface className="group overflow-hidden" interactive>
        <div className="relative aspect-[4/3] overflow-hidden bg-paper-100">
          <Image
            alt=""
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            src={caseStudy.image}
          />
        </div>
        <div className="p-6 md:p-8">
          <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
            {caseStudy.sector}
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
            {caseStudy.client}
          </h3>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            {caseStudy.summary}
          </p>
          <TextLink className="mt-7" href={`/work/${caseStudy.slug}`}>
            Read case study
          </TextLink>
        </div>
      </Surface>
    </article>
  );
}

type InsightCardProps = {
  insight: Insight;
  variant?: "default" | "featured" | "compact";
};

export function InsightCard({
  insight,
  variant = "default",
}: InsightCardProps) {
  if (!isPublicRecord(insight)) return null;

  if (variant === "compact") {
    return (
      <article className="group border-b border-[var(--border)] last:border-b-0">
        <Link
          className="grid min-h-36 grid-cols-[7rem_1fr] items-center gap-5 py-5 sm:grid-cols-[9rem_1fr]"
          href={`/insights/${insight.slug}`}
          prefetch={false}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-paper-100">
            <Image
              alt=""
              className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              fill
              sizes="144px"
              src={insight.image}
            />
          </div>
          <div>
            <p className="font-mono text-[0.6875rem] tracking-[0.1em] text-[var(--text-muted)] uppercase">
              {insight.category} · {insight.readingTime}
            </p>
            <h3 className="group-hover:text-orbit-700 mt-3 text-lg leading-snug font-semibold tracking-[-0.035em] transition-colors sm:text-xl">
              {insight.title}
            </h3>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="h-full">
      <Surface
        className="group flex h-full flex-col overflow-hidden"
        interactive
      >
        <div
          className={cn(
            "relative overflow-hidden bg-paper-100",
            variant === "featured" ? "aspect-[16/9]" : "aspect-[3/2]",
          )}
        >
          <Image
            alt=""
            className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            fill
            sizes={
              variant === "featured"
                ? "(max-width: 1024px) 100vw, 60vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            src={insight.image}
          />
        </div>
        <div
          className={cn(
            "flex flex-1 flex-col p-6",
            variant === "featured" && "md:p-9",
          )}
        >
          <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
            {insight.category} · {insight.readingTime}
          </p>
          <h3
            className={cn(
              "mt-5 max-w-[24ch] leading-tight font-semibold tracking-[-0.045em]",
              variant === "featured" ? "text-3xl md:text-4xl" : "text-2xl",
            )}
          >
            {insight.title}
          </h3>
          <p className="mt-4 max-w-[62ch] text-sm leading-6 text-[var(--text-muted)]">
            {insight.summary}
          </p>
          <TextLink
            className="mt-auto self-start pt-8"
            href={`/insights/${insight.slug}`}
          >
            Read insight
          </TextLink>
        </div>
      </Surface>
    </article>
  );
}

export function TeamCard({ member }: { member: TeamMember }) {
  if (!isPublicRecord(member)) return null;

  const showPortrait =
    member.portraitApprovalStatus === "approved" ||
    siteConfig.usesDevelopmentPortraits;
  const showBiography =
    member.bioApprovalStatus === "approved" ||
    siteConfig.deploymentEnvironment !== "production";
  const showSpecialisms =
    member.specialismsApprovalStatus === "approved" ||
    siteConfig.deploymentEnvironment !== "production";

  return (
    <article className="h-full">
      <Surface className="flex h-full flex-col overflow-hidden" interactive>
        {showPortrait ? (
          <div className="bg-paper-100">
            <Image
              alt={member.imageAlt}
              className="aspect-[4/5] h-auto w-full object-cover"
              height={1280}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              src={member.image}
              width={1024}
            />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-semibold tracking-[-0.035em]">
            {member.name}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{member.role}</p>
          {showBiography ? (
            <p className="mt-5 text-sm leading-6 text-[var(--text-muted)]">
              {member.bio}
            </p>
          ) : null}
          {showSpecialisms ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {member.specialisms.map((specialism) => (
                <CapabilityTag key={specialism}>{specialism}</CapabilityTag>
              ))}
            </div>
          ) : null}
        </div>
      </Surface>
    </article>
  );
}
