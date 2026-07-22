import { LegalReview } from "@/components/sections/legal-review";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { routeFoundations } from "@/content/page-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

const content = routeFoundations.terms;

export const metadata = createPageMetadata({
  description: content.description,
  path: content.path,
  title: "Terms of use",
});

export default function TermsPage() {
  return (
    <RouteFoundation
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      route="terms"
    >
      <LegalReview
        body="No draft terms are presented as a final agreement. Ownership, permitted use, disclaimers, jurisdiction, and legal entity details require appropriate approval."
        sections={[
          "Legal entity and scope of the website terms",
          "Permitted use and prohibited activity",
          "Intellectual property and third-party content",
          "Availability, accuracy, and disclaimers",
          "Liability and indemnity provisions",
          "Governing law, jurisdiction, and updates",
        ]}
      />
    </RouteFoundation>
  );
}
