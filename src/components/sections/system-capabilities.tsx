"use client";

import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/sections/section-heading";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { connectedCapabilityGroups } from "@/content/experience-content";
import { cn } from "@/lib/cn";

type CapabilityGroup = (typeof connectedCapabilityGroups)[number];

type SystemCapabilitiesProps = {
  content: {
    body: string;
    headline: string;
  };
};

export function SystemCapabilities({ content }: SystemCapabilitiesProps) {
  const [activeId, setActiveId] = useState<CapabilityGroup["id"]>(
    connectedCapabilityGroups[0].id,
  );
  const activeIndex = connectedCapabilityGroups.findIndex(
    (group) => group.id === activeId,
  );
  const activeGroup = connectedCapabilityGroups[activeIndex];

  return (
    <Section surface="paper">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            body={content.body}
            className="lg:col-span-7"
            eyebrow="Connected capability"
            index="05"
            title={content.headline}
          />
          <p className="max-w-[34ch] border-l border-[var(--border-strong)] pl-5 font-mono text-[0.6875rem] leading-5 tracking-[0.1em] text-ink-950/70 uppercase lg:col-span-3 lg:col-start-10">
            Select a capability to see how the working system changes.
          </p>
        </div>

        <div
          className="mt-14 overflow-hidden rounded-xl border border-ink-950/20 bg-paper-50 shadow-[0_1.5rem_5rem_rgb(9_11_16/0.09)] lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]"
          data-testid="capability-explorer"
        >
          <CapabilityNavigation activeId={activeId} onSelect={setActiveId} />
          <CapabilityDetail
            activeGroup={activeGroup}
            activeIndex={activeIndex}
          />
        </div>
      </Container>
    </Section>
  );
}

