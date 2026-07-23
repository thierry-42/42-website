import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CardEntrance, Stagger } from "@/components/motion/reveal";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { SectionHeading } from "@/components/sections/section-heading";
import { Surface } from "@/components/ui/surface";
import { SystemIcon, type SystemIconName } from "@/components/ui/system-icons";
import { routeFoundations } from "@/content/page-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

const content = routeFoundations.contact;

export const metadata = createPageMetadata({
  description: content.description,
  path: content.path,
  title: "Contact",
});

export default function ContactPage() {
  const nextStepIcons: SystemIconName[] = [
    "contact-context",
    "contact-question",
    "contact-next",
  ];

  return (
    <RouteFoundation
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      route="contact"
      showGlobalCta={false}
    >
      <Section surface="paper">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-serif text-4xl leading-tight tracking-[-0.04em]">
                Start with the problem. The form can handle the rest.
              </p>
              <p className="mt-6 max-w-[42ch] text-sm leading-6 text-[var(--text-muted)]">
                Share enough context for a useful first response. You do not
                need to arrive with a finished brief.
              </p>
              <p className="mt-6 max-w-[42ch] text-sm leading-6 text-[var(--text-muted)]">
                If the form is unavailable, email{" "}
                <a
                  className="font-semibold text-[var(--foreground)] underline underline-offset-4"
                  href={`mailto:${siteConfig.contactEmail}`}
                >
                  {siteConfig.contactEmail}
                </a>
                . 42 works with mid-market organisations across North America
                and EMEA.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <ContactForm
                contactEmail={siteConfig.contactEmail}
                deploymentEnvironment={siteConfig.deploymentEnvironment}
                form={siteConfig.hubspotForm}
              />
            </div>
          </div>
        </Container>
      </Section>
      <Section surface="muted">
        <Container>
          <SectionHeading
            body="The first conversation is for understanding the question and deciding whether there is a sensible next step instead of forcing the problem into a package."
            eyebrow="What happens next"
            index="02"
            title="A clear first step, without the sales theatre."
          />
          <Stagger className="mt-12 grid gap-3 md:grid-cols-3">
            {[
              [
                "01",
                "Share the context",
                "Describe the portal, process, system, or project that needs attention.",
              ],
              [
                "02",
                "Clarify the question",
                "42 reviews the context and identifies what needs to be understood first.",
              ],
              [
                "03",
                "Choose the next step",
                "If there is a fit, the next step may be a review, discovery, scoped project, or support conversation.",
              ],
            ].map(([number, title, body], index) => (
              <CardEntrance className="h-full" key={number}>
                <Surface className="h-full min-h-64 p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-xs text-[var(--text-muted)]">
                      {number}
                    </p>
                    <SystemIcon
                      className="size-12 text-ink-950"
                      name={nextStepIcons[index]}
                    />
                  </div>
                  <h3 className="mt-12 text-2xl font-semibold tracking-[-0.04em]">
                    {title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
                    {body}
                  </p>
                </Surface>
              </CardEntrance>
            ))}
          </Stagger>
        </Container>
      </Section>
    </RouteFoundation>
  );
}
