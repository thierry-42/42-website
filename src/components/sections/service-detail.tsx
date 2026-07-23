import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { GlobalCta } from "@/components/sections/global-cta";
import { PageIntro } from "@/components/sections/page-intro";
import { StructuredData } from "@/components/seo/structured-data";
import { SectionHeading } from "@/components/sections/section-heading";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { InsightCard, ServiceCard } from "@/components/ui/cards";
import { Surface } from "@/components/ui/surface";
import { TextLink } from "@/components/ui/text-link";
import { serviceNarratives } from "@/content/page-content";
import { publicContent, type Service } from "@/content/site-content";
import { createServiceStructuredData } from "@/lib/structured-data";

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
  const relatedInsights = publicContent.insights
    .filter((insight) => insight.serviceSlugs.includes(service.slug))
    .slice(0, 3);
  const narrative =
    serviceNarratives[service.slug as keyof typeof serviceNarratives];

  return (
    <>
      <StructuredData data={createServiceStructuredData(service)} />
      <PageIntro
        body={service.summary}
        breadcrumb={service.name}
        breadcrumbItems={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { label: service.name },
        ]}
        eyebrow={service.serviceLine}
        imageSrc={service.image}
        path={`/services/${service.slug}`}
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
            <div className="space-y-4 lg:col-span-6 lg:col-start-7">
              <Surface className="p-6 md:p-8">
                <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                  Who this service is for
                </p>
                <ul className="mt-6 space-y-4">
                  {narrative.whoFor.map((item) => (
                    <li
                      className="border-l-2 border-signal-500 pl-4 leading-7"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Surface>
              <Surface className="p-6 md:p-8">
                <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                  Typical problems
                </p>
                <ul className="mt-6 grid gap-4">
                  {narrative.typicalProblems.map((item, index) => (
                    <li className="grid grid-cols-[2rem_1fr] gap-3" key={item}>
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-7">{item}</span>
                    </li>
                  ))}
                </ul>
              </Surface>
            </div>
          </div>
        </Container>
      </Section>

      <Section surface="muted">
        <Container>
          <SectionHeading
            body="The final scope follows the business problem, platform state, dependencies, and agreed measures of success."
            eyebrow="Typical deliverables"
            index="02"
            title="A focused scope, made tangible."
          />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {service.capabilities.map((capability, index) => (
              <Surface
                className="flex min-h-44 flex-col justify-between p-5"
                key={capability}
              >
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  D/{String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-10 text-lg leading-snug font-semibold tracking-[-0.03em]">
                  {capability}
                </h3>
              </Surface>
            ))}
          </div>
        </Container>
      </Section>

      <Section surface="dark">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                body={narrative.approach}
                eyebrow="How the work moves"
                index="03"
                title="Expected outcomes, with a clear route to delivery."
              />
              <TextLink className="mt-8 text-paper-50" href="/approach">
                See the full 42 approach
              </TextLink>
            </div>
            <ol className="grid gap-3 lg:col-span-6 lg:col-start-7">
              {narrative.expectedOutcomes.map((item, index) => (
                <li key={item}>
                  <Surface
                    className="grid grid-cols-[3rem_1fr] gap-4 border-white/14 p-6"
                    tone="dark"
                  >
                    <span className="font-mono text-xs text-white/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-semibold tracking-[-0.02em]">
                      {item}
                    </span>
                  </Surface>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      {relatedInsights.length > 0 ? (
        <Section surface="paper">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <SectionHeading
                body="Use these guides to prepare for discovery, challenge assumptions, and make the next decision with more context."
                eyebrow="Related insights"
                index="04"
                title="Practical reading for this service."
              />
              <TextLink href="/insights">Browse all insights</TextLink>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedInsights.map((insight) => (
                <InsightCard insight={insight} key={insight.slug} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section surface="muted">
          <Container>
            <SectionHeading
              eyebrow="Related services"
              index="05"
              title="The next answer may sit next door."
            />
            <div className="mt-12 flex flex-wrap gap-2">
              {service.capabilities.slice(0, 4).map((capability) => (
                <CapabilityTag key={capability}>{capability}</CapabilityTag>
              ))}
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <ServiceCard index={index} key={item.slug} service={item} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <GlobalCta href={consultationHref} />
    </>
  );
}
