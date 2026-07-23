"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type EmbedState = "loading" | "ready" | "error";

type ContactFormProps = {
  formId: string;
  portalId: string;
  region: string;
};

export function ContactForm({ formId, portalId, region }: ContactFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [embedState, setEmbedState] = useState<EmbedState>("loading");
  const scriptUrl = `https://js-${region}.hsforms.net/forms/embed/${portalId}.js`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const markReady = () => {
      if (container.querySelector("iframe, form")) setEmbedState("ready");
    };

    const observer = new MutationObserver(markReady);
    observer.observe(container, { childList: true, subtree: true });

    const script = document.createElement("script");
    script.defer = true;
    script.src = scriptUrl;
    script.dataset.company42HubspotForm = portalId;
    script.addEventListener("load", markReady);
    script.addEventListener("error", () => setEmbedState("error"));
    document.body.appendChild(script);

    markReady();

    const timeout = window.setTimeout(() => {
      if (!container.querySelector("iframe, form")) setEmbedState("error");
    }, 15_000);

    return () => {
      window.clearTimeout(timeout);
      observer.disconnect();
      script.remove();
    };
  }, [portalId, scriptUrl]);

  return (
    <div
      className="surface-texture relative overflow-hidden rounded-xl border border-ink-950/16 bg-white shadow-[0_1.5rem_5rem_rgb(9_11_16/0.09)]"
      data-testid="hubspot-form-shell"
    >
      <div className="flex items-center justify-between gap-4 border-b border-ink-950/12 px-5 py-4 font-mono text-[0.625rem] tracking-[0.12em] text-ink-950/60 uppercase sm:px-8">
        <span>Enquiry form / 01</span>
        <span className="inline-flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-signal-500" />
          HubSpot connected
        </span>
      </div>

      <div className="relative p-5 sm:p-8">
        {embedState === "loading" ? <FormLoadingState /> : null}
        {embedState === "error" ? <FormErrorState /> : null}

        <div
          className={cn(
            "hs-form-frame transition-opacity duration-200",
            embedState === "ready"
              ? "opacity-100"
              : "pointer-events-none absolute inset-0 opacity-0",
          )}
          data-form-id={formId}
          data-portal-id={portalId}
          data-region={region}
          ref={containerRef}
        />

        <noscript>
          <p className="text-sm leading-6 text-ink-950/70">
            JavaScript is required to load the enquiry form.
          </p>
        </noscript>
      </div>
    </div>
  );
}

function FormLoadingState() {
  return (
    <div
      aria-live="polite"
      className="hubspot-form-loading min-h-[44rem]"
      data-testid="hubspot-form-loading"
      role="status"
    >
      <p className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-950/55 uppercase">
        Loading secure form
      </p>
      <div
        aria-hidden="true"
        className="mt-8 grid gap-6 motion-safe:animate-pulse"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <span className="h-14 rounded-sm bg-paper-100" />
          <span className="h-14 rounded-sm bg-paper-100" />
        </div>
        <span className="h-14 rounded-sm bg-paper-100" />
        <div className="grid gap-6 sm:grid-cols-2">
          <span className="h-14 rounded-sm bg-paper-100" />
          <span className="h-14 rounded-sm bg-paper-100" />
        </div>
        <span className="h-14 rounded-sm bg-paper-100" />
        <span className="h-36 rounded-sm bg-paper-100" />
        <span className="h-12 w-44 rounded-sm bg-paper-100" />
      </div>
    </div>
  );
}

function FormErrorState() {
  return (
    <div
      className="flex min-h-80 flex-col items-start justify-center rounded-lg border border-ink-950/12 bg-paper-100 p-6 sm:p-8"
      role="alert"
    >
      <p className="font-mono text-[0.625rem] tracking-[0.12em] text-hubspot-coral uppercase">
        Form unavailable
      </p>
      <h2 className="mt-4 max-w-[18ch] text-3xl leading-tight font-semibold tracking-[-0.04em]">
        The enquiry form could not be loaded.
      </h2>
      <p className="mt-4 max-w-[48ch] text-sm leading-6 text-[var(--text-muted)]">
        A content blocker or temporary connection problem may be preventing
        HubSpot from loading. Refresh the page to try again.
      </p>
      <Button className="mt-7" onClick={() => window.location.reload()}>
        Refresh form
      </Button>
    </div>
  );
}
