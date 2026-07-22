import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import {
  CheckboxField,
  FormField,
  SelectField,
  TextareaField,
} from "@/components/forms/fields";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SystemNode } from "@/components/diagrams/system-node";
import { Accordion } from "@/components/ui/accordion";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { ProblemCard, ServiceCard } from "@/components/ui/cards";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { ProcessStep } from "@/components/ui/process-step";
import { Surface } from "@/components/ui/surface";
import { Body, Editorial, Heading } from "@/components/ui/typography";
import { publicContent, siteContent } from "@/content/site-content";

export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <Section className="pt-[calc(var(--header-height)+5rem)]" surface="dark">
        <Container>
          <Eyebrow>Development-only specimen</Eyebrow>
          <Heading as="h1" size="h1">
            The 42 <Editorial>design system.</Editorial>
          </Heading>
          <Body className="mt-6" size="lg">
            A private route for checking tokens, primitives, interaction states,
            and responsive behaviour without publishing placeholder proof.
          </Body>
        </Container>
      </Section>

      <Section surface="paper">
        <Container>
          <Specimen title="Navigation and actions">
            <Breadcrumb
              items={[{ href: "/", label: "Home" }, { label: "Design system" }]}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button showArrow>Primary action</Button>
              <Button variant="secondary">Secondary action</Button>
              <Button disabled>Disabled action</Button>
            </div>
          </Specimen>

          <Specimen title="Surfaces and cards">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <ServiceCard service={publicContent.services[0]} />
              {siteContent.home.problem.items.slice(0, 2).map((item, index) => (
                <ProblemCard index={index} key={item} title={item} />
              ))}
            </div>
          </Specimen>

          <Specimen title="Tags and system nodes">
            <div className="flex flex-wrap gap-2">
              <CapabilityTag>CRM architecture</CapabilityTag>
              <CapabilityTag context="hubspot">HubSpot context</CapabilityTag>
              <CapabilityTag>REST APIs</CapabilityTag>
            </div>
            <div className="mt-8 grid items-center gap-4 md:grid-cols-[1fr_5rem_1fr]">
              <SystemNode label="Customer data" meta="Source" />
              <div aria-hidden="true" className="h-px bg-orbit-400/60" />
              <SystemNode
                context="hubspot"
                label="HubSpot"
                meta="Connected node"
              />
            </div>
          </Specimen>

          <Specimen title="Image and process foundations">
            <div className="grid gap-5 md:grid-cols-2">
              <ImagePlaceholder src="/images/placeholders/foundation-grid.webp" />
              <ProcessStep {...siteContent.home.process.steps[0]} />
            </div>
          </Specimen>

          <Specimen title="Form controls">
            <div className="grid max-w-2xl gap-5">
              <FormField
                id="specimen-name"
                label="Name"
                placeholder="A clear label"
              />
              <SelectField id="specimen-select" label="Primary question">
                <option>Choose an option</option>
                <option>CRM architecture</option>
              </SelectField>
              <TextareaField id="specimen-message" label="Message" />
              <CheckboxField
                id="specimen-consent"
                label="I understand this is a development specimen."
              />
            </div>
          </Specimen>

          <Specimen title="Accordion">
            <Accordion items={siteContent.faqs.slice(0, 3)} />
          </Specimen>
        </Container>
      </Section>
    </>
  );
}

function Specimen({ children, title }: { children: ReactNode; title: string }) {
  return (
    <Surface className="mb-8 p-6 md:p-8">
      <h2 className="mb-8 font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
        {title}
      </h2>
      {children}
    </Surface>
  );
}
