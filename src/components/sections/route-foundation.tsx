import type { ReactNode } from "react";

import { GlobalCta } from "@/components/sections/global-cta";
import { PageIntro } from "@/components/sections/page-intro";
import type { RouteFoundationKey } from "@/content/page-content";
import { routeFoundations } from "@/content/page-content";

type RouteFoundationProps = {
  actions?: ReactNode;
  children?: ReactNode;
  consultationHref: string;
  route: RouteFoundationKey;
  showGlobalCta?: boolean;
};

const routeVisuals: Partial<Record<RouteFoundationKey, string>> = {
  about: "/images/editorial/about-systems-workshop-v2.webp",
  approach: "/images/editorial/approach-four-stages-v2.webp",
  audience: "/images/editorial/audience-connected-contexts-v2.webp",
  industries: "/images/editorial/audience-connected-contexts-v2.webp",
  review: "/images/editorial/portal-review-diagnostic-v2.webp",
};

const routeBreadcrumbs: Partial<Record<RouteFoundationKey, string>> = {
  review: "HubSpot audit and portal review",
};

export function RouteFoundation({
  actions,
  children,
  consultationHref,
  route,
  showGlobalCta = true,
}: RouteFoundationProps) {
  const content = routeFoundations[route];
  const imageSrc = routeVisuals[route];

  return (
    <>
      <PageIntro
        actions={actions}
        body={content.description}
        breadcrumb={routeBreadcrumbs[route] ?? content.title}
        eyebrow={content.eyebrow}
        imageSrc={imageSrc}
        path={content.path}
        title={content.title}
        visual={Boolean(imageSrc)}
      />
      {children}
      {showGlobalCta ? <GlobalCta href={consultationHref} /> : null}
    </>
  );
}
