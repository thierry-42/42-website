import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProofIndex } from "@/components/sections/proof-index";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { SectionHeading } from "@/components/sections/section-heading";
import { CaseStudyCard } from "@/components/ui/cards";
import { Surface } from "@/components/ui/surface";
import { routeFoundations } from "@/content/page-content";
import { publicContent, siteContent } from "@/content/site-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

const content = routeFoundations.work;

export const metadata = siteContent.features.work
  ? createPageMetadata({
      description: content.description,
      path: content.path,
      title: "Work",
    })
  : { robots: { follow: false, index: false } };

export default function WorkPage() {
  if (!siteContent.features.work) notFound();

  const hasApprovedWork = publicContent.caseStudies.length > 0;

  return (
    <RouteFoundation
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      route="work"
    >
      {hasApprovedWork ? (
        <Section surface="paper">
          <Container>
            <SectionHeading
              body="Each published case study connects the business question to the architecture, implementation, and approved outcome."
              eyebrow="Published work"
              index="01"
              title="Specific problems. Working answers."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {publicContent.caseStudies.map((caseStudy) => (
                <CaseStudyCard caseStudy={caseStudy} key={caseStudy.slug} />
              ))}
            </div>
          </Container>
        </Section>
      ) : (
        <ProofIndex
          body="Client names, project details, visuals, and outcomes remain hidden until every record passes the public proof gate."
          criteria={[
            "The client and relationship are approved for publication",
            "The problem and delivered scope are factually verified",
            "Every outcome has an approved source",
            "Visuals contain no confidential customer or portal data",
            "The final record is marked published and non-placeholder",
          ]}
          eyebrow="Selected work"
          title="Proof should be specific and approved."
        />
      )}

      <Section surface="dark">
        <Container>
          <SectionHeading
            body="The work library is designed to show the thinking and system behind a project, not turn unverified claims into decoration."
            eyebrow="Case study structure"
            index="02"
            title="Every published story will answer four questions."
          />
          <div className="mt-12 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["01", "What was getting in the way?"],
              ["02", "What did the system need to do?"],
              ["03", "What did 42 design and build?"],
              ["04", "What approved outcome followed?"],
            ].map(([number, title]) => (
              <Surface
                className="min-h-56 border-white/14 p-6"
                key={number}
                tone="dark"
              >
                <p className="font-mono text-xs text-white/48">Q/{number}</p>
                <h3 className="mt-20 max-w-[18ch] text-xl font-semibold tracking-[-0.035em]">
                  {title}
                </h3>
              </Surface>
            ))}
          </div>
        </Container>
      </Section>
    </RouteFoundation>
  );
}