function CapabilityNavigation({
  activeId,
  onSelect,
}: {
  activeId: CapabilityGroup["id"];
  onSelect: (id: CapabilityGroup["id"]) => void;
}) {
  return (
    <div
      className="surface-texture-dark bg-ink-950 text-paper-50"
      data-cursor-color="light"
      data-surface="dark"
    >
      <div className="hidden border-b border-white/12 px-6 py-5 font-mono text-[0.625rem] tracking-[0.13em] text-white/45 uppercase lg:block">
        Capability map
      </div>
      <div
        aria-label="Connected capability groups"
        className="hide-scrollbar flex overflow-x-auto lg:block lg:overflow-visible"
      >
        {connectedCapabilityGroups.map((group, index) => {
          const active = group.id === activeId;

          return (
            <button
              aria-pressed={active}
              className={cn(
                "group relative min-w-[11.5rem] border-r border-white/10 px-5 py-5 text-left transition-colors duration-300 last:border-r-0 lg:w-full lg:min-w-0 lg:border-r-0 lg:border-b lg:last:border-b-0",
                active
                  ? "bg-white/[0.07] text-white"
                  : "text-white/58 hover:bg-white/[0.04] hover:text-white",
              )}
              key={group.id}
              onClick={() => onSelect(group.id)}
              onFocus={() => onSelect(group.id)}
              onMouseEnter={() => onSelect(group.id)}
              type="button"
            >
              {active ? (
                <span className="capability-active-marker absolute inset-x-0 bottom-0 h-0.5 bg-signal-400 lg:inset-y-0 lg:right-auto lg:h-auto lg:w-0.5" />
              ) : null}
              <span className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-1.5 rounded-full border border-current transition-colors",
                    active && "border-signal-400 bg-signal-400",
                  )}
                />
                <span>
                  <span className="block font-mono text-[0.625rem] tracking-[0.12em] text-current/55">
                    C/{String(index + 1).padStart(2, "0")}
                  </span>
                  <strong className="mt-1.5 block text-sm tracking-[-0.02em]">
                    {group.label}
                  </strong>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CapabilityDetail({
  activeGroup,
  activeIndex,
}: {
  activeGroup: CapabilityGroup;
  activeIndex: number;
}) {
  return (
    <div className="surface-texture relative bg-paper-50 p-5 sm:p-8 lg:p-10">
      <div className="flex items-center justify-between gap-4 border-b border-ink-950/12 pb-4 font-mono text-[0.625rem] tracking-[0.13em] text-ink-950/50 uppercase">
        <span>System view / {String(activeIndex + 1).padStart(2, "0")}</span>
        <span className="inline-flex items-center gap-2 text-ink-950/70">
          <span className="size-1.5 rounded-full bg-signal-500" />
          Connected
        </span>
      </div>

      <div
        aria-live="polite"
        className="grid gap-8 pt-7 xl:grid-cols-[minmax(0,0.78fr)_minmax(28rem,1.22fr)] xl:items-stretch"
        key={activeGroup.id}
      >
        <div className="flex flex-col">
          <p className="font-mono text-[0.625rem] tracking-[0.13em] text-orbit-600 uppercase">
            Active layer / {activeGroup.label}
          </p>
          <h3 className="mt-4 max-w-[15ch] font-serif text-[clamp(2.25rem,3.6vw,3.75rem)] leading-[0.98] tracking-[-0.045em] text-ink-950">
            {activeGroup.description}
          </h3>

          <div className="mt-8 border-t border-ink-950/12 pt-5 xl:mt-auto">
            <p className="mb-3 font-mono text-[0.625rem] tracking-[0.12em] text-ink-950/50 uppercase">
              Typical capability
            </p>
            <div className="flex flex-wrap gap-2">
              {activeGroup.capabilities.map((capability) => (
                <CapabilityTag
                  className="bg-white"
                  context={
                    capability === "Custom-coded workflows"
                      ? "hubspot"
                      : "default"
                  }
                  key={capability}
                >
                  {capability}
                </CapabilityTag>
              ))}
            </div>
          </div>
        </div>

        <CapabilityFlow activeGroup={activeGroup} activeIndex={activeIndex} />
      </div>
    </div>
  );
}

function CapabilityFlow({
  activeGroup,
  activeIndex,
}: {
  activeGroup: CapabilityGroup;
  activeIndex: number;
}) {
  const middleLabel =
    activeGroup.nodes[1].toLowerCase() === "hubspot"
      ? "Customer platform"
      : activeGroup.nodes[1];

  return (
    <div className="relative overflow-hidden rounded-lg border border-ink-950/14 bg-white p-5 sm:p-6">
      <div
        aria-hidden="true"
        className="hairline-grid absolute inset-0 opacity-35"
      />
      <div className="relative z-10 flex h-full min-h-[20rem] flex-col">
        <div className="flex items-center justify-between gap-4 font-mono text-[0.5625rem] tracking-[0.12em] text-ink-950/45 uppercase">
          <span>Connection path</span>
          <span>{String(activeIndex + 1).padStart(2, "0")} / 04</span>
        </div>

        <div className="my-auto grid gap-3 py-8 sm:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1.1fr)_2.5rem_minmax(0,1fr)] sm:items-center sm:gap-2">
          <FlowNode index="01" label={activeGroup.nodes[0]} tone="light" />
          <FlowConnector />
          <FlowNode
            caption={middleLabel}
            index="02"
            label="HubSpot"
            tone="dark"
          />
          <FlowConnector />
          <FlowNode index="03" label={activeGroup.nodes[2]} tone="light" />
        </div>

        <div className="flex items-center gap-3 border-t border-ink-950/10 pt-4 font-mono text-[0.5625rem] tracking-[0.1em] text-ink-950/48 uppercase">
          <span className="size-1.5 rounded-full bg-signal-500" />
          <span>One governed customer system</span>
        </div>
      </div>
    </div>
  );
}

function FlowNode({
  caption,
  index,
  label,
  tone,
}: {
  caption?: string;
  index: string;
  label: string;
  tone: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "relative min-h-28 rounded-md border p-4",
        tone === "dark"
          ? "border-ink-950 bg-ink-950 text-paper-50 shadow-[0_1rem_3rem_rgb(9_11_16/0.15)]"
          : "border-ink-950/14 bg-paper-50 text-ink-950",
      )}
      data-cursor-color={tone === "dark" ? "light" : "dark"}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-3 font-mono text-[0.5625rem] tracking-[0.1em] uppercase",
          tone === "dark" ? "text-white/60" : "text-ink-950/65",
        )}
      >
        <span>Node {index}</span>
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full",
            tone === "dark" ? "bg-hubspot-coral" : "bg-signal-500",
          )}
        />
      </div>
      <p className="mt-6 text-sm leading-5 font-semibold tracking-[-0.02em]">
        {label}
      </p>
      {caption ? (
        <p
          className={cn(
            "mt-1 font-mono text-[0.5625rem] leading-4 tracking-[0.06em] uppercase",
            tone === "dark" ? "text-white/60" : "text-ink-950/65",
          )}
        >
          {caption}
        </p>
      ) : null}
    </div>
  );
}

function FlowConnector() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-7 w-px bg-ink-950/18 sm:h-px sm:w-full"
    >
      <span className="capability-flow-pulse absolute top-0 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal-500 sm:left-0" />
    </div>
  );
}
