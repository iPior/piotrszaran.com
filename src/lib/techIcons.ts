import { getTechnology } from "./technologies";

export const THEME_SIMPLE_ICON_COLOR_PLACEHOLDER =
  "__THEME_SIMPLE_ICON_COLOR__";
const DEFAULT_THEME_SIMPLE_ICON_COLOR = "e2e8f0";

/**
 * Swaps a broken icon for its fallback source, then for a monogram.
 * Inlined as an `onerror` attribute so it works without shipping a script.
 */
export const TECH_ICON_ONERROR =
  "if (this.dataset.fallbackSrc && this.src !== this.dataset.fallbackSrc) { this.src = this.dataset.fallbackSrc; return; } this.style.display='none'; const fallback = this.parentElement && this.parentElement.querySelector('[data-icon-fallback]'); if (fallback) fallback.style.display='flex';";

export interface TechIconSources {
  primary: string | null;
  fallback: string | null;
  fallbackTemplate: string | null;
}

export const getMonogram = (tech: string): string => {
  const cleaned = tech.replace(/[^a-zA-Z0-9+\s]/g, " ").trim();
  if (!cleaned) return "?";

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();

  return cleaned.slice(0, 2).toUpperCase();
};

/**
 * Backing colour for the icon tile. Pass `smOnly` when the tile only appears
 * from `sm` up, so the colour is not painted behind a bare mobile mark.
 */
export const getIconBgClass = (tech: string, smOnly = false): string => {
  const background = getTechnology(tech)?.iconBackground;
  return smOnly
    ? (background?.sm ?? "sm:bg-site-surface-hover")
    : (background?.base ?? "bg-site-surface-hover");
};

export const getIconSources = (tech: string): TechIconSources => {
  const technology = getTechnology(tech);
  const skillId = technology?.skillIcon;
  const simpleId = technology?.simpleIcon;
  const customIcon = technology?.customIcon;
  const isThemeAwareSimpleIcon = technology?.themeAware ?? false;
  const simplePath = simpleId
    ? `https://cdn.simpleicons.org/${simpleId}${
        isThemeAwareSimpleIcon ? `/${DEFAULT_THEME_SIMPLE_ICON_COLOR}` : ""
      }`
    : null;
  const simpleTemplate =
    simpleId && isThemeAwareSimpleIcon
      ? `https://cdn.simpleicons.org/${simpleId}/${THEME_SIMPLE_ICON_COLOR_PLACEHOLDER}`
      : null;

  return {
    primary:
      customIcon ??
      (skillId ? `https://skillicons.dev/icons?i=${skillId}` : null),
    fallback: simplePath,
    fallbackTemplate: simpleTemplate,
  };
};
