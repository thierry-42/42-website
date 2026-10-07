import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { StructuredData } from "@/components/seo/structured-data";
import { CtaPanel } from "@/components/sections/cta-panel";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { InsightCard } from "@/components/ui/cards";
import { ProcessStep } from "@/components/ui/process-step";
import { Surface } from "@/components/ui/surface";
import { SystemIcon, type SystemIconName } from "@/components/ui/system-icons";
import {
  reviewAreas,
  reviewOutcomes,
  reviewPreparation,
  reviewProcess,
  reviewSignals,
  routeFoundations,
} from "@/content/page-content";
import { siteConfig } from "@/lib/config";
import { getPublishedInsightsBySlugs } from "@/lib/insights/repository";
import { createPageMetadata } from "@/lib/metadata";
import { createHubSpotReviewStructuredData } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

const content = routeFoundations.review;
const auditInsightSlug = "signs-your-hubspot-portal-needs-an-audit";

export const metadata = createPageMetadata({
  description:
    "A senior HubSpot audit and CRM portal review for organisations in the United States and New Zealand, with findings and prioritised next steps.",
  path: content.path,
  title: "HubSpot CRM audit and portal review",
});

export default async function HubSpotReviewPage() {
  const [relatedInsight] = await getPublishedInsightsBySlugs([
    auditInsightSlug,
  ]);
  const reviewIcons: SystemIconName[] = [
    "review-findings",
    "review-risk",
    "review-priorities",
    "review-roadmap",
  ];

  return (
    <>
      <StructuredData data={createHubSpotReviewStructuredData()} />
      <RouteFoundation
        actions={
          <>
            <Button href="/contact" showArrow>
              Request a HubSpot review
            </Button>
            <Button href={`/insights/${auditInsightSlug}`} variant="secondary">
              Read the portal audit guide
            </Button>
          </>
        }
        consultationHref={siteConfig.bookingUrl ?? "/contact"}
        route="review"
        showGlobalCta={false}
      >
        <Section surface="paper">
          <Container>
            <div className="grid gap-12 lg:grid-cols-12">
              <SectionHeading
                body="A structured HubSpot audit is useful when recurring issues point to a system problem, not one isolated setting. 42 provides senior-led HubSpot reviews for mid-market organisations in the United States and New Zealand."
                className="lg:col-span-5"
                eyebrow="Who the review is for"
                index="01"
                title="When familiar workarounds start hiding bigger problems."
              />
              <Stagger className="grid gap-3 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
                {reviewSignals.map((signal, index) => (
                  <CardEntrance className="h-full" key={signal}>
                    <Surface className="flex h-full min-h-52 flex-col justify-between p-6">
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        S/{String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-10 text-xl leading-snug font-semibold tracking-[-0.035em]">
                        {signal}
                      </h3>
                    </Surface>
                  </CardEntrance>
                ))}
              </Stagger>
            </div>
          </Container>
        </Section>

        <Section surface="muted">
          <Container>
            <SectionHeading
              body="The review looks across configuration, data, automation, reporting, integrations, governance, and the way people actually use the platform."
              eyebrow="What gets reviewed"
              index="02"
              title="Look at the system, not one symptom."
            />
            <div className="mt-10 flex max-w-5xl flex-wrap gap-2">
              {reviewAreas.map((area) => (
                <CapabilityTag key={area}>{area}</CapabilityTag>
              ))}
            </div>
          </Container>
        </Section>

        <Section surface="paper">
          <Container>
            <div className="grid gap-14 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <SectionHeading
                  body="The exact scope, access, format, and outputs are agreed before the review begins."
                  eyebrow="How the review works"
                  index="03"
                  title="A clear route from context to priorities."
                />
                <Stagger className="mt-12 grid gap-3">
                  {reviewProcess.map((step) => (
                    <CardEntrance key={step.number}>
                      <ProcessStep {...step} />
                    </CardEntrance>
                  ))}
                </Stagger>
              </div>
              <div className="lg:col-span-4 lg:col-start-9 lg:pt-28">
                <Surface className="p-6 md:p-8" tone="muted">
                  <p className="font-mono text-xs tracking-[0.12em] text-[var(--text-muted)] uppercase">
                    Useful context before the review
                  </p>
                  <ul className="mt-7 space-y-5">
                    {reviewPreparation.map((item, index) => (
                      <li
                        className="grid grid-cols-[2rem_1fr] gap-3"
                        key={item}
                      >
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

        <Section surface="dark">
          <Container>
            <SectionHeading
              body="The aim is to make the current state easier to understand and the next decision easier to make. These are outcomes, not fixed commercial deliverables."
              eyebrow="What the review clarifies"
              index="04"
              title="Find the causes, dependencies, and practical order of work."
            />
            <Stagger className="mt-12 grid gap-3 md:grid-cols-2">
              {reviewOutcomes.map(([title, body], index) => (
                <CardEntrance className="h-full" key={title}>
                  <Surface
                    className="flex h-full min-h-72 flex-col p-6 md:p-8"
                    tone="dark"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-xs text-white/52">
                        O/{String(index + 1).padStart(2, "0")}
                      </span>
                      <SystemIcon
                        className="size-12 text-paper-50"
                        name={reviewIcons[index]}
                      />
                    </div>
                    <h3 className="mt-12 text-2xl font-semibold tracking-[-0.04em]">
                      {title}
                    </h3>
                    <p className="mt-4 max-w-[48ch] text-sm leading-6 text-white/62">
                      {body}
                    </p>
                  </Surface>
                </CardEntrance>
              ))}
            </Stagger>
          </Container>
        </Section>

        {relatedInsight ? (
          <Section surface="paper">
            <Container>
              <div className="grid items-start gap-12 lg:grid-cols-12">
                <SectionHeading
                  body="Use this guide to recognise when recurring portal issues need a structured review instead of another isolated fix."
                  className="lg:col-span-5"
                  eyebrow="Related insight"
                  index="05"
                  title="Start with the signals already in front of you."
                />
                <div className="lg:col-span-6 lg:col-start-7">
                  <InsightCard insight={relatedInsight} />
                </div>
              </div>
            </Container>
          </Section>
        ) : null}

        <Section surface="muted">
          <Container>
            <CtaPanel
              body="Share the questions, symptoms, or decisions behind the review. The first conversation is for clarifying the context and agreeing a sensible scope."
              eyebrow="HubSpot portal review"
              href="/contact"
              label="Request a HubSpot review"
              title="Get a clearer view of what to fix first."
            />
          </Container>
        </Section>
      </RouteFoundation>
    </>
  );
}
