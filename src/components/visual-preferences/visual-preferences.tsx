"use client";

import { useEffect, useRef, useState } from "react";

import {
  applyVisualPreferences,
  defaultVisualPreferences,
  isVisualPreferencesValue,
  visualPreferencesStorageKey,
  type VisualPreferencesValue,
} from "@/lib/visual-preferences";

const appearanceOptions = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
] as const;

const visionOptions = [
  { label: "Standard", value: "standard" },
  { label: "Protan support", value: "protan" },
  { label: "Deutan support", value: "deutan" },
  { label: "Tritan support", value: "tritan" },
  { label: "Monochrome", value: "monochrome" },
] as const;

const contrastOptions = [
  { label: "Standard contrast", value: "standard" },
  { label: "High contrast", value: "high" },
] as const;

function readRootPreferences(): VisualPreferencesValue {
  const root = document.documentElement;
  const candidate = {
    appearance: root.dataset.appearance,
    visionMode: root.dataset.visionMode,
    contrastMode: root.dataset.contrastMode,
  };

  return isVisualPreferencesValue(candidate)
    ? candidate
    : defaultVisualPreferences;
}

function storePreferences(preferences: VisualPreferencesValue) {
  try {
    window.localStorage.setItem(
      visualPreferencesStorageKey,
      JSON.stringify(preferences),
    );
  } catch {
    // Preferences still apply for the current page when storage is unavailable.
  }
}

export function VisualPreferences() {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState(() =>
    typeof document === "undefined"
      ? defaultVisualPreferences
      : readRootPreferences(),
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
      window.requestAnimationFrame(() => closeRef.current?.focus());
      return;
    }

    if (hasOpenedRef.current) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function updatePreference<Key extends keyof VisualPreferencesValue>(
    key: Key,
    value: VisualPreferencesValue[Key],
  ) {
    setPreferences((current) => {
      const next = { ...current, [key]: value };
      applyVisualPreferences(next);
      storePreferences(next);
      return next;
    });
  }

  function resetPreferences() {
    setPreferences(defaultVisualPreferences);
    applyVisualPreferences(defaultVisualPreferences);

    try {
      window.localStorage.removeItem(visualPreferencesStorageKey);
    } catch {
      // The defaults still apply for the current page.
    }
  }

  return (
    <div
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-[max(0.75rem,env(safe-area-inset-left))] z-[90]"
      data-native-cursor
    >
      {isOpen ? (
        <section
          aria-labelledby="visual-preferences-title"
          className="absolute bottom-[calc(100%+0.75rem)] left-0 flex max-h-[min(42rem,calc(100dvh-6rem))] w-[min(22rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-lg border-2 border-[var(--colour-border-strong)] bg-[var(--colour-surface-raised)] text-[var(--colour-text)] shadow-lift"
          id="visual-preferences-panel"
        >
          <header
            className="shrink-0 border-b border-[var(--colour-border)] p-5 pb-4"
            data-testid="visual-preferences-header"
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[0.625rem] tracking-[0.12em] text-[var(--colour-text-muted)] uppercase">
                  Display controls
                </p>
                <h2
                  className="mt-1 text-xl font-semibold tracking-[-0.035em] text-[var(--colour-heading)]"
                  id="visual-preferences-title"
                >
                  Visual preferences
                </h2>
              </div>
              <button
                aria-label="Close visual preferences"
                className="grid size-11 shrink-0 place-items-center rounded-sm border border-[var(--colour-border-strong)] bg-[var(--colour-surface)] text-[var(--colour-text)] hover:bg-[var(--colour-surface-subtle)]"
                onClick={() => setIsOpen(false)}
                ref={closeRef}
                type="button"
              >
                <ClosePreferencesIcon />
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--colour-text-muted)]">
              Adjust the site presentation without changing photographs or
              sending your choice to 42 or HubSpot.
            </p>
          </header>

          <div
            className="visual-preferences-body min-h-0 flex-1 [scrollbar-gutter:stable] overflow-y-auto overscroll-contain py-5 pr-2 pl-5"
            data-testid="visual-preferences-body"
          >
            <div className="grid gap-6 pr-2">
              <PreferenceGroup
                legend="Appearance"
                name="appearance"
                onChange={(value) =>
                  updatePreference(
                    "appearance",
                    value as VisualPreferencesValue["appearance"],
                  )
                }
                options={appearanceOptions}
                selected={preferences.appearance}
              />
              <PreferenceGroup
                description="Support palettes are not diagnostic tools or exact medical simulations."
                legend="Colour vision"
                name="vision-mode"
                onChange={(value) =>
                  updatePreference(
                    "visionMode",
                    value as VisualPreferencesValue["visionMode"],
                  )
                }
                options={visionOptions}
                selected={preferences.visionMode}
              />
              <PreferenceGroup
                legend="Contrast"
                name="contrast-mode"
                onChange={(value) =>
                  updatePreference(
                    "contrastMode",
                    value as VisualPreferencesValue["contrastMode"],
                  )
                }
                options={contrastOptions}
                selected={preferences.contrastMode}
              />
            </div>
          </div>

          <footer
            className="shrink-0 border-t border-[var(--colour-border)] p-4"
            data-testid="visual-preferences-footer"
          >
            <button
              className="min-h-11 w-full rounded-sm border border-[var(--colour-border-strong)] bg-[var(--colour-action-secondary)] px-4 py-2.5 text-sm font-semibold text-[var(--colour-action-secondary-text)] hover:opacity-90"
              onClick={resetPreferences}
              type="button"
            >
              Reset visual preferences
            </button>
          </footer>
        </section>
      ) : null}

      <button
        aria-controls="visual-preferences-panel"
        aria-expanded={isOpen}
        aria-label="Open visual preferences"
        className="group inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[var(--colour-border-strong)] bg-[var(--colour-surface-inverse)] px-4 py-2.5 text-sm font-semibold text-[var(--colour-text-inverse)] shadow-lift hover:bg-[var(--colour-action)] hover:text-[var(--colour-action-text)]"
        onClick={() => setIsOpen((current) => !current)}
        ref={triggerRef}
        type="button"
      >
        <PreferencesIcon />
        <span>Visual preferences</span>
      </button>
    </div>
  );
}

