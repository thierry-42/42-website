import { Button } from "@/components/ui/button";
import { PageIntro } from "@/components/sections/page-intro";

export default function NotFound() {
  return (
    <PageIntro
      actions={
        <>
          <Button href="/" showArrow>
            Return home
          </Button>
          <Button href="/contact" variant="secondary">
            Find your HubSpot answer
          </Button>
        </>
      }
      body="The answer you need is probably still here."
      eyebrow="Error 404"
      title="This page may be lost somewhere in the digital universe."
    />
  );
}
