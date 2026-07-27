export const visualPreferencesStorageKey =
  "company42.visualPreferences.v1" as const;

export const appearances = ["light", "dark"] as const;
export const visionModes = [
  "standard",
  "protan",
  "deutan",
  "tritan",
  "monochrome",
] as const;
export const contrastModes = ["standard", "high"] as const;

export type Appearance = (typeof appearances)[number];
export type VisionMode = (typeof visionModes)[number];
export type ContrastMode = (typeof contrastModes)[number];

export type VisualPreferencesValue = {
  appearance: Appearance;
  visionMode: VisionMode;
  contrastMode: ContrastMode;
};

export const defaultVisualPreferences: VisualPreferencesValue = {
  appearance: "light",
  visionMode: "standard",
  contrastMode: "standard",
};

export function isVisualPreferencesValue(
  value: unknown,
): value is VisualPreferencesValue {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    appearances.includes(candidate.appearance as Appearance) &&
    visionModes.includes(candidate.visionMode as VisionMode) &&
    contrastModes.includes(candidate.contrastMode as ContrastMode)
  );
}

export function normaliseVisualPreferences(
  value: unknown,
): VisualPreferencesValue {
  if (!value || typeof value !== "object") return defaultVisualPreferences;

  const candidate = value as Record<string, unknown>;
  const hasLegacyAppearance =
    candidate.brandTheme === "current" || candidate.brandTheme === "brand-kit";

  return {
    appearance: appearances.includes(candidate.appearance as Appearance)
      ? (candidate.appearance as Appearance)
      : hasLegacyAppearance
        ? "light"
        : defaultVisualPreferences.appearance,
    visionMode: visionModes.includes(candidate.visionMode as VisionMode)
      ? (candidate.visionMode as VisionMode)
      : defaultVisualPreferences.visionMode,
    contrastMode: contrastModes.includes(candidate.contrastMode as ContrastMode)
      ? (candidate.contrastMode as ContrastMode)
      : defaultVisualPreferences.contrastMode,
  };
}

export function applyVisualPreferences(
  preferences: VisualPreferencesValue,
): void {
  const root = document.documentElement;
  delete root.dataset.brandTheme;
  root.dataset.appearance = preferences.appearance;
  root.dataset.visionMode = preferences.visionMode;
  root.dataset.contrastMode = preferences.contrastMode;
}
