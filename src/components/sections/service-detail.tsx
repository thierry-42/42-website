import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { GlobalCta } from "@/components/sections/global-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { ProcessSection } from "@/components/sections/process-section";
import { SectionHeading } from "@/components/sections/section-heading";
import { Accordion } from "@/components/ui/accordion";
import { ServiceCard } from "@/components/ui/cards";
import { Surface } from "@/components/ui/surface";
import { serviceNarratives } from "@/content/page-content";
import {
  publicContent,
  siteContent,
  type Service,
} from "@/content/site-content";

export function ServiceDetail({
  consultationHref,
  service,
}: {
  consultationHref: string;
  service: Service;
}) {
  const related = service.related
    .map((slug) => publicContent.services.find((item) => item.slug === slug))
    .filter((item): item is Service => item !== undefined);
  const narrative =
    serviceNarratives[service.slug as keyof typeof serviceNarratives];

  return (
    <>
      <PageIntro
        body={service.summary}
        breadcrumb={service.name}
        eyebrow={service.serviceLine}
        imageSrc={service.image}
        title={service.headline}
        visual
      />

      <Section surface="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <SectionHeading
              body={narrative.problemBody}
              className="lg:col-span-5"
              eyebrow="The client problem"
              index="01"
              title={narrative.problemTitle}
            />
            <Surface className="overflow-hidden lg:col-span-6 lg:col-start-7">
              <div className="border-b border-[var(--border)] p-6 md:p-8">
                <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                  The working answer
                </p>
              </div>
              <ol className="divide-y divide-[var(--border)]">
                {narrative.answer.map((item, index) => (
                  <li
                    className="grid grid-cols-[3rem_1fr] gap-4 p-6 md:px-8"
                    key={item}
                  >
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-semibold tracking-[-0.02em]">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </Surface>
          </div>
        </Container>
      </Section>

      <Section surface="muted">
        <Container>
          <SectionHeading
            body="The exact scope follows the business problem, platform state, dependencies, and measures of success discovered at the start of the engagement."
            eyebrow="What this can include"
            index="02"
            title="A focused scope, built from the right capabilities."
          />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {service.capabilities.map((capability, index) => (
              <Surface
                className="flex min-h-44 flex-col justify-between p-5"
                key={capability}
              >
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  C/{String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-10 text-lg leading-snug font-semibold tracking-[-0.03em]">
                  {capability}
                </h3>
              </Surface>
            ))}
          </div>
        </Container>
      </Section>

      <ProcessSection compact />

      <Section surface="paper">
        <Container>
          <SectionHeading
            body="Reliable HubSpot work stays understandable after launch. These principles guide architecture, delivery, and handover."
            eyebrow="What good looks like"
            index="04"
            title="Clear enough to use. Strong enough to grow."
          />
          <div className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {siteContent.brand.principles.map((principle, index) => (
              <Surface className="min-h-40 p-6" key={principle}>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  P/{String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-9 text-lg font-semibold tracking-[-0.025em]">
                  {principle}
                </p>
              </Surface>
            ))}
          </div>
        </Container>
      </Section>

      {related.length > 0 ? (
        <Section surface="muted">
          <Container>
            <SectionHeading
              eyebrow="Related services"
              index="05"
              title="The next answer may sit next door."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <ServiceCard index={index} key={item.slug} service={item} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section surface="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <SectionHeading
              className="lg:col-span-5"
              eyebrow="Frequently asked"
              index="06"
              title="Useful answers before the first conversation."
            />
            <div className="lg:col-span-6 lg:col-start-7">
              <Accordion items={siteContent.faqs} />
            </div>
          </div>
        </Container>
      </Section>

      <GlobalCta href={consultationHref} />
    </>
  );
}
