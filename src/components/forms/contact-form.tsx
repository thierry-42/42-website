"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type EmbedState = "disabled" | "loading" | "ready" | "error";
type SubmissionState = "idle" | "success";

type ContactFormProps = {
  contactEmail: string;
  deploymentEnvironment: "development" | "staging" | "production";
  form: {
    formId: string;
    portalId: string;
    region: string;
  } | null;
};

type HubspotEventDetail = {
  formId?: string;
};

type LegacyHubspotMessage = {
  eventName?: string;
  id?: string;
  type?: string;
};

export function ContactForm({
  contactEmail,
  deploymentEnvironment,
  form,
}: ContactFormProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [embedState, setEmbedState] = useState<EmbedState>(
    form ? "loading" : "disabled",
  );
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");

  useEffect(() => {
    if (!form) return;

    const container = containerRef.current;
    if (!container) return;
    const scriptUrl = `https://js-${form.region}.hsforms.net/forms/embed/${form.portalId}.js`;

    const markReady = () => {
      if (container.querySelector("iframe, form")) setEmbedState("ready");
    };
    const isCurrentFormEvent = (event: Event) => {
      const formId = (event as CustomEvent<HubspotEventDetail>).detail?.formId;
      return !formId || formId === form.formId;
    };
    const handleReady = (event: Event) => {
      if (isCurrentFormEvent(event)) setEmbedState("ready");
    };
    const handleSubmissionSuccess = (event: Event) => {
      if (isCurrentFormEvent(event)) setSubmissionState("success");
    };
    const handleLegacyMessage = (event: MessageEvent<unknown>) => {
      if (!event.data || typeof event.data !== "object") return;

      const message = event.data as LegacyHubspotMessage;
      if (message.type !== "hsFormCallback" || message.id !== form.formId)
        return;

      if (message.eventName === "onFormReady") setEmbedState("ready");
      if (message.eventName === "onFormSubmitted") {
        setSubmissionState("success");
      }
    };

    const observer = new MutationObserver(markReady);
    observer.observe(container, { childList: true, subtree: true });
    window.addEventListener("hs-form-event:on-ready", handleReady);
    window.addEventListener(
      "hs-form-event:on-submission:success",
      handleSubmissionSuccess,
    );
    window.addEventListener("message", handleLegacyMessage);

    const script = document.createElement("script");
    script.defer = true;
    script.src = scriptUrl;
    script.dataset.company42HubspotForm = form.portalId;
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
      window.removeEventListener("hs-form-event:on-ready", handleReady);
      window.removeEventListener(
        "hs-form-event:on-submission:success",
        handleSubmissionSuccess,
      );
      window.removeEventListener("message", handleLegacyMessage);
      script.remove();
    };
  }, [form]);

  return (
    <div
      className="surface-texture relative overflow-hidden rounded-xl border border-ink-950/16 bg-white shadow-[0_1.5rem_5rem_rgb(9_11_16/0.09)]"
      data-testid="hubspot-form-shell"
    >
      <div className="flex items-center justify-between gap-4 border-b border-ink-950/12 px-5 py-4 font-mono text-[0.625rem] tracking-[0.12em] text-ink-950/60 uppercase sm:px-8">
        <span>Enquiry form / 01</span>
        <span className="inline-flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-signal-500" />
          {form ? "Secure HubSpot form" : "Email fallback active"}
        </span>
      </div>

      <div className="relative p-5 sm:p-8">
        {submissionState === "success" ? (
          <div
            className="bg-signal-100 mb-6 rounded-md border border-signal-500/50 p-4 text-sm leading-6 text-ink-950"
            data-testid="hubspot-form-success"
            role="status"
          >
            Thank you. Your enquiry has been submitted to 42.
          </div>
        ) : null}
        {embedState === "loading" ? <FormLoadingState /> : null}
        {embedState === "error" ? (
          <FormErrorState contactEmail={contactEmail} />
        ) : null}
        {embedState === "disabled" ? (
          <FormDisabledState
            contactEmail={contactEmail}
            deploymentEnvironment={deploymentEnvironment}
          />
        ) : null}

        {form ? (
          <div
            className={cn(
              "hs-form-frame transition-opacity duration-200",
              embedState === "ready"
                ? "opacity-100"
                : "pointer-events-none absolute inset-0 opacity-0",
            )}
            data-form-id={form.formId}
            data-portal-id={form.portalId}
            data-region={form.region}
            ref={containerRef}
          />
        ) : null}

        {form && embedState === "ready" ? (
          <p className="mt-6 border-t border-ink-950/12 pt-5 text-xs leading-5 text-ink-950/62">
            When you submit this form, 42 and HubSpot process the information
            you provide so that 42 can review and respond to your enquiry. Read
            the{" "}
            <Link className="font-semibold underline" href="/privacy">
              Privacy Policy
            </Link>
            .
          </p>
        ) : null}

        <noscript>
          <p className="text-sm leading-6 text-ink-950/70">
            JavaScript is required to load the enquiry form. Email{" "}
            <a className="underline" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>{" "}
            instead.
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

function FormErrorState({ contactEmail }: { contactEmail: string }) {
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
        HubSpot from loading. Refresh the page to try again, or email{" "}
        <a className="font-semibold underline" href={`mailto:${contactEmail}`}>
          {contactEmail}
        </a>
        .
      </p>
      <Button className="mt-7" onClick={() => window.location.reload()}>
        Refresh form
      </Button>
    </div>
  );
}

function FormDisabledState({
  contactEmail,
  deploymentEnvironment,
}: {
  contactEmail: string;
  deploymentEnvironment: ContactFormProps["deploymentEnvironment"];
}) {
  const isProduction = deploymentEnvironment === "production";

  return (
    <div className="flex min-h-80 flex-col items-start justify-center rounded-lg border border-ink-950/12 bg-paper-100 p-6 sm:p-8">
      <p className="font-mono text-[0.625rem] tracking-[0.12em] text-ink-950/60 uppercase">
        {isProduction
          ? "Production form pending"
          : "Form configuration pending"}
      </p>
      <h2 className="mt-4 max-w-[20ch] text-3xl leading-tight font-semibold tracking-[-0.04em]">
        {isProduction
          ? "The production enquiry form is not configured yet."
          : "The staging enquiry form is not configured here."}
      </h2>
      <p className="mt-4 max-w-[52ch] text-sm leading-6 text-[var(--text-muted)]">
        {isProduction
          ? "Production never falls back to the staging form. "
          : "All three environment-specific HubSpot values are required. "}
        You can still contact 42 at{" "}
        <a className="font-semibold underline" href={`mailto:${contactEmail}`}>
          {contactEmail}
        </a>
        .
      </p>
    </div>
  );
}
