"use client";

import { useState, type FormEvent } from "react";

import {
  CheckboxField,
  FormField,
  SelectField,
  TextareaField,
} from "@/components/forms/fields";
import { Button } from "@/components/ui/button";

type SubmissionState =
  "idle" | "submitting" | "success" | "error" | "unconfigured";

const hubspotStatuses = [
  "We already use HubSpot",
  "We are implementing HubSpot",
  "We are considering HubSpot",
  "We are migrating from another CRM",
  "We need a custom integration",
  "Not sure yet",
];

const challenges = [
  "Strategy or portal review",
  "Implementation",
  "CRM cleanup or RevOps",
  "Automation",
  "Integration or custom development",
  "Website or Content Hub",
  "Service Hub",
  "Managed support",
  "Other",
];

export function ContactForm({ endpoint }: { endpoint?: string }) {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (formData.get("website-check")) {
      setSubmissionState("success");
      form.reset();
      return;
    }

    if (!endpoint) {
      setSubmissionState("unconfigured");
      return;
    }

    setSubmissionState("submitting");

    try {
      const response = await fetch(endpoint, {
        body: formData,
        headers: { Accept: "application/json" },
        method: "POST",
      });

      if (!response.ok) throw new Error("Submission failed");

      form.reset();
      setSubmissionState("success");
    } catch {
      setSubmissionState("error");
    }
  }

  return (
    <form className="grid gap-6" noValidate={false} onSubmit={handleSubmit}>
      <div aria-hidden="true" className="absolute -left-[9999px]" tabIndex={-1}>
        <label htmlFor="website-check">Leave this field empty</label>
        <input
          autoComplete="off"
          id="website-check"
          name="website-check"
          tabIndex={-1}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          autoComplete="given-name"
          id="first-name"
          label="First name"
          name="firstName"
          required
        />
        <FormField
          autoComplete="family-name"
          id="last-name"
          label="Last name"
          name="lastName"
          required
        />
      </div>
      <FormField
        autoComplete="email"
        id="work-email"
        label="Work email"
        name="email"
        required
        type="email"
      />
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          autoComplete="organization"
          id="company"
          label="Company"
          name="company"
          required
        />
        <FormField
          autoComplete="organization-title"
          id="role"
          label="Role"
          name="role"
        />
      </div>
      <FormField
        autoComplete="url"
        id="website"
        label="Website"
        name="website"
        type="url"
      />
      <SelectField
        id="hubspot-status"
        label="HubSpot status"
        name="hubspotStatus"
        required
      >
        <option value="">Select your current status</option>
        {hubspotStatuses.map((status) => (
          <option key={status}>{status}</option>
        ))}
      </SelectField>
      <SelectField
        id="primary-challenge"
        label="Primary challenge"
        name="primaryChallenge"
        required
      >
        <option value="">Select the closest fit</option>
        {challenges.map((challenge) => (
          <option key={challenge}>{challenge}</option>
        ))}
      </SelectField>
      <FormField
        id="project-timing"
        label="Project timing"
        name="projectTiming"
        placeholder="For example, this quarter"
      />
      <TextareaField
        id="message"
        label="What is happening?"
        name="message"
        placeholder="Share the problem, current setup, or outcome you are working towards."
        required
      />
      <CheckboxField
        description="The approved privacy notice will define the final consent wording before launch."
        id="consent"
        label="I agree that 42 may use these details to respond to this enquiry."
        name="consent"
        required
      />

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Button
          disabled={submissionState === "submitting"}
          showArrow
          type="submit"
        >
          {submissionState === "submitting" ? "Sending…" : "Send enquiry"}
        </Button>
        <div aria-live="polite" className="text-sm" role="status">
          {submissionState === "success"
            ? "Thank you. Your enquiry has been sent."
            : null}
          {submissionState === "error"
            ? "The enquiry could not be sent. Please try again later."
            : null}
          {submissionState === "unconfigured"
            ? "This review form is not connected yet. No information has been sent or stored."
            : null}
        </div>
      </div>
    </form>
  );
}