type PreferenceOption = {
  label: string;
  value: string;
};

function PreferenceGroup({
  description,
  legend,
  name,
  onChange,
  options,
  selected,
}: {
  description?: string;
  legend: string;
  name: string;
  onChange: (value: string) => void;
  options: readonly PreferenceOption[];
  selected: string;
}) {
  const descriptionId = description ? `${name}-description` : undefined;

  return (
    <fieldset
      aria-describedby={descriptionId}
      className="m-0 min-w-0 border-0 p-0"
    >
      <legend className="text-sm font-semibold text-[var(--colour-heading)]">
        {legend}
      </legend>
      {description ? (
        <p
          className="mt-1 text-xs leading-5 text-[var(--colour-text-muted)]"
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
      <div className="mt-3 grid gap-2">
        {options.map((option) => (
          <label
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm border border-[var(--colour-border)] bg-[var(--colour-surface)] px-3 py-2 text-sm hover:border-[var(--colour-border-strong)]"
            key={option.value}
          >
            <input
              checked={selected === option.value}
              className="size-4 shrink-0 accent-[var(--colour-action)]"
              name={name}
              onChange={() => onChange(option.value)}
              type="radio"
              value={option.value}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PreferencesIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M4 7h8m4 0h4M4 17h4m4 0h8M12 4v6M8 14v6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <circle cx="14" cy="7" fill="currentColor" r="2" />
      <circle cx="10" cy="17" fill="currentColor" r="2" />
    </svg>
  );
}

function ClosePreferencesIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
