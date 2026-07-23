import { LegalDocument } from "@/components/sections/legal-review";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { privacyPolicy } from "@/content/legal-content";
import { routeFoundations } from "@/content/page-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

const content = routeFoundations.privacy;

export const metadata = createPageMetadata({
  description: content.description,
  path: content.path,
  title: "Privacy Policy",
});

export default function PrivacyPage() {
  return (
    <RouteFoundation
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      route="privacy"
    >
      <LegalDocument
        contactEmail={siteConfig.contactEmail}
        document={privacyPolicy}
      />
    </RouteFoundation>
  );
}
