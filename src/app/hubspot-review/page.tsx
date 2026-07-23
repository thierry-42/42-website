import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { SectionHeading } from "@/components/sections/section-heading";
import { CapabilityTag } from "@/components/ui/capability-tag";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Surface } from "@/components/ui/surface";
import { SystemIcon, type SystemIconName } from "@/components/ui/system-icons";
import { Heading } from "@/components/ui/typography";
import { reviewAreas, routeFoundations } from "@/content/page-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

const content = routeFoundations.review;
export const metadata = createPageMetadata({
  description: content.description,
  path: content.path,
  title: "HubSpot portal review",
});

export default function HubSpotReviewPage() {
  const resultIcons: SystemIconName[] = [
    "review-findings",
    "review-risk",
    "review-priorities",
    "review-roadmap",
  ];

  return (
    <RouteFoundation
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      route="review"
    >
      <Section surface="paper">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Eyebrow index="01">Review areas</Eyebrow>
              <Heading size="h2">Look at the system, not one symptom.</Heading>
            </div>
            <div className="flex flex-wrap content-start gap-3 lg:col-span-6 lg:col-start-7">
              {reviewAreas.map((area) => (
                <CapabilityTag
                  context={area === "Integrations" ? "hubspot" : "default"}
                  key={area}
                >
                  {area}
                </CapabilityTag>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <Section surface="dark">
        <Container>
          <SectionHeading
            body="The review is designed to turn a broad sense that something is wrong into a clear, prioritised view of what deserves attention."
            eyebrow="What the review produces"
            index="02"
            title="A clearer view of the portal and what to do next."
          />
          <Stagger className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Evidence-based findings",
              "Risks and dependencies",
              "Prioritised improvements",
              "A practical next-step roadmap",
            ].map((item, index) => (
              <CardEntrance className="h-full" key={item}>
                <Surface
                  className="h-full min-h-52 border-white/14 p-6"
                  tone="dark"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-xs text-white/48">
                      R/{String(index + 1).padStart(2, "0")}
                    </p>
                    <SystemIcon
                      className="size-12 text-paper-50"
                      name={resultIcons[index]}
                    />
                  </div>
                  <h3 className="mt-16 max-w-[18ch] text-xl font-semibold tracking-[-0.035em]">
                    {item}
                  </h3>
                </Surface>
              </CardEntrance>
            ))}
          </Stagger>
        </Container>
      </Section>
      <Section surface="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <SectionHeading
              className="lg:col-span-5"
              body="A useful review needs enough context to distinguish a portal symptom from the process, data, ownership, or integration decision behind it."
              eyebrow="Before the review"
              index="03"
              title="Bring the context that makes the findings useful."
            />
            <ul className="grid gap-3 lg:col-span-6 lg:col-start-7">
              {[
                "The business questions the portal should help answer",
                "The teams, processes, and systems that depend on HubSpot",
                "Known data, reporting, adoption, or automation concerns",
                "Recent changes and the decisions currently blocked",
              ].map((item, index) => (
                <li key={item}>
                  <Surface className="grid grid-cols-[3rem_1fr] gap-4 p-5">
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-semibold tracking-[-0.02em]">
                      {item}
                    </span>
                  </Surface>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </RouteFoundation>
  );
}
