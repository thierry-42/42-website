import { LegalReview } from "@/components/sections/legal-review";
import { RouteFoundation } from "@/components/sections/route-foundation";
import { routeFoundations } from "@/content/page-content";
import { siteConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/metadata";

const content = routeFoundations.privacy;

export const metadata = createPageMetadata({
  description: content.description,
  path: content.path,
  title: "Privacy notice",
});

export default function PrivacyPage() {
  return (
    <RouteFoundation
      consultationHref={siteConfig.bookingUrl ?? "/contact"}
      route="privacy"
    >
      <LegalReview
        body="No draft policy is presented as final. Legal entity details, processing activities, retention periods, rights, cookies, analytics, and contact information must be approved first."
        sections={[
          "Legal entity and contact details",
          "Information collected and purposes of processing",
          "Legal bases, sharing, and international transfers",
          "Retention periods and security",
          "User rights and request process",
          "Cookies, analytics, and policy updates",
        ]}
      />
    </RouteFoundation>
  );
}
