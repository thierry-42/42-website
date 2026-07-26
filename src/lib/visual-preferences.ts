export const visualPreferencesStorageKey =
  "company42.visualPreferences.v1" as const;

export const brandThemes = ["current", "brand-kit"] as const;
export const visionModes = [
  "standard",
  "protan",
  "deutan",
  "tritan",
  "monochrome",
] as const;
export const contrastModes = ["standard", "high"] as const;

export type BrandTheme = (typeof brandThemes)[number];
export type VisionMode = (typeof visionModes)[number];
export type ContrastMode = (typeof contrastModes)[number];

export type VisualPreferencesValue = {
  brandTheme: BrandTheme;
  visionMode: VisionMode;
  contrastMode: ContrastMode;
};

export const defaultVisualPreferences: VisualPreferencesValue = {
  brandTheme: "current",
  visionMode: "standard",
  contrastMode: "standard",
};

export function isVisualPreferencesValue(
  value: unknown,
): value is VisualPreferencesValue {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    brandThemes.includes(candidate.brandTheme as BrandTheme) &&
    visionModes.includes(candidate.visionMode as VisionMode) &&
    contrastModes.includes(candidate.contrastMode as ContrastMode)
  );
}

export function applyVisualPreferences(
  preferences: VisualPreferencesValue,
): void {
  const root = document.documentElement;
  root.dataset.brandTheme = preferences.brandTheme;
  root.dataset.visionMode = preferences.visionMode;
  root.dataset.contrastMode = preferences.contrastMode;
}
