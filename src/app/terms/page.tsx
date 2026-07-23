import { LegalDocument } from "@/components/sections/legal-review";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { termsOfUse } from "@/content/legal-content";
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
      <LegalDocument
        contactEmail={siteConfig.contactEmail}
        document={termsOfUse}
      />
    </RouteFoundation>
  );
}
